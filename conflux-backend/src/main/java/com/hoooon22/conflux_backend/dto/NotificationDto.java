package com.hoooon22.conflux_backend.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationDto {

    /**
     * 알림 소스 (예: "GitHub", "Jira", "Slack", "Sentry", "HealthCheck", "Custom")
     */
    private String source;

    /**
     * 알림 제목
     */
    private String title;

    /**
     * 알림 메시지 내용
     */
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
    private LocalDateTime timestamp;

    /**
     * 알림 상태 (예: "success", "fail", "warning")
     */
    private String status;
}
