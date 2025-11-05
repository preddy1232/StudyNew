/**
 * Settings Context Provider
 * Manages user preferences and app configuration
 */
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  // Camera & Monitoring
  cameraEnabled: true,
  showFocusGraph: true,
  faceDetectionSensitivity: 'medium', // low, medium, high

  // Timer Preferences
  timerPreset: 'pomodoro', // pomodoro, deepwork, custom
  customWorkDuration: 30,
  customBreakDuration: 5,
  autoStartBreaks: true,
  autoStartNextSession: false,

  // Notifications
  notificationsEnabled: true,
  soundEnabled: true,
  desktopNotifications: false,

  // Theme & UI
  theme: 'light', // light, dark, auto
  compactMode: false,
  showMotivationalQuotes: true,

  // Privacy
  privacyNoticeAccepted: false,
  saveSessionHistory: true,
  anonymousUsage: true,

  // Gamification
  showAchievements: true,
  celebrateStreaks: true,
  confettiEnabled: true
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('studysmart_settings', DEFAULT_SETTINGS);

  // Update a single setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update multiple settings at once
  const updateSettings = (updates) => {
    setSettings(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Reset to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Get a specific setting
  const getSetting = (key) => {
    return settings[key] ?? DEFAULT_SETTINGS[key];
  };

  const value = {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
    getSetting
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
