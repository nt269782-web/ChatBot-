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
        return "Chatbot Backend is running!";
    }

    @GetMapping("/all")
    public List<Message> getAll() {
        return repository.findAll();
    }


    @PostMapping("/save")
    public String save(@RequestBody Message message) {
        repository.save(message);
        return "Question saved successfully";
    }

  

    @PutMapping("/update/{id}")
    public String update(
            @PathVariable Integer id,
            @RequestBody Message newMessage) {

        Message message = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Question not found with id: " + id));

        message.setQuestion(newMessage.getQuestion());
        message.setAnswer(newMessage.getAnswer());

        repository.save(message);

        return "Question updated successfully";
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
