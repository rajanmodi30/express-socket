import { createAdapter } from "@socket.io/redis-adapter";
import { Server } from "socket.io";
import { createClient } from "redis";
import express, { Application } from "express";
import { AddressInfo } from "net";
import http from "http";
import webRouter from "./routes/web";
import { env } from "./env";

const port = env.app.port;
const app: Application = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", webRouter);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: false,
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join", function (data) {
    const userId = data.id;
    const roomName = userId;
    socket.join(roomName);
    console.debug(
      "user joined",
      userId,
      " rooms list",
      io.sockets.adapter.rooms,
      " data parsed",
      data
    );

    io.to(roomName).emit("ack", {
      userId: data.id,
      roomName: roomName,
      type: "ack",
    });
  });

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

const pubClient = createClient({ url: env.redis.url });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);
});

/**
 *  on unnecessary kill of program
 */
process.on("SIGTERM", () => {
  console.debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.debug("HTTP server closed");
  });
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  console.error("error", error);

  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr: AddressInfo | string | null = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  console.debug("Listening on " + bind);
}
