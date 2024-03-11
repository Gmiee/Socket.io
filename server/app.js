import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { v4 as uuidv4 } from "uuid"; // Import the uuid library

const port = 3000;
const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Store user IDs in an object
const userMap = {};

io.on("connection", (socket) => {
  // Check if the user already has an ID
  let userId = socket.handshake.auth.userId;

  if (!userId) {
    // Generate a new user ID using uuid
    userId = uuidv4();
    // Attach the user ID to the socket
    socket.handshake.auth.userId = userId;
  }

  // Store the user ID in the userMap
  userMap[userId] = socket.id;

  // Send the user ID to the client
  socket.emit("userId", userId);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });

    socket.to(room).emit("receive-message", message);

    socket.on("join-room", (room) => {
      console.log(`user room joined ${room}`);
      socket.join(room);
    });
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    // Remove the user ID from the userMap
    delete userMap[userId];
  });
});

server.listen(port, () => {
  console.log(`server is running on ${port}`);
});
