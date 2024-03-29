import { Server } from "socket.io";
import ApiError from "../utils/error.util";
import jwt from "jsonwebtoken";
import { CustomSocket, DecodedToken } from "../utils/types.util";
import { Request } from "express";
import config from "../config/config";

export function initializeSocketIO(io: Server) {
  console.log("socket.io initialization started");
  return io.on("connection", async (socket: CustomSocket) => {
    try {
      console.log("connected");
      const token = socket.handshake.auth.token;
      console.log("handshake token: ", token);
      if (!token) {
        throw new ApiError(
          401,
          "Unauthorized",
          "Unauthorized handshake, Token is missing"
        );
      }

      const decoded = jwt.verify(
        token,
        config.accessTokenSecretKey ?? ""
      ) as DecodedToken;

      console.log(decoded);

      //   const user = await checkIfUserExistThenReturnUser(decoded.id);

      socket.user = user;

      //creating a room so if the user is not part of any chat, he can still receive new chats for the first time.
      socket.join(user._id.toString());

      user.isOnline = true;
      user.save();
      socket.emit(ChatEventEnum.CONNECTED_EVENT, user._id.toString());
      console.log("user online", user._id.toString());
      socket.broadcast.emit(ChatEventEnum.USER_ONLINE, user._id.toString());
      socket.onAnyOutgoing((event) => {
        console.log("onAnyOutgoing: Event sent: ", event);
      });
      socket.onAny((event) => {
        console.log("onAny: Event sent: ", event);
      });
      io.engine.on("connection_error", (err) => {
        console.log("connection_err_s");
        console.log(err.req); // the request object
        console.log(err.code); // the error code, for example 1
        console.log(err.message); // the error message, for example "Session ID unknown"
        console.log(err.context); // some additional error context
        console.log("connection_err_e");
      });
      console.log("User connected, user id: ", user._id.toString());
    } catch (error: any) {
      console.log(`Error occured`);
      console.log(error);
      console.log("user offline", socket.user?._id.toString());
      socket.broadcast.emit(
        ChatEventEnum.USER_OFFLINE,
        socket.user?._id.toString()
      );
      if (socket.user?._id) {
        socket.leave(socket.user._id.toString());
      }
    }
  });
}

export function emitSocketEvent(
  req: Request,
  roomId: string,
  event: string,
  payload: any
) {
  console.log(
    `emit socket event ${roomId} ${event} ${JSON.stringify(payload)}`
  );
  req.app.get("io").in(roomId).emit(event, payload);
}
