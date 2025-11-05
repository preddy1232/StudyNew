/**
 * StudySmart v2 - Main Application Component
 * Integrates all new features: timer, analytics, tasks, achievements, settings
 * Uses Context for state management and React Router for navigation
 */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { SettingsProvider } from './context/SettingsContext';

// Components
import Dashboard from './components/Dashboard';
import SessionTimer from './components/SessionTimer';
import TaskPlanner from './components/TaskPlanner';
import FocusAnalytics from './components/FocusAnalytics';
import Achievements from './components/Achievements';
import Settings from './components/Settings';
import OnboardingModal from './components/OnboardingModal';
import PrivacyModal from './components/PrivacyModal';
import CameraTest from './components/CameraTest';

// Styles
import './styles/App.css';

function AppV2() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle shortcuts if not typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'escape':
          // Close modals with Escape key
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <SettingsProvider>
      <SessionProvider>
        <Router>
          <div className="app">
            {/* Onboarding Modal - shown on first visit */}
            <OnboardingModal />

            {/* Privacy Modal - shown when camera access is needed */}
            {showPrivacyModal && (
              <PrivacyModal
                onAccept={() => setShowPrivacyModal(false)}
                onDecline={() => {
                  setShowPrivacyModal(false);
                  alert('Camera disabled. You can enable it later in Settings.');
                }}
              />
            )}

            {/* Header */}
            <header className="app-header">
              <div className="header-content">
                <div className="logo">
                  <h1>📚 StudySmart</h1>
                  <span className="version">v2.0</span>
                </div>
                <nav className="main-nav">
                  <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    🏠 Dashboard
                  </NavLink>
                  <NavLink to="/session" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    ⏱️ Session
                  </NavLink>
                  <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    ✅ Tasks
                  </NavLink>
                  <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    📊 Analytics
                  </NavLink>
                  <NavLink to="/achievements" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    🏆 Achievements
                  </NavLink>
                  <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    ⚙️ Settings
                  </NavLink>
                </nav>
              </div>
            </header>

            {/* Main Content */}
            <main className="app-main">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/session" element={<SessionTimer />} />
                <Route path="/tasks" element={<TaskPlanner />} />
                <Route path="/analytics" element={<FocusAnalytics />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/camera-test" element={<CameraTest />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="app-footer">
              <p>
                Made with ❤️ by StudySmart Team |
                <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}>
                  Privacy
                </a> |
                <a href="#" onClick={(e) => e.preventDefault()}>Help</a>
              </p>
            </footer>
          </div>
        </Router>
      </SessionProvider>
    </SettingsProvider>
  );
}

export default AppV2;
