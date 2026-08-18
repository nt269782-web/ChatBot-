const BACKEND_URL = "https://chatbot-4-0iew.onrender.com";

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

       
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
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
