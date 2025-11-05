/**
 * Custom hook for tracking and computing focus statistics
 * Integrates with backend detection state and localStorage
 * Uses hybrid focus score formula for realistic quality metrics
 */
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Compute hybrid focus score (v2 formula)
 * Considers focus ratio, stability, and distraction severity
 */
function computeFocusScore(focusedTime, totalTime, numDistractions, distractionDurations) {
  if (totalTime === 0) return 100;

  // Calculate distraction penalty based on duration severity
  const distractionPenalty = distractionDurations.reduce((sum, duration) => {
    if (duration < 5) return sum + 0.25;      // Brief glance away
    if (duration < 15) return sum + 0.5;      // Short distraction
    return sum + 1.0;                          // Long distraction
  }, 0);

  // Core metrics
  const focusRatio = focusedTime / totalTime;
  const stability = 1 - (numDistractions / Math.max(1, totalTime / 60)); // distractions per minute
  const penaltyFactor = 1 - (distractionPenalty / Math.max(1, distractionDurations.length));

  // Weighted combination
  const score = (
    0.7 * focusRatio +
    0.2 * Math.max(0, stability) +
    0.1 * penaltyFactor
  ) * 100;

  return Math.round(Math.max(0, Math.min(score, 100)) * 100) / 100;
}

export function useFocusStats() {
  const [analytics, setAnalytics] = useLocalStorage('studysmart_analytics', {
    sessions: [],
    weeklyData: [],
    totalFocusedMinutes: 0,
    totalDistractionMinutes: 0,
    averageSessionLength: 0,
    focusScore: 100
  });

  const [currentSession, setCurrentSession] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // Start a new focus tracking session
  const startSession = useCallback((sessionData = {}) => {
    const newSession = {
      id: Date.now(),
      startTime: new Date().toISOString(),
      endTime: null,
      focusedSeconds: 0,
      distractedSeconds: 0,
      blinkCount: 0,
      faceDetectionLost: 0,
      distractionEvents: [], // Track individual distraction events
      currentDistractionStart: null, // Track when distraction started
      subject: sessionData.subject || 'General',
      ...sessionData
    };

    setCurrentSession(newSession);
    setIsTracking(true);
  }, []);

  // End current session
  const endSession = useCallback(() => {
    if (!currentSession) return;

    // Close any ongoing distraction
    let finalSession = { ...currentSession };
    if (finalSession.currentDistractionStart !== null) {
      const distractionDuration = Math.round((Date.now() - finalSession.currentDistractionStart) / 1000);
      finalSession.distractionEvents.push(distractionDuration);
      finalSession.currentDistractionStart = null;
    }

    const completedSession = {
      ...finalSession,
      endTime: new Date().toISOString()
    };

    // Update analytics with hybrid focus score
    setAnalytics(prev => {
      const sessions = [...prev.sessions, completedSession];
      const totalFocusedMinutes = sessions.reduce((sum, s) => sum + (s.focusedSeconds / 60), 0);
      const totalDistractionMinutes = sessions.reduce((sum, s) => sum + (s.distractedSeconds / 60), 0);
      const averageSessionLength = sessions.length > 0
        ? sessions.reduce((sum, s) => sum + s.focusedSeconds, 0) / sessions.length / 60
        : 0;

      // Calculate overall focus score using hybrid formula
      const allDistractionEvents = sessions.flatMap(s => s.distractionEvents || []);
      const totalSeconds = (totalFocusedMinutes + totalDistractionMinutes) * 60;
      const totalDistractions = sessions.reduce((sum, s) => s.faceDetectionLost || 0, 0);

      const focusScore = computeFocusScore(
        totalFocusedMinutes * 60,
        totalSeconds,
        totalDistractions,
        allDistractionEvents
      );

      return {
        sessions,
        weeklyData: generateWeeklyData(sessions),
        totalFocusedMinutes: Math.round(totalFocusedMinutes),
        totalDistractionMinutes: Math.round(totalDistractionMinutes),
        averageSessionLength: Math.round(averageSessionLength),
        focusScore: Math.round(focusScore)
      };
    });

    setCurrentSession(null);
    setIsTracking(false);

    return completedSession;
  }, [currentSession, setAnalytics]);

  // Update current session with detection data
  const updateSessionStats = useCallback((detectionState) => {
    if (!isTracking || !currentSession) return;

    setCurrentSession(prev => {
      const updated = { ...prev };
      const now = Date.now();

      if (detectionState.face_detected) {
        // Face detected - user is focused
        updated.focusedSeconds += 1;

        // If we were in a distraction, end it
        if (updated.currentDistractionStart !== null) {
          const distractionDuration = Math.round((now - updated.currentDistractionStart) / 1000);
          updated.distractionEvents.push(distractionDuration);
          updated.currentDistractionStart = null;
        }
      } else {
        // Face NOT detected - user is distracted
        updated.distractedSeconds += 1;
        updated.faceDetectionLost += 1;

        // Start tracking this distraction if not already
        if (updated.currentDistractionStart === null) {
          updated.currentDistractionStart = now;
        }
      }

      if (detectionState.blink_count > prev.blinkCount) {
        updated.blinkCount = detectionState.blink_count;
      }

      return updated;
    });
  }, [isTracking, currentSession]);

  // Generate weekly data for charts
  const generateWeeklyData = (sessions) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const daySessions = sessions.filter(s =>
        s.startTime.startsWith(date)
      );

      const focusedMinutes = daySessions.reduce((sum, s) =>
        sum + (s.focusedSeconds / 60), 0
      );

      const distractedMinutes = daySessions.reduce((sum, s) =>
        sum + (s.distractedSeconds / 60), 0
      );

      return {
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        focused: Math.round(focusedMinutes),
        distracted: Math.round(distractedMinutes)
      };
    });
  };

  // Get today's stats
  const getTodayStats = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = analytics.sessions.filter(s =>
      s.startTime.startsWith(today)
    );

    const focusedMinutes = todaySessions.reduce((sum, s) =>
      sum + (s.focusedSeconds / 60), 0
    );

    const distractedMinutes = todaySessions.reduce((sum, s) =>
      sum + (s.distractedSeconds / 60), 0
    );

    return {
      sessions: todaySessions.length,
      focusedMinutes: Math.round(focusedMinutes),
      distractedMinutes: Math.round(distractedMinutes),
      totalMinutes: Math.round(focusedMinutes + distractedMinutes)
    };
  }, [analytics.sessions]);

  // Get streak information
  const getStreak = useCallback(() => {
    const sortedSessions = [...analytics.sessions].sort((a, b) =>
      new Date(b.startTime) - new Date(a.startTime)
    );

    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].startTime);
      sessionDate.setHours(0, 0, 0, 0);

      if (sessionDate.getTime() === checkDate.getTime()) {
        if (i === 0 || sessionDate.getTime() !== new Date(sortedSessions[i - 1].startTime).setHours(0, 0, 0, 0)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      } else if (sessionDate.getTime() < checkDate.getTime()) {
        break;
      }
    }

    return streak;
  }, [analytics.sessions]);

  return {
    analytics,
    currentSession,
    isTracking,
    startSession,
    endSession,
    updateSessionStats,
    getTodayStats,
    getStreak
  };
}
