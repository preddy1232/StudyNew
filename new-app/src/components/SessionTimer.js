/**
 * SessionTimer Component
 * Main study session interface with timer, camera feed, and controls
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { useSettings } from '../context/SettingsContext';
import '../styles/SessionTimer.css';

export default function SessionTimer() {
  const navigate = useNavigate();
  const { timer, focusStats, startWorkSession, pauseSession, resetSession, completeSession } = useSession();
  const { settings } = useSettings();
  const [detectionState, setDetectionState] = useState({
    face_detected: false,
    blink_count: 0
  });
  const [cameraFrame, setCameraFrame] = useState(null);

  // Handler for ending session early
  const handleEndSessionEarly = () => {
    if (focusStats.isTracking) {
      completeSession();
      navigate('/analytics');
    }
  };

  // Fetch camera frames continuously (base64 method)
  useEffect(() => {
    if (settings.cameraEnabled) {
      let isMounted = true;

      const fetchFrame = async () => {
        if (!isMounted) return;

        try {
          const response = await fetch('http://localhost:5000/frame');
          const data = await response.json();
          if (data.frame && isMounted) {
            setCameraFrame(data.frame);
          }
        } catch (error) {
          console.error('Error fetching frame:', error);
        }

        if (isMounted) {
          requestAnimationFrame(fetchFrame);
        }
      };

      fetchFrame();

      return () => {
        isMounted = false;
      };
    }
  }, [settings.cameraEnabled]);

  // Poll detection state from backend
  useEffect(() => {
    if (timer.isRunning && settings.cameraEnabled) {
      const interval = setInterval(() => {
        fetch('http://localhost:5000/detection_state')
          .then(response => response.json())
          .then(data => {
            setDetectionState(data);
            // Update focus stats
            if (focusStats.isTracking) {
              focusStats.updateSessionStats(data);
            }
          })
          .catch(error => console.error('Error fetching detection state:', error));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer.isRunning, settings.cameraEnabled, focusStats]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle shortcuts if not typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          timer.isRunning ? pauseSession() : startWorkSession();
          break;
        case 'r':
          e.preventDefault();
          resetSession();
          break;
        case 's':
          e.preventDefault();
          timer.skip();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [timer, startWorkSession, pauseSession, resetSession]);

  // Timer complete notification
  useEffect(() => {
    if (timer.timeLeft === 0 && settings.notificationsEnabled) {
      // Play sound if enabled
      if (settings.soundEnabled) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi78OScTgwOUKXh7bllHAU2jdTxy3o…');
        audio.play().catch(e => console.log('Audio play failed:', e));
      }

      // Show browser notification
      if (settings.desktopNotifications && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('StudySmart Timer Complete!', {
            body: timer.isBreak ? 'Break time is over. Ready to focus?' : 'Great work! Time for a break.',
            icon: '/logo192.png'
          });
        }
      }
    }
  }, [timer.timeLeft, timer.isBreak, settings]);

  // Progress circle calculation
  const progressPercentage = timer.getProgress();
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="session-timer">
      <div className="timer-container">
        {/* Timer Preset Selector */}
        <div className="preset-selector">
          <button
            onClick={() => timer.changePreset('pomodoro')}
            className={`preset-btn ${timer.currentPreset === 'pomodoro' ? 'active' : ''}`}
          >
            🍅 Pomodoro
            <span className="preset-time">25/5</span>
          </button>
          <button
            onClick={() => timer.changePreset('deepwork')}
            className={`preset-btn ${timer.currentPreset === 'deepwork' ? 'active' : ''}`}
          >
            🧠 Deep Work
            <span className="preset-time">50/10</span>
          </button>
          <button
            onClick={() => timer.changePreset('custom')}
            className={`preset-btn ${timer.currentPreset === 'custom' ? 'active' : ''}`}
          >
            ⚙️ Custom
            <span className="preset-time">{settings.customWorkDuration}/{settings.customBreakDuration}</span>
          </button>
        </div>

        {/* Main Timer Display */}
        <div className="timer-display">
          <svg className="progress-ring" width="320" height="320">
            {/* Background circle */}
            <circle
              className="progress-ring-bg"
              cx="160"
              cy="160"
              r={radius}
              fill="none"
              stroke="#E8ECF0"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              className={`progress-ring-fill ${timer.isBreak ? 'break-mode' : ''}`}
              cx="160"
              cy="160"
              r={radius}
              fill="none"
              stroke={timer.isBreak ? '#F39C12' : '#3498DB'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 160 160)"
            />
          </svg>

          <div className="timer-content">
            <div className="timer-mode">
              {timer.isBreak ? '☕ Break Time' : '📚 Focus Mode'}
            </div>
            <div className="timer-time">
              {timer.formatTime()}
            </div>
            <div className="timer-status">
              {timer.isRunning ? 'In Progress' : 'Paused'}
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="timer-controls">
          <button
            onClick={() => timer.isRunning ? pauseSession() : startWorkSession()}
            className={`control-btn primary ${timer.isRunning ? 'pause' : 'start'}`}
          >
            {timer.isRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button onClick={resetSession} className="control-btn secondary">
            🔄 Reset
          </button>
          <button onClick={timer.skip} className="control-btn secondary">
            ⏭️ Skip
          </button>
          {focusStats.isTracking && (
            <button onClick={handleEndSessionEarly} className="control-btn success">
              ✅ End & View Results
            </button>
          )}
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="keyboard-shortcuts">
          <span><kbd>Space</kbd> Start/Pause</span>
          <span><kbd>R</kbd> Reset</span>
          <span><kbd>S</kbd> Skip</span>
        </div>

        {/* Session Stats */}
        {focusStats.isTracking && (
          <div className="session-stats">
            <h3>Current Session</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Duration</span>
                <span className="stat-value">
                  {Math.round((focusStats.currentSession.focusedSeconds + focusStats.currentSession.distractedSeconds) / 60)} min
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Focused</span>
                <span className="stat-value focused">
                  {Math.round(focusStats.currentSession.focusedSeconds / 60)} min
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Distracted</span>
                <span className="stat-value distracted">
                  {Math.round(focusStats.currentSession.distractedSeconds / 60)} min
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Blinks</span>
                <span className="stat-value">
                  {focusStats.currentSession.blinkCount}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Camera Feed Section */}
      {settings.cameraEnabled && (
        <div className="camera-section">
          <h3>📹 Focus Monitor</h3>
          <div className="camera-feed">
            {cameraFrame ? (
              <img
                src={cameraFrame}
                alt="Camera Feed"
                width="640"
                height="480"
                style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
              />
            ) : (
              <div style={{ width: '640px', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff' }}>
                Loading camera...
              </div>
            )}
          </div>

          {/* Detection Status */}
          <div className="detection-status">
            <div className={`status-indicator ${detectionState.face_detected ? 'active' : 'inactive'}`}>
              <span className="status-icon">👤</span>
              <span className="status-label">
                {detectionState.face_detected ? 'Face Detected' : 'No Face'}
              </span>
            </div>
            <div className="status-indicator">
              <span className="status-icon">👁️</span>
              <span className="status-label">
                Blinks: {detectionState.blink_count}
              </span>
            </div>
          </div>

          {/* Tips */}
          <div className="camera-tips">
            <p>💡 <strong>Tip:</strong> Position yourself in good lighting for best tracking</p>
          </div>
        </div>
      )}

      {/* No Camera Message */}
      {!settings.cameraEnabled && (
        <div className="no-camera-message">
          <p>📹 Camera monitoring is disabled</p>
          <p>Enable it in Settings to track your focus metrics</p>
        </div>
      )}
    </div>
  );
}
