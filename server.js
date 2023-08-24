const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// At the top of your app.js file
const activeUsers = new Set(); // To store active users

// Inside your connection event
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("userConnected", (username) => {
        activeUsers.add(username);
        io.emit("updateActiveUsers", Array.from(activeUsers));
    });

    socket.on("userDisconnected", (username) => {
        activeUsers.delete(username);
        io.emit("updateActiveUsers", Array.from(activeUsers));
    });

    socket.on("disconnect", (username) => {
        console.log("A user disconnected");
        // Assuming you want to remove the disconnected user from activeUsers
        // You can improve this by handling disconnects more robustly.
        activeUsers.delete(username); 
        io.emit("updateActiveUsers", Array.from(activeUsers));
    });

    // ... (other code)
});

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
