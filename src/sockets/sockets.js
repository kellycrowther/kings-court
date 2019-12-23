import socketIOClient from "socket.io-client";

const socketEndpoint = process.env.REACT_APP_API_ENDPOINT;
const socket = socketIOClient(socketEndpoint);

export const emitSocket = race => {
  socket.emit("incoming-data", race);
};
