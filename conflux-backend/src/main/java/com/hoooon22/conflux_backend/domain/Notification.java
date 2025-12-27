package com.hoooon22.conflux_backend.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 알림 엔티티
 */
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    /**
     * 고유 ID (Primary Key)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 알림 소스 (예: "GitHub", "Jira", "Slack", "Sentry", "HealthCheck", "Custom")
     */
    @Column(nullable = false)
    private String source;

    /**
     * 알림 제목
     */
    @Column(nullable = false)
    private String title;

    /**
     * 알림 메시지 내용
     */
    @Column(columnDefinition = "TEXT")
    private String message;

    /**
     * 관련 리포지토리 (GitHub의 경우)
     */
    private String repository;

    /**
     * 발신자 정보
     */
    private String sender;

    /**
     * 알림 발생 시간
     */
    @Column(nullable = false)
    private LocalDateTime timestamp;

    /**
     * 알림 읽음 상태 (UNREAD, READ)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private NotificationStatus status = NotificationStatus.UNREAD;

    /**
     * 중복 알림 카운트 (같은 알림이 여러 번 올 때 증가)
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer count = 1;
}
