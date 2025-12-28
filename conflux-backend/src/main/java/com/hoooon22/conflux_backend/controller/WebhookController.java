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

    @PostMapping("/custom")
    public String receiveCustomWebhook(@RequestBody Map<String, Object> payload) {
        System.out.println("🎨 Custom Webhook Received!");
        System.out.println("Payload: " + payload);

        // Custom webhook payload 파싱
        String title = (String) payload.getOrDefault("title", "Custom Notification");
        String message = (String) payload.getOrDefault("message", "No message provided");
        String status = (String) payload.getOrDefault("status", "success");

        // DTO 생성 및 저장
        NotificationDto notification = NotificationDto.builder()
                .source("Custom")
                .title(title)
                .message(message)
                .repository(null)
                .sender("Custom")
                .timestamp(LocalDateTime.now())
                .status(status)
                .build();

        notificationService.addNotification(notification);

        return "Custom webhook received successfully";
    }

    @PostMapping("/github-actions")
    public String receiveGitHubActionsWebhook(@RequestBody Map<String, Object> payload) {
        System.out.println("🚀 GitHub Actions Webhook Received!");
        System.out.println("Payload: " + payload);

        // GitHub Actions webhook payload 파싱
        String workflowName = (String) payload.getOrDefault("workflow", "Unknown Workflow");
        String status = (String) payload.getOrDefault("status", "unknown");
        String conclusion = (String) payload.getOrDefault("conclusion", "");
        String repository = (String) payload.getOrDefault("repository", "Unknown Repository");
        String branch = (String) payload.getOrDefault("branch", "main");
        String actor = (String) payload.getOrDefault("actor", "Unknown");

        // 상태에 따라 메시지 생성
        String message = String.format("Workflow '%s' %s on branch '%s'",
            workflowName,
            conclusion.isEmpty() ? status : conclusion,
            branch);

        // DTO 생성 및 저장
        NotificationDto notification = NotificationDto.builder()
                .source("GitHub")  // GitHub Actions도 GitHub 카테고리로 통합
                .title("🚀 " + workflowName + " - " + status)
                .message(message)
                .repository(repository)
                .sender(actor)
                .timestamp(LocalDateTime.now())
                .status(conclusion.equals("success") ? "success" : "failed")
                .build();

        notificationService.addNotification(notification);

        return "GitHub Actions webhook received successfully";
    }
}
