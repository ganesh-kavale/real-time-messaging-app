package com.sysioinfo.chitchat.controllers;

import com.sysioinfo.chitchat.entities.Message;
import com.sysioinfo.chitchat.entities.TypingNotification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import com.sysioinfo.chitchat.entities.Group;
import com.sysioinfo.chitchat.playload.MessageRequest;
import com.sysioinfo.chitchat.repositories.GroupRepository;

import java.time.LocalDateTime;

@Controller
@CrossOrigin("http://localhost:5174")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private GroupRepository groupRepository;

    public ChatController(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }


    //for sending and receiving messages
    @MessageMapping("/sendMessage/{groupId}")// /app/sendMessage/roomId
    @SendTo("/topic/group/{groupId}")//subscribe
    public Message sendMessage(
            @DestinationVariable String groupId,
            @RequestBody MessageRequest request
    ) {

        Group group = groupRepository.findByGroupId(request.getGroupId());
        Message message = new Message();

        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());
        if (group != null) {
            group.getMessages().add(message);
            groupRepository.save(group);
        } else {
            throw new RuntimeException("group not found !!");
        }

        return message;

    }

    @MessageMapping("/typing")
    public void typing(@Payload TypingNotification notification) {
        System.out.println("User typing: " + notification.getUsername() + " in room " + notification.getGroupId());

        String destination = "/topic/typing/" + notification.getGroupId();
        messagingTemplate.convertAndSend(destination, notification);
    }


}
