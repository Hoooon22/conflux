package com.hoooon22.conflux_backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hoooon22.conflux_backend.dto.NotificationDto;

@Service
public class NotificationService {

    // In-memory storage for notifications
    private final List<NotificationDto> notifications = new ArrayList<>();

    /**
     * 알림을 저장합니다.
     */
    public void addNotification(NotificationDto notification) {
        notifications.add(notification);
        System.out.println("✅ Notification saved: " + notification);
    }

    /**
     * 저장된 모든 알림을 반환합니다.
     */
    public List<NotificationDto> getAllNotifications() {
        System.out.println("📋 Fetching notifications. Total count: " + notifications.size());
        return notifications;
    }

    /**
     * 모든 알림을 삭제합니다. (테스트용)
     */
    public void clearNotifications() {
        notifications.clear();
        System.out.println("🗑️ All notifications cleared.");
    }
}
