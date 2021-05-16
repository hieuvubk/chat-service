package com.example.demo.chat_service.repo;

import com.example.demo.chat_service.model.ChatMessage;
import com.example.demo.chat_service.model.ChatMessage;
import com.example.demo.chat_service.model.MessageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {

    long countBySenderIdAndRecipientIdAndStatus(
            String senderId, String recipientId, MessageStatus status);

    List<ChatMessage> findByChatId(String chatId);
}
