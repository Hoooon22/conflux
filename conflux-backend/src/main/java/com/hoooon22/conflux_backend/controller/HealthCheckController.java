package com.hoooon22.conflux_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hoooon22.conflux_backend.dto.HealthCheckDto;
import com.hoooon22.conflux_backend.service.HealthCheckService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/healthcheck")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class HealthCheckController {

    private final HealthCheckService healthCheckService;

    /**
     * Health Check 등록 및 스케줄링 시작
     */
    @PostMapping("/register")
    public ResponseEntity<HealthCheckDto> registerHealthCheck(@RequestBody HealthCheckDto dto) {
        log.info("📥 Registering Health Check: {}", dto.getName());
        HealthCheckDto registered = healthCheckService.registerHealthCheck(dto);
        return ResponseEntity.ok(registered);
    }

    /**
     * Health Check 삭제 및 스케줄링 중지
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHealthCheck(@PathVariable Long id) {
        log.info("🗑️ Deleting Health Check: {}", id);
        healthCheckService.deleteHealthCheck(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 모든 Health Check 조회
     */
    @GetMapping
    public ResponseEntity<List<HealthCheckDto>> getAllHealthChecks() {
        log.info("📋 Fetching all Health Checks");
        return ResponseEntity.ok(healthCheckService.getAllHealthChecks());
    }
}
