import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

const BACKEND_URL = (process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 8000}`).trim().replace(/\/+$/, "");
const FRONTEND_URL = (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0].trim().replace(/\/+$/, "");

// Resend can only deliver to arbitrary recipients once a domain is verified.
// Until then, deployed environments skip the verification gate so real users
// aren't locked out by an email that will never arrive.
const REQUIRE_EMAIL_VERIFICATION = process.env.REQUIRE_EMAIL_VERIFICATION === "true";


/**
 * @desc register user and return jwt token
 * @route Post/api/auth/register
 * @access Public 
 * @body {email, username, password}
 */

export async function register(req, res) {
    
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { email}, {username} ]
    })

    if (isUserAlreadyExists){
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        })

    }

    const user = await userModel.create({
        username,
        email,
        password,
        // No verified Resend domain yet, so we can't email arbitrary
        // recipients outside of localhost - see REQUIRE_EMAIL_VERIFICATION.
        verified: !REQUIRE_EMAIL_VERIFICATION,
    })

    let emailSent = false;

    if (REQUIRE_EMAIL_VERIFICATION) {
        const emailVerificationToken = jwt.sign({
            email: user.email,
        }, process.env.JWT_SECRET)

        // Awaited (not fire-and-forget): Resend is an HTTPS API call, not an SMTP
        // handshake, so this is fast enough to confirm before responding - and the
        // client needs to know if the verification mail actually went out.
        try {
            await sendEmail({
                to: email,
                subject: "Welcome to DeepOcean!",
                html: `
    <p>Hi ${username},</p>

    <p>Thank you for registering at <strong>DeepOcean</strong>. We're excited to have you on board!</p>

    <p>Please verify your email address by clicking the link below:</p>

    <a href="${BACKEND_URL}/api/auth/verify-email?token=${emailVerificationToken}">
      Verify Email
    </a>

    <p>If you did not create an account, please ignore this email.</p>

    <p>Best regards,<br><b>The DeepOcean Team</b></p>
  `
            });
            emailSent = true;
        } catch (err) {
            console.error("Failed to send verification email:", err);
        }
    }

    res.status(201).json({
        message: !REQUIRE_EMAIL_VERIFICATION
            ? "User registered successfully."
            : emailSent
                ? "User registered successfully. Check your email to verify your account."
                : "User registered successfully, but the verification email could not be sent. Please contact support.",
        success: true,
        emailSent,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @desc login user and return jwt token
 * @route Post/api/auth/login
 * @access Public 
 * @body {email, password}
 */

export async function login(req, res) {
    const {email, password} = req.body;
    const user = await userModel.findOne({ email })

    if(!user) {
        return res.status(400).json({
            message:"Invalid email or Password",
            success: false,
            err: "User not Found"
        })
    }
   

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if(REQUIRE_EMAIL_VERIFICATION && !user.verified){
        return res.status(400).json({
            message: "Please verify your email before logging in ",
            success: false,
            err: "email is not verified"
        })
    }

    const token = jwt.sign({
        id:user._id,
        username:user.username,

    }, process.env.JWT_SECRET, {expiresIn: "7d"})

    res.status(200).json({
        message: "Login Successful",
        success: true,
        token,
        user: {
            id: user._id,
            username:user.username,
            email:user.email
        }
    })


}

/**
 * @desc getme user and return jwt token
 * @route Post/api/auth/getMe
 * @access private
 */


/**
 * @desc log out the current user (stateless JWT - client just discards the token)
 * @route Post/api/auth/logout
 * @access private
 */

export async function logout(req, res) {
    res.status(200).json({
        message: "Logged out successfully",
        success: true
    })
}


export async function getMe(req, res) {
    const userId = req.user.id;


    const user = await userModel.findById(userId).select("-password");

    if(!user) {
        return res.status(404).json({
            message: "User not Found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details feteched Suceesfully",
        success:true,
        user
    })
}



export async function VerifyEmail(req, res) {
    const { token } = req.query;

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(400).send("This verification link is invalid or has expired. Please request a new one.");
    }

    const user = await userModel.findOne({ email: decoded.email});

    if(!user){
        return res.status(400).json({
            message: "Invalid token",
            success: false,
            err: "User not found"
        })
    }

    user.verified = true;

    await user.save();

    const html =
    `
    <h1>Email Verified successfully</h1>
    <p>Your Email has been verified. you can now log in to your account.</p>
    <a href="${FRONTEND_URL}/login">GO TO LOGIN</a>


    `

    res.send(html);
}