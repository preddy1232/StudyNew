/**
 * Settings Component
 * Comprehensive settings page for app customization
 * Includes camera, timer, notifications, theme, and privacy settings
 */
import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useClearStorage } from '../hooks/useLocalStorage';
import '../styles/Settings.css';

export default function Settings() {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { clearAllStudyData } = useClearStorage();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);
  const [customWorkTime, setCustomWorkTime] = useState(settings.customWorkDuration);
  const [customBreakTime, setCustomBreakTime] = useState(settings.customBreakDuration);

  // Handle custom timer update
  const handleCustomTimerUpdate = () => {
    updateSetting('customWorkDuration', customWorkTime);
    updateSetting('customBreakDuration', customBreakTime);
    alert('Custom timer preset saved!');
  };

  // Reset all settings
  const handleResetSettings = () => {
    resetSettings();
    setShowResetConfirm(false);
    alert('Settings reset to defaults');
  };

  // Clear all data
  const handleClearAllData = () => {
    clearAllStudyData();
    setShowClearDataConfirm(false);
    alert('All study data cleared. Refresh the page to see changes.');
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Customize your StudySmart experience</p>
      </div>

      {/* Camera & Monitoring */}
      <section className="settings-section">
        <h3>📹 Camera & Monitoring</h3>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <label>Enable Camera Monitoring</label>
              <p>Use your camera to track focus and detect distractions</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.cameraEnabled}
                onChange={(e) => updateSetting('cameraEnabled', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Show Focus Graph</label>
              <p>Display real-time focus metrics during sessions</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showFocusGraph}
                onChange={(e) => updateSetting('showFocusGraph', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Face Detection Sensitivity</label>
              <p>Adjust how strictly face detection monitors your presence</p>
            </div>
            <select
              value={settings.faceDetectionSensitivity}
              onChange={(e) => updateSetting('faceDetectionSensitivity', e.target.value)}
              className="setting-select"
            >
              <option value="low">Low - More lenient</option>
              <option value="medium">Medium - Balanced</option>
              <option value="high">High - Strict</option>
            </select>
          </div>
        </div>
      </section>

      {/* Timer Preferences */}
      <section className="settings-section">
        <h3>⏱️ Timer Preferences</h3>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <label>Default Timer Preset</label>
              <p>Choose your preferred study timer format</p>
            </div>
            <select
              value={settings.timerPreset}
              onChange={(e) => updateSetting('timerPreset', e.target.value)}
              className="setting-select"
            >
              <option value="pomodoro">Pomodoro (25/5)</option>
              <option value="deepwork">Deep Work (50/10)</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {settings.timerPreset === 'custom' && (
            <div className="custom-timer-config">
              <div className="timer-input-group">
                <label>Work Duration (minutes)</label>
                <input
                  type="number"
                  value={customWorkTime}
                  onChange={(e) => setCustomWorkTime(parseInt(e.target.value))}
                  min="5"
                  max="120"
                />
              </div>
              <div className="timer-input-group">
                <label>Break Duration (minutes)</label>
                <input
                  type="number"
                  value={customBreakTime}
                  onChange={(e) => setCustomBreakTime(parseInt(e.target.value))}
                  min="1"
                  max="30"
                />
              </div>
              <button onClick={handleCustomTimerUpdate} className="btn-primary-small">
                Save Custom Timer
              </button>
            </div>
          )}

          <div className="setting-item">
            <div className="setting-info">
              <label>Auto-start Breaks</label>
              <p>Automatically start break timer when work session ends</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => updateSetting('autoStartBreaks', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Auto-start Next Session</label>
              <p>Automatically start next work session after break</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.autoStartNextSession}
                onChange={(e) => updateSetting('autoStartNextSession', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="settings-section">
        <h3>🔔 Notifications</h3>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <label>Enable Notifications</label>
              <p>Receive alerts for session completion and breaks</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => updateSetting('notificationsEnabled', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Sound Notifications</label>
              <p>Play sound alerts when timers complete</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                disabled={!settings.notificationsEnabled}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Desktop Notifications</label>
              <p>Show browser notifications even when tab is inactive</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.desktopNotifications}
                onChange={(e) => updateSetting('desktopNotifications', e.target.checked)}
                disabled={!settings.notificationsEnabled}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </section>

      {/* Theme & UI */}
      <section className="settings-section">
        <h3>🎨 Theme & Appearance</h3>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <label>Theme</label>
              <p>Choose your preferred color scheme</p>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value)}
              className="setting-select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Compact Mode</label>
              <p>Reduce spacing for a more compact interface</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => updateSetting('compactMode', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Show Motivational Quotes</label>
              <p>Display inspirational quotes during study sessions</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showMotivationalQuotes}
                onChange={(e) => updateSetting('showMotivationalQuotes', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </section>

      {/* Gamification */}
      <section className="settings-section">
        <h3>🏆 Gamification</h3>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <label>Show Achievements</label>
              <p>Display badges and unlockable achievements</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showAchievements}
                onChange={(e) => updateSetting('showAchievements', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Celebrate Streaks</label>
              <p>Get special notifications for maintaining study streaks</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.celebrateStreaks}
                onChange={(e) => updateSetting('celebrateStreaks', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Confetti Animations</label>
              <p>Show confetti when earning new badges</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.confettiEnabled}
                onChange={(e) => updateSetting('confettiEnabled', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </section>

      {/* Privacy & Data */}
      <section className="settings-section">
        <h3>🔒 Privacy & Data</h3>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <label>Save Session History</label>
              <p>Store your completed sessions for analytics</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.saveSessionHistory}
                onChange={(e) => updateSetting('saveSessionHistory', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Anonymous Usage</label>
              <p>Data is stored locally on your device only</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.anonymousUsage}
                onChange={(e) => updateSetting('anonymousUsage', e.target.checked)}
                disabled
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="danger-zone">
            <h4>⚠️ Danger Zone</h4>
            <div className="danger-actions">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="btn-warning"
              >
                Reset All Settings
              </button>
              <button
                onClick={() => setShowClearDataConfirm(true)}
                className="btn-danger"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reset All Settings?</h3>
            <p>This will restore all settings to their default values. Your study data will not be affected.</p>
            <div className="modal-actions">
              <button onClick={() => setShowResetConfirm(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleResetSettings} className="btn-warning">
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Confirm Modal */}
      {showClearDataConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearDataConfirm(false)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Clear All Data?</h3>
            <p>⚠️ This will permanently delete all your tasks, sessions, analytics, and achievements. This action cannot be undone!</p>
            <div className="modal-actions">
              <button onClick={() => setShowClearDataConfirm(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleClearAllData} className="btn-danger">
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
