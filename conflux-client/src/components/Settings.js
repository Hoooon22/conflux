import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, Copy, Edit2 } from 'lucide-react';
import './Settings.css';

const DEFAULT_INTEGRATIONS = [
  {
    id: 'default-1',
    name: 'GitHub Webhook',
    type: 'webhook',
    url: 'http://localhost:8080/api/webhook/github',
    enabled: true,
    isDefault: true
  },
  {
    id: 'default-2',
    name: 'Custom Webhook',
    type: 'webhook',
    url: 'http://localhost:8080/api/webhook/custom',
    enabled: true,
    isDefault: true
  },
];

function Settings() {
  const [integrations, setIntegrations] = useState(() => {
    // localStorage에서 저장된 설정 불러오기
    const saved = localStorage.getItem('conflux_integrations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved integrations:', e);
      }
    }
    return DEFAULT_INTEGRATIONS;
  });

  // integrations 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('conflux_integrations', JSON.stringify(integrations));
  }, [integrations]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'webhook',
    url: '',
    method: 'POST',
    interval: 60
  });

  const handleAddIntegration = async () => {
    if (!newIntegration.name || !newIntegration.url) {
      alert('이름과 URL을 입력해주세요.');
      return;
    }

    const integration = {
      id: Date.now().toString(),
      ...newIntegration,
      enabled: true
    };

    // Health Check인 경우 백엔드에 등록
    if (integration.type === 'healthcheck') {
      try {
        const response = await fetch('http://localhost:8080/api/healthcheck/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: integration.name,
            url: integration.url,
            method: integration.method,
            intervalSeconds: integration.interval
          })
        });

        if (!response.ok) {
          throw new Error('Failed to register health check');
        }

        const result = await response.json();
        integration.healthCheckId = result.id; // 백엔드에서 받은 ID 저장
        alert('Health Check가 성공적으로 등록되었습니다!');
      } catch (err) {
        console.error('Failed to register health check:', err);
        alert('Health Check 등록에 실패했습니다. 백엔드 서버를 확인해주세요.');
        return;
      }
    }

    setIntegrations([...integrations, integration]);
    setShowAddModal(false);
    setNewIntegration({
      name: '',
      type: 'webhook',
      url: '',
      method: 'POST',
      interval: 60
    });
  };

  const handleDeleteIntegration = async (id) => {
    const integration = integrations.find(i => i.id === id);

    if (!window.confirm('이 API를 삭제하시겠습니까?')) {
      return;
    }

    // Health Check인 경우 백엔드에서도 삭제
    if (integration.type === 'healthcheck' && integration.healthCheckId) {
      try {
        await fetch(`http://localhost:8080/api/healthcheck/${integration.healthCheckId}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.error('Failed to delete health check from backend:', err);
      }
    }

    setIntegrations(integrations.filter(i => i.id !== id));
  };

  const handleToggleIntegration = (id) => {
    setIntegrations(integrations.map(i =>
      i.id === id ? { ...i, enabled: !i.enabled } : i
    ));
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL이 클립보드에 복사되었습니다!');
  };

  const handleEditIntegration = (integration) => {
    setEditingIntegration({ ...integration });
    setShowEditModal(true);
  };

  const handleUpdateIntegration = async () => {
    if (!editingIntegration.name || !editingIntegration.url) {
      alert('이름과 URL을 입력해주세요.');
      return;
    }

    // Health Check인 경우 백엔드에서도 업데이트
    if (editingIntegration.type === 'healthcheck' && editingIntegration.healthCheckId) {
      try {
        const response = await fetch(`http://localhost:8080/api/healthcheck/${editingIntegration.healthCheckId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editingIntegration.name,
            url: editingIntegration.url,
            method: editingIntegration.method,
            intervalSeconds: editingIntegration.interval
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update health check');
        }

        alert('Health Check가 성공적으로 업데이트되었습니다!');
      } catch (err) {
        console.error('Failed to update health check:', err);
        alert('Health Check 업데이트에 실패했습니다. 백엔드 서버를 확인해주세요.');
        return;
      }
    }

    setIntegrations(integrations.map(i =>
      i.id === editingIntegration.id ? editingIntegration : i
    ));
    setShowEditModal(false);
    setEditingIntegration(null);
  };

  // 카테고리 필터링된 목록
  const filteredIntegrations = integrations.filter(integration => {
    if (categoryFilter === 'all') return true;
    return integration.type === categoryFilter;
  });

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>API 설정</h2>
        <button className="add-integration-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          API 추가
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div className="category-filter">
        <button
          className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('all')}
        >
          전체 ({integrations.length})
        </button>
        <button
          className={`filter-btn ${categoryFilter === 'webhook' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('webhook')}
        >
          Webhook ({integrations.filter(i => i.type === 'webhook').length})
        </button>
        <button
          className={`filter-btn ${categoryFilter === 'healthcheck' ? 'active' : ''}`}
          onClick={() => setCategoryFilter('healthcheck')}
        >
          Health Check ({integrations.filter(i => i.type === 'healthcheck').length})
        </button>
      </div>

      <div className="integrations-list">
        {filteredIntegrations.map(integration => (
          <div key={integration.id} className={`integration-card ${!integration.enabled ? 'disabled' : ''}`}>
            <div className="integration-header">
              <div className="integration-info">
                <h3>{integration.name}</h3>
                <span className={`integration-type ${integration.type}`}>
                  {integration.type === 'webhook' ? 'Webhook' : 'Health Check'}
                </span>
              </div>
              <div className="integration-actions">
                <button
                  className={`toggle-btn ${integration.enabled ? 'active' : ''}`}
                  onClick={() => handleToggleIntegration(integration.id)}
                  title={integration.enabled ? '비활성화' : '활성화'}
                >
                  {integration.enabled ? <Check size={16} /> : <X size={16} />}
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEditIntegration(integration)}
                  title="편집"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteIntegration(integration.id)}
                  title="삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="integration-details">
              <div className="detail-row">
                <span className="detail-label">URL:</span>
                <div className="url-container">
                  <code className="detail-value">{integration.url}</code>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopyUrl(integration.url)}
                    title="복사"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              {integration.type === 'healthcheck' && (
                <div className="detail-row">
                  <span className="detail-label">체크 간격:</span>
                  <span className="detail-value">{integration.interval}초마다</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* API 추가 모달 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>새 API 추가</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>이름</label>
                <input
                  type="text"
                  placeholder="예: My Custom Service"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>타입</label>
                <select
                  value={newIntegration.type}
                  onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value })}
                >
                  <option value="webhook">Webhook (수신)</option>
                  <option value="healthcheck">Health Check (발신)</option>
                </select>
              </div>

              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  placeholder={newIntegration.type === 'webhook'
                    ? 'http://localhost:8080/api/webhook/custom'
                    : 'https://api.example.com/health'}
                  value={newIntegration.url}
                  onChange={(e) => setNewIntegration({ ...newIntegration, url: e.target.value })}
                />
              </div>

              {newIntegration.type === 'healthcheck' && (
                <>
                  <div className="form-group">
                    <label>HTTP 메서드</label>
                    <select
                      value={newIntegration.method}
                      onChange={(e) => setNewIntegration({ ...newIntegration, method: e.target.value })}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="HEAD">HEAD</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>체크 간격 (초)</label>
                    <input
                      type="number"
                      min="10"
                      max="3600"
                      value={newIntegration.interval}
                      onChange={(e) => setNewIntegration({ ...newIntegration, interval: parseInt(e.target.value) })}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                취소
              </button>
              <button className="confirm-btn" onClick={handleAddIntegration}>
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API 편집 모달 */}
      {showEditModal && editingIntegration && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>API 편집</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>이름</label>
                <input
                  type="text"
                  placeholder="예: My Custom Service"
                  value={editingIntegration.name}
                  onChange={(e) => setEditingIntegration({ ...editingIntegration, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>타입</label>
                <select
                  value={editingIntegration.type}
                  onChange={(e) => setEditingIntegration({ ...editingIntegration, type: e.target.value })}
                  disabled={editingIntegration.isDefault}
                >
                  <option value="webhook">Webhook (수신)</option>
                  <option value="healthcheck">Health Check (발신)</option>
                </select>
              </div>

              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  placeholder={editingIntegration.type === 'webhook'
                    ? 'http://localhost:8080/api/webhook/custom'
                    : 'https://api.example.com/health'}
                  value={editingIntegration.url}
                  onChange={(e) => setEditingIntegration({ ...editingIntegration, url: e.target.value })}
                  disabled={editingIntegration.isDefault}
                />
              </div>

              {editingIntegration.type === 'healthcheck' && (
                <>
                  <div className="form-group">
                    <label>HTTP 메서드</label>
                    <select
                      value={editingIntegration.method}
                      onChange={(e) => setEditingIntegration({ ...editingIntegration, method: e.target.value })}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="HEAD">HEAD</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>체크 간격 (초)</label>
                    <input
                      type="number"
                      min="10"
                      max="3600"
                      value={editingIntegration.interval}
                      onChange={(e) => setEditingIntegration({ ...editingIntegration, interval: parseInt(e.target.value) })}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
                취소
              </button>
              <button className="confirm-btn" onClick={handleUpdateIntegration}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
