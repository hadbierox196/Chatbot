async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();

  if (message) {
    addMessage(message, "user-message");
    input.value = "";

    document.getElementById("typing-indicator").style.display = "block"; // Show typing indicator
    const textResponse = await fetchTextResponse(message);
    document.getElementById("typing-indicator").style.display = "none"; // Hide typing indicator

    addMessage(textResponse, "bot-message", true);
  }
}

function addMessage(content, className, withIcons = false) {
  const chatWindow = document.getElementById("chat-window");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", className);
  messageElement.innerHTML = content;
  chatWindow.appendChild(messageElement);

  if (withIcons) {
    const iconContainer = document.createElement("div");
    iconContainer.classList.add("icons");

    const copyIcon = document.createElement("img");
    copyIcon.src = "https://img.icons8.com/?size=100&id=15040&format=png&color=000000";
    copyIcon.alt = "Copy";
    copyIcon.onclick = () => navigator.clipboard.writeText(content);

    const audioIcon = document.createElement("img");
    audioIcon.src = "https://img.icons8.com/?size=100&id=98696&format=png&color=000000";
    audioIcon.alt = "Play Audio";
    audioIcon.onclick = () => textToAudio(content);

    iconContainer.appendChild(copyIcon);
    iconContainer.appendChild(audioIcon);
    chatWindow.appendChild(iconContainer);
  }

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function fetchTextResponse(prompt) {
  try {
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
    if (response.ok) {
      return await response.text();
    } else {
      return "Error: Unable to fetch response.";
    }
  } catch (error) {
    return "Error: Network issue.";
  }
}

function sendImage() {
  const message = document.getElementById("user-input").value.trim();
  if (message) {
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(message)}`;
    addMessage(`<img src="${imageUrl}" alt="Generated image" style="width: 100%; border-radius: 10px;">`, "bot-message", true);
  }
}

// Convert text response to speech in a masculine voice
function textToAudio(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'en-US';
  speech.pitch = 0.6;  // Lower pitch for a more masculine tone
  window.speechSynthesis.speak(speech);
}

// Allows pressing "Enter" to send message
function checkEnter(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}
