import React, { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import './NotificationCard.css';

function NotificationCard({ notification, onMarkAsRead, onDelete }) {
  const [hovering, setHovering] = useState(false);

  const getBorderColor = (source) => {
    const colors = {
      'GitHub': '#a855f7',      // Purple
      'Sentry': '#ef4444',       // Red
      'Jira': '#3b82f6',         // Blue
      'Slack': '#eab308',        // Yellow
      'HealthCheck': '#22c55e',  // Green
      'Custom': '#06b6d4',       // Cyan
    };
    return colors[source] || '#6b7280'; // Default Gray
  };

  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ko
      });
    } catch (error) {
      return 'just now';
    }
  };

  const isUnread = notification.status === 'UNREAD';

  return (
    <div
      className={`notification-card ${isUnread ? 'unread' : ''}`}
      style={{ borderLeftColor: getBorderColor(notification.source) }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* 읽지 않음 표시 (파란 점) */}
      {isUnread && <div className="unread-dot"></div>}

      <div className="notification-header">
        <span className="notification-source">{notification.source}</span>
        <span className="notification-time">{formatTimestamp(notification.timestamp)}</span>
      </div>

      <h3 className="notification-title">{notification.title}</h3>
      <p className="notification-message">{notification.message}</p>

      <div className="notification-footer">
        {notification.repository && (
          <span className="notification-meta">📦 {notification.repository}</span>
        )}
        {notification.sender && (
          <span className="notification-meta">👤 {notification.sender}</span>
        )}
      </div>

      {/* 호버 시 표시되는 액션 버튼 */}
      {hovering && (
        <div className="notification-actions">
          {isUnread && (
            <button
              className="action-btn read-btn"
              onClick={() => onMarkAsRead(notification.id)}
              title="읽음으로 표시"
            >
              <Check size={16} />
            </button>
          )}
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(notification.id)}
            title="삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationCard;
