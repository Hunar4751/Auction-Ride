const micBtn = document.querySelector(".mic-btn");

if (!("webkitSpeechRecognition" in window)) {
    micBtn.disabled = true;
    micBtn.title = "Speech recognition not supported";
} else {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    micBtn.addEventListener("click", () => {
        recognition.start();
        micBtn.innerText = "🎙";
    });

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        input.value = transcript;

        if (event.results[event.results.length - 1].isFinal) {
            recognition.stop();
            micBtn.innerText = "🎤";
            handleMessage();
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        recognition.stop();
        micBtn.innerText = "🎤";
    };

    recognition.onend = () => {
        micBtn.innerText = "🎤";
    };
}

const input = document.querySelector("footer input");
const sendBtn = document.querySelector(".send-btn");
const chatContainer = document.querySelector(".chat-container");

sendBtn.addEventListener("click", handleMessage);

input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        handleMessage();
    }
});

function handleMessage() {
    const userMessage = input.value.trim();
    if (userMessage === "") return;

    appendMessage(userMessage, "user");
    input.value = "";

    fetchGeminiResponse(userMessage);
}

function appendMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.innerText = text;
    chatContainer.insertBefore(messageDiv, document.querySelector("footer"));
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function fetchGeminiResponse(prompt) {
    appendMessage("Typing...", "bot");

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();

        document.querySelectorAll(".message.bot").forEach(el => {
            if (el.innerText === "Typing...") el.remove();
        });

        const reply = data ?.candidates ?.[0] ?.content ?.parts ?.[0] ?.text || "Sorry, I didn’t understand that.";
        appendMessage(reply, "bot");

    } catch (error) {
        console.error("Error:", error);
        appendMessage("Something went wrong. Please try again.", "bot");
    }
}
