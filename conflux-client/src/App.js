import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import NotificationList from './components/NotificationList';
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

  // 알림을 읽음 상태로 변경
  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
        method: 'PATCH',
      });

      if (response.ok) {
        // 목록 새로고침
        fetchNotifications();
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (err) {
      console.error('❌ Error marking notification as read:', err);
    }
  };

  // 알림 삭제
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 목록 새로고침
        fetchNotifications();
      } else {
        console.error('Failed to delete notification');
      }
    } catch (err) {
      console.error('❌ Error deleting notification:', err);
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

  return (
    <div className="app">
      {/* 왼쪽 사이드바 */}
      <Sidebar notificationCount={notifications.length} />

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
        <NotificationList
          notifications={notifications}
          loading={loading}
          error={error}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;
