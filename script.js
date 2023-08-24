let username;
document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messages");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");

    const socket = io(); // Connect to Socket.io server
    const username = prompt("Enter your username:");
    if (username) {
        // Use the entered username
        console.log("Username:", username);
    } else {
        // Handle empty or canceled input
        console.log("No username entered");
    }

    socket.on("updateActiveUsers", (activeUsers) => {
        // Update the sidebar with active user list
        const sidebar = document.querySelector('.sidebar');
        sidebar.innerHTML = '<h2>Contacts</h2>';
        const ul = document.createElement('ul');
        activeUsers.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user;
            ul.appendChild(li);
        });
        sidebar.appendChild(ul);
    });

    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", handleKeyPress);

    function replaceEmojis(message) {
        const emojiMap = {
            react: "⭐️",
            woah: "😮",
            hey: "👋",
            lol: "😂",
            love: "❤️"
        };

        const words = Object.keys(emojiMap);
        const regex = new RegExp(`\\b(${words.join("|")})\\b`, "gi");

        return message.replace(regex, matched => emojiMap[matched.toLowerCase()]);
    }

    function sendMessage() {
        const rawMessage = messageInput.value;
        if (rawMessage.trim() !== "") {
            const message = replaceEmojis(rawMessage); // Replace words with emojis
            socket.emit("chatMessage", message); // Emit modified message to server
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
