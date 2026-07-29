import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import morgan from "morgan";
import cors from "cors";

const app = express()

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
    origin: allowedOrigins,
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.get("/", (req, res) => {
    res.json({
        message: "Server is Running "});
});

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: "Something went wrong. Please try again."
    });
});

export default app;