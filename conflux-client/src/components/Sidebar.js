import React from 'react';
import { Inbox, Target, Folder, Settings } from 'lucide-react';
import './Sidebar.css';

function Sidebar({ notificationCount, currentView, onViewChange }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>Conflux</h1>
        <p className="tagline">Where all streams merge</p>
      </div>

      <nav className="menu">
        <button
          className={`menu-item ${currentView === 'inbox' ? 'active' : ''}`}
          onClick={() => onViewChange('inbox')}
        >
          <Inbox className="icon" size={20} />
          <span>Inbox</span>
        </button>
        <button
          className={`menu-item ${currentView === 'focus' ? 'active' : ''}`}
          onClick={() => onViewChange('focus')}
        >
          <Target className="icon" size={20} />
          <span>Focus</span>
        </button>
        <button
          className={`menu-item ${currentView === 'projects' ? 'active' : ''}`}
          onClick={() => onViewChange('projects')}
        >
          <Folder className="icon" size={20} />
          <span>Projects</span>
        </button>
        <button
          className={`menu-item ${currentView === 'settings' ? 'active' : ''}`}
          onClick={() => onViewChange('settings')}
        >
          <Settings className="icon" size={20} />
          <span>Settings</span>
        </button>
      </nav>

      <div className="stats">
        <p className="stat-item">
          <span className="stat-label">Total Notifications</span>
          <span className="stat-value">{notificationCount}</span>
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
