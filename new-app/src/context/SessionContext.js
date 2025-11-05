/**
 * Session Context Provider
 * Manages active study sessions, timer state, and focus tracking
 */
import React, { createContext, useContext, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useFocusStats } from '../hooks/useFocusStats';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const timer = useTimer('pomodoro');
  const focusStats = useFocusStats();

  // Auto-start focus tracking when timer starts
  useEffect(() => {
    if (timer.isRunning && !focusStats.isTracking && !timer.isBreak) {
      focusStats.startSession({
        preset: timer.currentPreset,
        plannedDuration: timer.totalTime / 60
      });
    }
  }, [timer.isRunning, timer.isBreak, focusStats, timer.currentPreset, timer.totalTime]);

  // Auto-end focus tracking when work session completes
  useEffect(() => {
    if (!timer.isRunning && focusStats.isTracking && timer.timeLeft === timer.totalTime) {
      // Session just completed
      focusStats.endSession();
    }
  }, [timer.isRunning, focusStats, timer.timeLeft, timer.totalTime]);

  const value = {
    // Timer controls
    timer,

    // Focus statistics
    focusStats,

    // Combined utilities
    startWorkSession: () => {
      timer.start();
      if (!timer.isBreak) {
        focusStats.startSession({
          preset: timer.currentPreset,
          plannedDuration: timer.totalTime / 60
        });
      }
    },

    pauseSession: () => {
      timer.pause();
    },

    resetSession: () => {
      timer.reset();
      if (focusStats.isTracking) {
        focusStats.endSession();
      }
    },

    completeSession: () => {
      const session = focusStats.endSession();
      timer.reset();
      return session;
    }
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
