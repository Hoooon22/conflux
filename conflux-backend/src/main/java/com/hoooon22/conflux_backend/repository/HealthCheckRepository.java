package com.hoooon22.conflux_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hoooon22.conflux_backend.domain.HealthCheck;

/**
 * Health Check Repository
 */
@Repository
public interface HealthCheckRepository extends JpaRepository<HealthCheck, Long> {

    /**
     * 활성화된 Health Check 목록 조회
     */
    List<HealthCheck> findByEnabled(Boolean enabled);
}
