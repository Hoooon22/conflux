package com.hoooon22.conflux_backend.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hoooon22.conflux_backend.dto.NotificationDto;
import com.hoooon22.conflux_backend.service.NotificationService;

@RestController
@RequestMapping("/api/webhook")
@CrossOrigin(origins = "http://localhost:3000")
public class WebhookController {

    private final NotificationService notificationService;

    public WebhookController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/github")
    public String receiveGitHubWebhook(@RequestBody Map<String, Object> payload) {
        System.out.println("🔥 GitHub Webhook Received!");
        System.out.println("Payload: " + payload);

        // GitHub webhook payload 파싱
        String action = (String) payload.get("action");
        Map<String, Object> repository = (Map<String, Object>) payload.get("repository");
        Map<String, Object> sender = (Map<String, Object>) payload.get("sender");

        // DTO 생성 및 저장
        NotificationDto notification = NotificationDto.builder()
                .source("GitHub")
                .title("GitHub Event: " + action)
                .message("Action: " + action + " occurred")
                .repository(repository != null ? (String) repository.get("full_name") : "Unknown")
                .sender(sender != null ? (String) sender.get("login") : "Unknown")
                .timestamp(LocalDateTime.now())
                .status("success")
                .build();

        notificationService.addNotification(notification);

        return "Webhook received successfully";
    }
}
