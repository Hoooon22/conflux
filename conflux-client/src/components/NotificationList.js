import React from 'react';
import NotificationCard from './NotificationCard';
import './NotificationList.css';

function NotificationList({ notifications, loading, error, onMarkAsRead, onDelete }) {
  if (loading && notifications.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <div className="error">
        <p>⚠️ {error}</p>
        <p className="error-hint">백엔드 서버가 실행 중인지 확인하세요 (localhost:8080)</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="empty">
        <p>📭 No notifications yet</p>
        <p className="empty-hint">웹훅을 전송하면 여기에 알림이 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="timeline">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default NotificationList;
