package com.hoooon22.conflux_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hoooon22.conflux_backend.domain.Notification;
import com.hoooon22.conflux_backend.domain.NotificationStatus;
import com.hoooon22.conflux_backend.dto.NotificationDto;
import com.hoooon22.conflux_backend.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * 알림을 저장합니다 (DTO → Entity 변환 후 DB 저장)
     * 중복 알림이 있으면 카운트를 증가시키고 시간을 업데이트합니다.
     */
    @Transactional
    public void addNotification(NotificationDto dto) {
        // 같은 알림이 이미 있는지 확인
        var existingNotification = notificationRepository
                .findFirstBySourceAndTitleAndMessageOrderByTimestampDesc(
                        dto.getSource(), dto.getTitle(), dto.getMessage());

        if (existingNotification.isPresent()) {
            // 중복 알림: 카운트 증가 + 시간 업데이트 + 읽지 않음 상태로 변경
            Notification existing = existingNotification.get();
            existing.setCount(existing.getCount() + 1);
            existing.setTimestamp(dto.getTimestamp());
            existing.setStatus(NotificationStatus.UNREAD); // 다시 읽지 않음 상태로
            notificationRepository.save(existing);
            log.info("🔄 Duplicate notification updated. Count: {}, ID: {}", existing.getCount(), existing.getId());
        } else {
            // 새로운 알림: 저장
            Notification entity = dtoToEntity(dto);
            notificationRepository.save(entity);
            log.info("✅ New notification saved to DB: {}", entity);
        }
    }

    /**
     * 저장된 모든 알림을 최신순으로 반환합니다 (Entity → DTO 변환)
     */
    @Transactional(readOnly = true)
    public List<NotificationDto> getAllNotifications() {
        List<Notification> entities = notificationRepository.findAllByOrderByTimestampDesc();
        log.info("📋 Fetching notifications from DB. Total count: {}", entities.size());
        return entities.stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    /**
     * 모든 알림을 삭제합니다. (테스트용)
     */
    @Transactional
    public void clearNotifications() {
        notificationRepository.deleteAll();
        log.info("🗑️ All notifications cleared from DB.");
    }

    /**
     * 특정 알림을 읽음 상태로 변경합니다.
     */
    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found: " + id));
        notification.setStatus(NotificationStatus.READ);
        notificationRepository.save(notification);
        log.info("✅ Notification marked as READ: {}", id);
    }

    /**
     * 특정 알림을 삭제합니다.
     */
    @Transactional
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new IllegalArgumentException("Notification not found: " + id);
        }
        notificationRepository.deleteById(id);
        log.info("🗑️ Notification deleted: {}", id);
    }

    /**
     * DTO → Entity 변환
     */
    private Notification dtoToEntity(NotificationDto dto) {
        return Notification.builder()
                .source(dto.getSource())
                .title(dto.getTitle())
                .message(dto.getMessage())
                .repository(dto.getRepository())
                .sender(dto.getSender())
                .timestamp(dto.getTimestamp())
                .status(NotificationStatus.UNREAD) // 기본값: 읽지 않음
                .build();
    }

    /**
     * Entity → DTO 변환
     */
    private NotificationDto entityToDto(Notification entity) {
        return NotificationDto.builder()
                .id(entity.getId()) // ID 추가
                .source(entity.getSource())
                .title(entity.getTitle())
                .message(entity.getMessage())
                .repository(entity.getRepository())
                .sender(entity.getSender())
                .timestamp(entity.getTimestamp())
                .status(entity.getStatus().name()) // Enum을 String으로 변환
                .count(entity.getCount()) // 카운트 추가
                .build();
    }
}
