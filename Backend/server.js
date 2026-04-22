import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
// import { testAi } from "./src/services/ai.service.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 8000;

// testAi();

const httpServer = http.createServer(app);
initSocket(httpServer);


connectDB()
    .catch((err) => {
        console.log("MongoDB Connection Failed", err);
        process.exit(1);
    });

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});