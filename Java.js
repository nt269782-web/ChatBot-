const BACKEND_URL = "https://chatbot-4-0iew.onrender.com";


function addMessage(text, type) {

    const chatBox = document.getElementById("chatBox");

    if (!chatBox) {
        console.error("chatBox element not found.");
        return;
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;

    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "bubble";

    bubbleDiv.textContent = text;

    messageDiv.appendChild(bubbleDiv);
    chatBox.appendChild(messageDiv);

 
    chatBox.scrollTop = chatBox.scrollHeight;
}


async function sendMessage() {

    const input = document.getElementById("userInput");

    if (!input) {
        console.error("userInput element not found.");
        return;
    }

    const message = input.value.trim();

    if (!message) {
        return;
    }

    try {

     
        addMessage(message, "user");

 
        input.value = "";




        const response = await fetch(
            `${BACKEND_URL}/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );


       

        if (!response.ok) {

            throw new Error(
                `Backend error: HTTP ${response.status}`
            );
        }



        const data = await response.json();

        console.log("CHAT RESPONSE:", data);



        const reply =
            data.reply ||
            "Sorry, mujhe iska answer nahi pata.";


        addMessage(reply, "bot");


    } catch (error) {

        console.error("CHAT ERROR:", error);

        addMessage(
            "Backend se connection nahi ho pa raha. Please try again.",
            "bot"
        );
    }
}
