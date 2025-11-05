/**
 * Achievements Component
 * Gamification system with badges, streaks, and progress tracking
 */
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useFocusStats } from '../hooks/useFocusStats';
import '../styles/Achievements.css';

// Badge definitions
const BADGES = [
  {
    id: 'first_session',
    name: 'Getting Started',
    description: 'Complete your first study session',
    icon: '🎯',
    requirement: (stats) => stats.analytics.sessions.length >= 1
  },
  {
    id: 'three_sessions',
    name: 'Consistency Builder',
    description: 'Complete 3 study sessions',
    icon: '📚',
    requirement: (stats) => stats.analytics.sessions.length >= 3
  },
  {
    id: 'ten_sessions',
    name: 'Dedicated Learner',
    description: 'Complete 10 study sessions',
    icon: '⭐',
    requirement: (stats) => stats.analytics.sessions.length >= 10
  },
  {
    id: 'fifty_sessions',
    name: 'Study Master',
    description: 'Complete 50 study sessions',
    icon: '🏆',
    requirement: (stats) => stats.analytics.sessions.length >= 50
  },
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Study for 3 days in a row',
    icon: '🔥',
    requirement: (stats) => stats.getStreak() >= 3
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Study for 7 days in a row',
    icon: '💪',
    requirement: (stats) => stats.getStreak() >= 7
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Study for 30 days in a row',
    icon: '👑',
    requirement: (stats) => stats.getStreak() >= 30
  },
  {
    id: 'focused_30min',
    name: 'Focus Apprentice',
    description: 'Stay focused for 30 minutes straight',
    icon: '🎓',
    requirement: (stats) => stats.analytics.sessions.some(s => s.focusedSeconds >= 1800)
  },
  {
    id: 'focused_60min',
    name: 'Concentration King',
    description: 'Stay focused for 60 minutes straight',
    icon: '👨‍🎓',
    requirement: (stats) => stats.analytics.sessions.some(s => s.focusedSeconds >= 3600)
  },
  {
    id: 'high_focus_score',
    name: 'Laser Focused',
    description: 'Achieve 90%+ focus score',
    icon: '🎯',
    requirement: (stats) => stats.analytics.focusScore >= 90
  },
  {
    id: 'total_10hours',
    name: '10 Hour Club',
    description: 'Accumulate 10 hours of focused study',
    icon: '⏰',
    requirement: (stats) => stats.analytics.totalFocusedMinutes >= 600
  },
  {
    id: 'total_50hours',
    name: '50 Hour Hero',
    description: 'Accumulate 50 hours of focused study',
    icon: '🌟',
    requirement: (stats) => stats.analytics.totalFocusedMinutes >= 3000
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a session before 8 AM',
    icon: '🌅',
    requirement: (stats) => stats.analytics.sessions.some(s => {
      const hour = new Date(s.startTime).getHours();
      return hour < 8;
    })
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a session after 10 PM',
    icon: '🦉',
    requirement: (stats) => stats.analytics.sessions.some(s => {
      const hour = new Date(s.startTime).getHours();
      return hour >= 22;
    })
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Study on a Saturday or Sunday',
    icon: '🏖️',
    requirement: (stats) => stats.analytics.sessions.some(s => {
      const day = new Date(s.startTime).getDay();
      return day === 0 || day === 6;
    })
  }
];

export default function Achievements() {
  const focusStats = useFocusStats();
  const [unlockedBadges, setUnlockedBadges] = useLocalStorage('studysmart_achievements', []);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  // Check for newly earned badges
  useEffect(() => {
    BADGES.forEach(badge => {
      const isUnlocked = unlockedBadges.some(b => b.id === badge.id);
      const meetsRequirement = badge.requirement(focusStats);

      if (!isUnlocked && meetsRequirement) {
        // New badge earned!
        const earnedBadge = {
          ...badge,
          earnedAt: new Date().toISOString()
        };

        setUnlockedBadges(prev => [...prev, earnedBadge]);
        setNewBadge(earnedBadge);
        setShowConfetti(true);

        // Hide confetti after 5 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);

        // Clear new badge notification after 3 seconds
        setTimeout(() => {
          setNewBadge(null);
        }, 3000);
      }
    });
  }, [focusStats, unlockedBadges, setUnlockedBadges]);

  // Calculate progress
  const totalBadges = BADGES.length;
  const earnedBadges = unlockedBadges.length;
  const progressPercentage = (earnedBadges / totalBadges) * 100;

  // Get badge status
  const getBadgeStatus = (badge) => {
    const unlocked = unlockedBadges.find(b => b.id === badge.id);
    return unlocked
      ? { unlocked: true, earnedAt: unlocked.earnedAt }
      : { unlocked: false, progress: badge.requirement(focusStats) };
  };

  return (
    <div className="achievements">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* New Badge Notification */}
      {newBadge && (
        <div className="badge-notification">
          <div className="badge-notification-content">
            <div className="badge-notification-icon">{newBadge.icon}</div>
            <div>
              <div className="badge-notification-title">Badge Unlocked!</div>
              <div className="badge-notification-name">{newBadge.name}</div>
            </div>
          </div>
        </div>
      )}

      <div className="achievements-header">
        <h2>Achievements</h2>
        <p>Unlock badges by completing challenges</p>
      </div>

      {/* Progress Overview */}
      <div className="achievements-progress">
        <div className="progress-header">
          <h3>Your Progress</h3>
          <span className="progress-count">
            {earnedBadges} / {totalBadges} Badges Earned
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="progress-percentage">{Math.round(progressPercentage)}% Complete</div>
      </div>

      {/* Current Streak */}
      <div className="streak-card">
        <div className="streak-icon">🔥</div>
        <div className="streak-content">
          <h3>Current Streak</h3>
          <div className="streak-count">{focusStats.getStreak()} Days</div>
          <p>Keep studying daily to maintain your streak!</p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="badges-section">
        <h3>All Badges</h3>
        <div className="badges-grid">
          {BADGES.map(badge => {
            const status = getBadgeStatus(badge);
            return (
              <div
                key={badge.id}
                className={`badge-card ${status.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-info">
                  <h4>{badge.name}</h4>
                  <p>{badge.description}</p>
                  {status.unlocked ? (
                    <div className="badge-earned">
                      ✓ Earned {new Date(status.earnedAt).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="badge-locked">🔒 Not yet unlocked</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <h3>Your Stats</h3>
        <div className="stats-summary-grid">
          <div className="summary-stat">
            <div className="summary-icon">📊</div>
            <div>
              <div className="summary-value">{focusStats.analytics.sessions.length}</div>
              <div className="summary-label">Total Sessions</div>
            </div>
          </div>
          <div className="summary-stat">
            <div className="summary-icon">⏱️</div>
            <div>
              <div className="summary-value">
                {Math.round(focusStats.analytics.totalFocusedMinutes / 60)}h
              </div>
              <div className="summary-label">Total Hours</div>
            </div>
          </div>
          <div className="summary-stat">
            <div className="summary-icon">🎯</div>
            <div>
              <div className="summary-value">{focusStats.analytics.focusScore}%</div>
              <div className="summary-label">Focus Score</div>
            </div>
          </div>
          <div className="summary-stat">
            <div className="summary-icon">🔥</div>
            <div>
              <div className="summary-value">{focusStats.getStreak()}</div>
              <div className="summary-label">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
