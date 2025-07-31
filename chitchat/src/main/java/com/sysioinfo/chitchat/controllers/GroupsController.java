package com.sysioinfo.chitchat.controllers;


import com.sysioinfo.chitchat.entities.Message;
import com.sysioinfo.chitchat.entities.Group;
import com.sysioinfo.chitchat.repositories.GroupRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/groups")
@CrossOrigin("http://localhost:5174")
public class GroupsController {

    private GroupRepository groupRepository;


    public GroupsController(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    //create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String groupId) {

        if (groupRepository.findByGroupId(groupId) != null) {
            //group is already there
            return ResponseEntity.badRequest().body("Group already exists!");

        }


        //create new group
        Group group = new Group();
        group.setGroupId(groupId);
        Group savedGroup = groupRepository.save(group);
        return ResponseEntity.status(HttpStatus.CREATED).body(group);


    }


    //get room: join
    @GetMapping("/{groupId}")
    public ResponseEntity<?> joinRoom(
            @PathVariable String groupId
    ) {

        Group group = groupRepository.findByGroupId(groupId);
        if (group == null) {
            return ResponseEntity.badRequest()
                    .body("Group not found!!");
        }
        return ResponseEntity.ok(group);
    }

    //get messages of room

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String groupId,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size
    ) {
        Group group = groupRepository.findByGroupId(groupId);
        if (group == null) {
            return ResponseEntity.badRequest().build()
                    ;
        }
        //get messages :
        //pagination
        List<Message> messages = group.getMessages();
        int start = Math.max(0, messages.size() - (page + 1) * size);
        int end = Math.min(messages.size(), start + size);
        List<Message> paginatedMessages = messages.subList(start, end);
        return ResponseEntity.ok(paginatedMessages);

    }


}
