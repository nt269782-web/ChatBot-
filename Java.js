

const BACKEND_URL = "https://chatbot-4-0iew.onrender.com";



async function sendMessage() {

    const input = document.getElementById("userInput");
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
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );

        // Response check
        if (!response.ok) {

            throw new Error(
                `Backend error: HTTP ${response.status}`
            );
        }

        const data = await response.json();

        console.log("CHAT RESPONSE:", data);


       
        if (typeof data === "string") {

            addMessage(data, "bot");

        } else {

            addMessage(
                data.answer ||
                data.message ||
                data.response ||
                "Sorry, mujhe iska answer nahi pata.",
                "bot"
            );
        }


    } catch (error) {

        console.error("CHAT ERROR:", error);

        addMessage(
            "Backend se connection nahi ho pa raha. Please try again.",
            "bot"
        );
    }
}
