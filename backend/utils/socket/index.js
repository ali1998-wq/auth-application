const { Server } = require("socket.io");
const Notification = require("../../models/notifications");

let io;

const socketSetup = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // console.log(`A user connected: ${socket.id}`);

    socket.on("purchase", async (data) => {
      try {
        const message = `Your content has been purchased by ${data.name}`;

        io.emit("notification", {
          authorId: data.authorId,
          message,
        });

        const notification = new Notification({
          authorId: data.authorId,
          buyerId: data.buyerId,
          contentId: data.contentId,
          message,
        });
        await notification.save();

        io.to(data?.authorId).emit("notification", {
          authorId,
          buyerId,
          contentId,
          message: message,
        });
      } catch (error) {
        console.error("Error saving notification:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

const getIOInstance = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

module.exports = { socketSetup, getIOInstance };
