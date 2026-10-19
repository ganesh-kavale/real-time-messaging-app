package com.sysioinfo.chitchat.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Group {
    @Id
	private String userName;
	private String groupId;
    private List<Message> messages = new ArrayList<>();
	private List<TeamMember> teamMembers = new ArrayList<>();

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getGroupId() {
		return groupId;
	}
	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}
	public List<Message> getMessages() {
		return messages;
	}
	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}

	public List<TeamMember> getTeamMembers(TeamMember teamMember) {
		return teamMembers;
	}

	public void setTeamMembers(List<TeamMember> teamMembers) {
		this.teamMembers = teamMembers;
	}
}
