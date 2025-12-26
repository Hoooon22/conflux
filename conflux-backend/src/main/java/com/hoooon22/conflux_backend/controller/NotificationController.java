package com.hoooon22.conflux_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hoooon22.conflux_backend.dto.NotificationDto;
import com.hoooon22.conflux_backend.service.NotificationService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/notifications")
    public List<NotificationDto> getNotifications() {
        return notificationService.getAllNotifications();
    }

    /**
     * 특정 알림을 읽음 상태로 변경
     */
    @PatchMapping("/notifications/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long id) {
        try {
            notificationService.markAsRead(id);
            return ResponseEntity.ok("Notification marked as read");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 특정 알림을 삭제
     */
    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id) {
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.ok("Notification deleted");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
