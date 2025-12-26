package com.hoooon22.conflux_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hoooon22.conflux_backend.domain.Notification;

/**
 * 알림 Repository
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * 모든 알림을 최신순으로 조회
     */
    List<Notification> findAllByOrderByTimestampDesc();
}
