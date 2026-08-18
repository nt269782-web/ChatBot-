package com.nihal.chatbot;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    Message findByQuestionIgnoreCase(String question);

}