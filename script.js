document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messages");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");

    // Establish a connection to the Socket.io server
    const socket = io();

    sendButton.addEventListener("click", () => {
        const message = messageInput.value;
        if (message.trim() !== "") {
            // Emit the message to the server
            socket.emit("chatMessage", message);
            messageInput.value = "";
        }
    });

    // Receive and display incoming messages
    socket.on("chatMessage", (message) => {
        const messageElement = document.createElement("div");
        messageElement.innerText = message;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
});
