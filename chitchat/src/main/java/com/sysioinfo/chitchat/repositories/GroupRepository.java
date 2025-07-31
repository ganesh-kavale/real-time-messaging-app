package com.sysioinfo.chitchat.repositories;


import com.sysioinfo.chitchat.entities.Group;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GroupRepository extends MongoRepository<Group, String> {
    //get room using room id
    Group findByGroupId(String groupId);
}
