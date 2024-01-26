import express from "express";
import http from "http";
import config from "./config/config";
import cors from "cors";
import connectDb from "./db/db";
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket/socket";
import healthRouter from "./routers/health.router";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/health", healthRouter);

initializeSocketIO(io);

const PORT = config.port;

connectDb().then(() => {
  server.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
});
