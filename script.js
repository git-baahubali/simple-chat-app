document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messages");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");

    const socket = io(); // Connect to Socket.io server

    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", handleKeyPress);

    function sendMessage() {
        const message = messageInput.value;
        if (message.trim() !== "") {
            socket.emit("chatMessage", message); // Emit message to server
            messageInput.value = "";
        }
    }

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    }

    // Receive and display incoming messages
    socket.on("chatMessage", (message) => {
        const messageElement = document.createElement("div");
        messageElement.innerText = message;
        messageElement.classList.add("message");
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
});
