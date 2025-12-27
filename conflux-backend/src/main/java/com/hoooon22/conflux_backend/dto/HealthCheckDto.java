package com.hoooon22.conflux_backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HealthCheckDto {

    /**
     * Health Check ID
     */
    private Long id;

    /**
     * Health Check 이름
     */
    private String name;

    /**
     * 체크할 URL
     */
    private String url;

    /**
     * HTTP 메서드 (GET, POST, HEAD)
     */
    private String method;

    /**
     * 체크 간격 (초)
     */
    private Integer intervalSeconds;

    /**
     * 활성화 여부
     */
    private Boolean enabled;
}
