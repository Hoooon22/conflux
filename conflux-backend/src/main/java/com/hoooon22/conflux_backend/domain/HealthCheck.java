package com.hoooon22.conflux_backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
 * Health Check 설정 엔티티
 */
@Entity
@Table(name = "health_checks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthCheck {

    /**
     * 고유 ID (Primary Key)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Health Check 이름
     */
    @Column(nullable = false)
    private String name;

    /**
     * 체크할 URL
     */
    @Column(nullable = false)
    private String url;

    /**
     * HTTP 메서드 (GET, POST, HEAD 등)
     */
    @Column(nullable = false)
    @Builder.Default
    private String method = "GET";

    /**
     * 체크 간격 (초)
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer intervalSeconds = 60;

    /**
     * 활성화 여부
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean enabled = true;
}
