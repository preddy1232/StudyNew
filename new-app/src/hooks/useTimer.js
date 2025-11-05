/**
 * Custom hook for managing study session timers
 * Supports Pomodoro, Deep Work, and custom timer presets
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTimer(preset = 'pomodoro') {
  // Timer presets in minutes
  const PRESETS = {
    pomodoro: { work: 25, break: 5 },
    deepwork: { work: 50, break: 10 },
    custom: { work: 30, break: 5 }
  };

  const [currentPreset, setCurrentPreset] = useState(preset);
  const [timeLeft, setTimeLeft] = useState(PRESETS[preset].work * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useLocalStorage('studysmart_sessions_count', 0);
  const intervalRef = useRef(null);

  // Calculate total session time
  const getTotalTime = useCallback(() => {
    return isBreak
      ? PRESETS[currentPreset].break * 60
      : PRESETS[currentPreset].work * 60;
  }, [currentPreset, isBreak]);

  // Start timer
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Pause timer
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset timer
  const reset = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(PRESETS[currentPreset].work * 60);
  }, [currentPreset]);

  // Skip to break or next session
  const skip = useCallback(() => {
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(PRESETS[currentPreset].work * 60);
    } else {
      setIsBreak(true);
      setTimeLeft(PRESETS[currentPreset].break * 60);
    }
    setIsRunning(false);
  }, [currentPreset, isBreak]);

  // Change preset
  const changePreset = useCallback((newPreset) => {
    if (PRESETS[newPreset]) {
      setCurrentPreset(newPreset);
      setIsRunning(false);
      setIsBreak(false);
      setTimeLeft(PRESETS[newPreset].work * 60);
    }
  }, []);

  // Set custom time (in minutes)
  const setCustomTime = useCallback((workMinutes, breakMinutes) => {
    PRESETS.custom = { work: workMinutes, break: breakMinutes };
    if (currentPreset === 'custom') {
      setTimeLeft(workMinutes * 60);
    }
  }, [currentPreset]);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer complete
            setIsRunning(false);

            if (!isBreak) {
              // Work session completed
              setSessionsCompleted(count => count + 1);
              setIsBreak(true);
              return PRESETS[currentPreset].break * 60;
            } else {
              // Break completed
              setIsBreak(false);
              return PRESETS[currentPreset].work * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, isBreak, currentPreset, setSessionsCompleted]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Get progress percentage
  const getProgress = useCallback(() => {
    const total = getTotalTime();
    return ((total - timeLeft) / total) * 100;
  }, [timeLeft, getTotalTime]);

  return {
    timeLeft,
    isRunning,
    isBreak,
    currentPreset,
    sessionsCompleted,
    formatTime: () => formatTime(timeLeft),
    getProgress,
    start,
    pause,
    reset,
    skip,
    changePreset,
    setCustomTime,
    totalTime: getTotalTime()
  };
}
