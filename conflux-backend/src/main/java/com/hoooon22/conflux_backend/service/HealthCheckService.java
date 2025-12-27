package com.hoooon22.conflux_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;
import java.util.stream.Collectors;

import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.hoooon22.conflux_backend.domain.HealthCheck;
import com.hoooon22.conflux_backend.dto.HealthCheckDto;
import com.hoooon22.conflux_backend.dto.NotificationDto;
import com.hoooon22.conflux_backend.repository.HealthCheckRepository;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class HealthCheckService {

    private final HealthCheckRepository healthCheckRepository;
    private final NotificationService notificationService;
    private final ThreadPoolTaskScheduler taskScheduler;
    private final RestTemplate restTemplate = new RestTemplate();

    private final Map<Long, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    @PostConstruct
    public void initializeScheduledTasks() {
        log.info("🔄 Initializing Health Check Scheduler...");
        List<HealthCheck> activeChecks = healthCheckRepository.findByEnabled(true);
        activeChecks.forEach(this::scheduleHealthCheck);
        log.info("✅ {} Health Checks scheduled", activeChecks.size());
    }

    @PreDestroy
    public void shutdownScheduledTasks() {
        log.info("🛑 Shutting down Health Check Scheduler...");
        scheduledTasks.values().forEach(task -> task.cancel(false));
        scheduledTasks.clear();
    }

    @Transactional
    public HealthCheckDto registerHealthCheck(HealthCheckDto dto) {
        HealthCheck entity = HealthCheck.builder()
                .name(dto.getName())
                .url(dto.getUrl())
                .method(dto.getMethod())
                .intervalSeconds(dto.getIntervalSeconds())
                .enabled(true)
                .build();

        HealthCheck saved = healthCheckRepository.save(entity);
        log.info("✅ Health Check registered: {}", saved.getName());

        scheduleHealthCheck(saved);

        return entityToDto(saved);
    }

    @Transactional
    public void deleteHealthCheck(Long id) {
        if (!healthCheckRepository.existsById(id)) {
            throw new IllegalArgumentException("Health Check not found: " + id);
        }

        cancelScheduledTask(id);
        healthCheckRepository.deleteById(id);
        log.info("🗑️ Health Check deleted: {}", id);
    }

    @Transactional(readOnly = true)
    public List<HealthCheckDto> getAllHealthChecks() {
        return healthCheckRepository.findAll().stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    private void scheduleHealthCheck(HealthCheck healthCheck) {
        if (scheduledTasks.containsKey(healthCheck.getId())) {
            log.warn("⚠️ Health Check already scheduled: {}", healthCheck.getName());
            return;
        }

        long intervalMillis = healthCheck.getIntervalSeconds() * 1000L;

        ScheduledFuture<?> task = taskScheduler.scheduleAtFixedRate(
                () -> performHealthCheck(healthCheck),
                intervalMillis
        );

        scheduledTasks.put(healthCheck.getId(), task);
        log.info("⏰ Health Check scheduled: {} (every {}s)", healthCheck.getName(), healthCheck.getIntervalSeconds());
    }

    private void performHealthCheck(HealthCheck healthCheck) {
        try {
            HttpMethod method = HttpMethod.valueOf(healthCheck.getMethod().toUpperCase());
            ResponseEntity<String> response = restTemplate.exchange(
                    healthCheck.getUrl(),
                    method,
                    null,
                    String.class
            );

            int statusCode = response.getStatusCode().value();

            if (statusCode >= 200 && statusCode < 300) {
                log.debug("✅ Health Check OK: {} - {}", healthCheck.getName(), statusCode);
            } else {
                log.warn("⚠️ Health Check WARNING: {} - {}", healthCheck.getName(), statusCode);
                createHealthCheckNotification(healthCheck, "WARNING", "Status code: " + statusCode);
            }
        } catch (Exception e) {
            log.error("❌ Health Check FAILED: {} - {}", healthCheck.getName(), e.getMessage());
            createHealthCheckNotification(healthCheck, "FAILED", e.getMessage());
        }
    }

    private void createHealthCheckNotification(HealthCheck healthCheck, String status, String message) {
        NotificationDto notification = NotificationDto.builder()
                .source("HealthCheck")
                .title(healthCheck.getName() + " - " + status)
                .message(message)
                .repository(healthCheck.getUrl())
                .sender("System")
                .timestamp(LocalDateTime.now())
                .build();

        notificationService.addNotification(notification);
    }

    private void cancelScheduledTask(Long healthCheckId) {
        ScheduledFuture<?> task = scheduledTasks.remove(healthCheckId);
        if (task != null) {
            task.cancel(false);
            log.info("⏹️ Health Check unscheduled: {}", healthCheckId);
        }
    }

    private HealthCheckDto entityToDto(HealthCheck entity) {
        return HealthCheckDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .url(entity.getUrl())
                .method(entity.getMethod())
                .intervalSeconds(entity.getIntervalSeconds())
                .enabled(entity.getEnabled())
                .build();
    }
}
