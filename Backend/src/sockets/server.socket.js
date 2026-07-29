import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {
    const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
        .split(",")
        .map((origin) => origin.trim().replace(/\/+$/, ""));

    io = new Server(httpServer, {
        cors:{
            origin: allowedOrigins,
            credentials: true,
        }
    })

    console.log("socket is running");

    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id)
    })
}

export function getIo() {
    if(!io) {
        throw new Error("Socket.io not initialized")
    }

    return io
}