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

import com.sysioinfo.chitchat.entities.Room;
import com.sysioinfo.chitchat.playload.MessageRequest;
import com.sysioinfo.chitchat.repositories.RoomRepository;

import java.time.LocalDateTime;

@Controller
@CrossOrigin("http://localhost:5174")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }


    //for sending and receiving messages
    @MessageMapping("/sendMessage/{roomId}")// /app/sendMessage/roomId
    @SendTo("/topic/room/{roomId}")//subscribe
    public Message sendMessage(
            @DestinationVariable String roomId,
            @RequestBody MessageRequest request
    ) {

        Room room = roomRepository.findByRoomId(request.getRoomId());
        Message message = new Message();

        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());
        if (room != null) {
            room.getMessages().add(message);
            roomRepository.save(room);
        } else {
            throw new RuntimeException("room not found !!");
        }

        return message;

    }

    @MessageMapping("/typing")
    public void typing(@Payload TypingNotification notification) {
        System.out.println("User typing: " + notification.getUsername() + " in room " + notification.getRoomId());

        String destination = "/topic/typing/" + notification.getRoomId();
        messagingTemplate.convertAndSend(destination, notification);
    }


}
