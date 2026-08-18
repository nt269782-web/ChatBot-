package com.nihal.chatbot;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final MessageRepository repository;

    public AdminController(MessageRepository repository) {
        this.repository = repository;
    }

   
    @GetMapping("/")
    public String home() {
        return "Admin API is running!";
    }

 
    @GetMapping("/all")
    public List<Message> getAll() {
        return repository.findAll();
    }

    
    @PostMapping("/save")
    public Message save(@RequestBody Message message) {

        if (message.getStatus() == null ||
                message.getStatus().trim().isEmpty()) {

            message.setStatus("ACTIVE");
        }

        return repository.save(message);
    }

    
    @PutMapping("/update/{id}")
    public Message update(
            @PathVariable Integer id,
            @RequestBody Message newMessage) {

        Message message = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Question not found with id: " + id
                        )
                );

        message.setQuestion(newMessage.getQuestion());
        message.setAnswer(newMessage.getAnswer());

      
        if (newMessage.getAnswer() != null &&
                !newMessage.getAnswer().trim().isEmpty()) {

            message.setStatus("ACTIVE");

        } else {

            
            message.setStatus("PENDING");
        }

        return repository.save(message);
    }

    
    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Integer id) {

        if (!repository.existsById(id)) {
            return "Question not found with id: " + id;
        }

        repository.deleteById(id);

        return "Question deleted successfully";
    }
}
