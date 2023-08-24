const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

// Listen for incoming connections
io.on("connection", (socket) => {
    console.log("A user connected");

    // Listen for incoming chat messages
    socket.on("chatMessage", (message) => {
        // Broadcast the message to all connected clients
        io.emit("chatMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
