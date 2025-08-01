package com.sysioinfo.chitchat.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class TypingNotification {
    private String groupId;
    private String username;
}
