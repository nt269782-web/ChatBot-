package com.nihal.chatbot;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ChatController {

    private final MessageRepository repository;

    public ChatController(MessageRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(
            @RequestBody Map<String, String> request) {

        String userMessage = request.get("message");

        if (userMessage == null || userMessage.trim().isEmpty()) {
            return Map.of(
                    "reply", "Please kuch message likho."
            );
        }

        String question = userMessage.trim();

        
        Message message =
                repository.findByQuestionIgnoreCase(question);

      
        if (message != null) {

           
            if ("PENDING".equalsIgnoreCase(message.getStatus())) {
                return Map.of(
                        "reply",
                        "Sorry, mujhe iska answer abhi nahi pata."
                );
            }

         
            return Map.of(
                    "reply",
                    message.getAnswer()
            );
        }


        Message pendingMessage = new Message();

        pendingMessage.setQuestion(question);
        pendingMessage.setAnswer("");
        pendingMessage.setStatus("PENDING");

        repository.save(pendingMessage);

    
        return Map.of(
                "reply",
                "Sorry, mujhe iska answer nahi pata."
        );
    }
}
