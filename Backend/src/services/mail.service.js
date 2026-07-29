import { Resend } from "resend";

// Render blocks outbound SMTP (port 25/465/587), so email is sent over
// Resend's HTTPS API instead of Nodemailer's SMTP transport.
//
// Built lazily (not at module load) so a missing RESEND_API_KEY only fails
// the send itself instead of crashing the whole server on boot - the Resend
// SDK throws synchronously in its constructor if the key is empty.
let resend;
function getClient() {
    if (!resend) {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is not set");
        }
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "DeepOcean <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html, text }) {
    const { data, error } = await getClient().emails.send({
        from: FROM_EMAIL,
        to,
        subject,
        html,
        text,
    });

    if (error) {
        throw new Error(`Resend failed to send email: ${error.message || JSON.stringify(error)}`);
    }

    console.log("Email sent:", data?.id);
}
