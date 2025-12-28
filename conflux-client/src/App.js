import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import NotificationList from './components/NotificationList';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('inbox');
  // 다중 선택 가능한 카테고리 필터 (기본값: 모든 카테고리 선택)
  const [selectedCategories, setSelectedCategories] = useState(['GitHub', 'HealthCheck', 'Custom']);

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

  // 카테고리 토글 함수
  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // 이미 선택된 경우 제거 (단, 최소 1개는 선택되어 있어야 함)
        const newCategories = prev.filter(c => c !== category);
        return newCategories.length > 0 ? newCategories : prev;
      } else {
        // 선택되지 않은 경우 추가
        return [...prev, category];
      }
    });
  };

  // 전체 선택/해제 함수
  const toggleAll = () => {
    const allCategories = ['GitHub', 'HealthCheck', 'Custom'];
    if (selectedCategories.length === allCategories.length) {
      // 전체가 선택되어 있으면 하나만 남기기 (GitHub)
      setSelectedCategories(['GitHub']);
    } else {
      // 전체 선택
      setSelectedCategories(allCategories);
    }
  };

  // 카테고리 필터링된 알림
  const filteredNotifications = notifications.filter(notification => {
    return selectedCategories.includes(notification.source);
  });

  return (
    <div className="app">
      {/* 왼쪽 사이드바 */}
      <Sidebar
        notificationCount={notifications.length}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* 오른쪽 메인 영역 */}
      <main className="main-content">
        {currentView === 'inbox' && (
          <>
            <header className="header">
              <h2>Notification Stream</h2>
              <div className="status-indicator">
                <span className="status-dot"></span>
                <span>Live</span>
              </div>
            </header>

            {/* 카테고리 필터 - 체크박스 방식 */}
            <div className="category-filter">
              <button
                className={`filter-btn ${selectedCategories.length === 3 ? 'active' : ''}`}
                onClick={toggleAll}
              >
                <span className="checkbox-icon">
                  {selectedCategories.length === 3 ? '☑' : '☐'}
                </span>
                전체 ({notifications.length})
              </button>
              <button
                className={`filter-btn ${selectedCategories.includes('GitHub') ? 'active' : ''}`}
                onClick={() => toggleCategory('GitHub')}
              >
                <span className="checkbox-icon">
                  {selectedCategories.includes('GitHub') ? '☑' : '☐'}
                </span>
                GitHub ({notifications.filter(n => n.source === 'GitHub').length})
              </button>
              <button
                className={`filter-btn ${selectedCategories.includes('HealthCheck') ? 'active' : ''}`}
                onClick={() => toggleCategory('HealthCheck')}
              >
                <span className="checkbox-icon">
                  {selectedCategories.includes('HealthCheck') ? '☑' : '☐'}
                </span>
                Health Check ({notifications.filter(n => n.source === 'HealthCheck').length})
              </button>
              <button
                className={`filter-btn ${selectedCategories.includes('Custom') ? 'active' : ''}`}
                onClick={() => toggleCategory('Custom')}
              >
                <span className="checkbox-icon">
                  {selectedCategories.includes('Custom') ? '☑' : '☐'}
                </span>
                Custom ({notifications.filter(n => n.source === 'Custom').length})
              </button>
            </div>

            {/* 알림 타임라인 */}
            <NotificationList
              notifications={filteredNotifications}
              loading={loading}
              error={error}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          </>
        )}

        {currentView === 'focus' && (
          <div className="placeholder-view">
            <h2>🎯 Focus Mode</h2>
            <p>중요한 알림만 표시됩니다 (개발 예정)</p>
          </div>
        )}

        {currentView === 'projects' && (
          <div className="placeholder-view">
            <h2>📦 Projects</h2>
            <p>프로젝트별 알림 관리 (개발 예정)</p>
          </div>
        )}

        {currentView === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default App;
