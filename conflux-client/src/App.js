import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 백엔드 API에서 알림 가져오기
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 및 2초마다 폴링
  useEffect(() => {
    // 초기 로드
    fetchNotifications();

    // 2초마다 폴링
    const interval = setInterval(() => {
      fetchNotifications();
    }, 2000);

    // 클린업: 컴포넌트 언마운트 시 인터벌 제거
    return () => clearInterval(interval);
  }, []);

  // Source에 따른 네온 컬러 반환
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

  // 타임스탬프 포맷팅
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="app">
      {/* 왼쪽 사이드바 */}
      <aside className="sidebar">
        <div className="logo">
          <h1>Conflux</h1>
          <p className="tagline">Where all streams merge</p>
        </div>

        <nav className="menu">
          <button className="menu-item active">
            <span className="icon">📥</span>
            <span>Inbox</span>
          </button>
          <button className="menu-item">
            <span className="icon">🎯</span>
            <span>Focus</span>
          </button>
          <button className="menu-item">
            <span className="icon">📁</span>
            <span>Projects</span>
          </button>
          <button className="menu-item">
            <span className="icon">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        <div className="stats">
          <p className="stat-item">
            <span className="stat-label">Total Notifications</span>
            <span className="stat-value">{notifications.length}</span>
          </p>
        </div>
      </aside>

      {/* 오른쪽 메인 타임라인 */}
      <main className="main-content">
        <header className="header">
          <h2>Notification Stream</h2>
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span>Live</span>
          </div>
        </header>

        {/* 알림 타임라인 */}
        <div className="timeline">
          {loading && notifications.length === 0 ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : error && notifications.length === 0 ? (
            <div className="error">
              <p>⚠️ {error}</p>
              <p className="error-hint">백엔드 서버가 실행 중인지 확인하세요 (localhost:8080)</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="empty">
              <p>📭 No notifications yet</p>
              <p className="empty-hint">웹훅을 전송하면 여기에 알림이 표시됩니다</p>
            </div>
          ) : (
            notifications.slice().reverse().map((notification, index) => (
              <div
                key={index}
                className="notification-card"
                style={{ borderLeftColor: getBorderColor(notification.source) }}
              >
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
                  <span className={`notification-status status-${notification.status}`}>
                    {notification.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
