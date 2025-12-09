package com.hoooon22.conflux_backend.service;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hoooon22.conflux_backend.dto.NotificationDto;

@Service
public class HealthCheckService {

    private final NotificationService notificationService;
    private final RestTemplate restTemplate;

    // 헬스 체크 대상 URL 목록 (확장 가능)
    private final String[] healthCheckUrls = {
        "https://www.google.com",
        // 필요시 추가 URL을 여기에 추가
        // "https://github.com",
        // "http://localhost:8080/actuator/health"
    };

    public HealthCheckService(NotificationService notificationService) {
        this.notificationService = notificationService;
        this.restTemplate = new RestTemplate();
    }

    /**
     * 1분마다 헬스 체크를 수행합니다.
     * fixedRate = 60000ms (60초)
     */
    @Scheduled(fixedRate = 60000)
    public void performHealthCheck() {
        System.out.println("🏥 Starting health check at: " + LocalDateTime.now());

        for (String url : healthCheckUrls) {
            checkUrl(url);
        }
    }

    /**
     * 개별 URL에 대한 헬스 체크를 수행합니다.
     */
    private void checkUrl(String url) {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            int statusCode = response.getStatusCode().value();

            if (statusCode == 200) {
                System.out.println("✅ Health check passed for: " + url + " (Status: " + statusCode + ")");
            } else {
                System.out.println("⚠️ Health check warning for: " + url + " (Status: " + statusCode + ")");
                createHealthCheckNotification(url, statusCode, "warning");
            }

        } catch (Exception e) {
            System.err.println("❌ Health check failed for: " + url);
            System.err.println("Error: " + e.getMessage());
            createHealthCheckNotification(url, 0, "fail");
        }
    }

    /**
     * 헬스 체크 실패 시 알림을 생성합니다.
     */
    private void createHealthCheckNotification(String url, int statusCode, String status) {
        NotificationDto notification = NotificationDto.builder()
                .source("HealthCheck")
                .title("Health Check Alert: " + url)
                .message(statusCode == 0
                    ? "Service unreachable or error occurred"
                    : "Unexpected status code: " + statusCode)
                .repository(url)
                .sender("System")
                .timestamp(LocalDateTime.now())
                .status(status)
                .build();

        notificationService.addNotification(notification);
        System.out.println("🚨 Health check notification created for: " + url);
    }

    /**
     * 테스트용: 즉시 헬스 체크를 수행합니다.
     */
    public void performImmediateHealthCheck() {
        System.out.println("🔧 Manual health check triggered");
        performHealthCheck();
    }
}
