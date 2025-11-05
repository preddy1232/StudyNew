/**
 * Dashboard Component
 * Main overview page showing today's stats, quick actions, and recent activity
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { useFocusStats } from '../hooks/useFocusStats';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { exportAllData } from '../utils/exportData';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { timer } = useSession();
  const focusStats = useFocusStats();
  const [tasks] = useLocalStorage('studysmart_tasks', []);

  const todayStats = focusStats.getTodayStats();
  const currentStreak = focusStats.getStreak();
  const activeTasks = tasks.filter(t => !t.completed).length;
  const upcomingTasks = tasks
    .filter(t => !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  // Quick stats
  const quickStats = [
    {
      icon: '🔥',
      label: 'Current Streak',
      value: `${currentStreak} days`,
      color: '#E74C3C'
    },
    {
      icon: '⏱️',
      label: 'Today\'s Focus',
      value: `${todayStats.focusedMinutes} min`,
      color: '#27AE60'
    },
    {
      icon: '✅',
      label: 'Active Tasks',
      value: activeTasks,
      color: '#3498DB'
    },
    {
      icon: '🎯',
      label: 'Focus Score',
      value: `${focusStats.analytics.focusScore}%`,
      color: '#9B59B6'
    }
  ];

  // Handle export
  const handleExport = () => {
    exportAllData({
      sessions: focusStats.analytics.sessions,
      analytics: focusStats.analytics,
      tasks: tasks
    });
  };

  // Motivational quotes
  const quotes = [
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" }
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <section className="dashboard-welcome">
        <div className="welcome-content">
          <h1>Welcome back! 👋</h1>
          <p className="welcome-subtitle">Let's make today productive</p>
        </div>
        <div className="welcome-actions">
          <button onClick={() => navigate('/session')} className="btn-primary-large">
            ⏱️ Start Study Session
          </button>
          <button onClick={() => navigate('/tasks')} className="btn-secondary-large">
            ✅ View Tasks
          </button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="dashboard-section">
        <h2>Today's Overview</h2>
        <div className="quick-stats-grid">
          {quickStats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="stat-card-icon">{stat.icon}</div>
              <div className="stat-card-content">
                <div className="stat-card-label">{stat.label}</div>
                <div className="stat-card-value">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Motivational Quote */}
      <section className="dashboard-section">
        <div className="quote-card">
          <div className="quote-icon">💡</div>
          <blockquote>
            <p>"{randomQuote.text}"</p>
            <cite>— {randomQuote.author}</cite>
          </blockquote>
        </div>
      </section>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Upcoming Tasks</h2>
            <button onClick={() => navigate('/tasks')} className="btn-link">
              View All →
            </button>
          </div>
          <div className="upcoming-tasks">
            {upcomingTasks.map(task => (
              <div key={task.id} className="upcoming-task-item">
                <div className="task-priority-indicator" style={{
                  backgroundColor: task.priority === 'high' ? '#E74C3C' :
                                  task.priority === 'medium' ? '#F39C12' : '#3498DB'
                }} />
                <div className="task-info">
                  <h4>{task.title}</h4>
                  {task.subject && <span className="task-subject-tag">{task.subject}</span>}
                </div>
                <div className="task-due">
                  📅 {new Date(task.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Activity */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Sessions</h2>
          <button onClick={() => navigate('/analytics')} className="btn-link">
            View Analytics →
          </button>
        </div>
        {focusStats.analytics.sessions.length > 0 ? (
          <div className="recent-sessions">
            {[...focusStats.analytics.sessions]
              .reverse()
              .slice(0, 5)
              .map(session => {
                const totalMinutes = Math.round((session.focusedSeconds + session.distractedSeconds) / 60);
                const focusRate = session.focusedSeconds + session.distractedSeconds > 0
                  ? Math.round((session.focusedSeconds / (session.focusedSeconds + session.distractedSeconds)) * 100)
                  : 0;

                return (
                  <div key={session.id} className="recent-session-item">
                    <div className="session-time">
                      {new Date(session.startTime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="session-details">
                      <span className="session-subject">{session.subject || 'General Study'}</span>
                      <span className="session-duration">⏱️ {totalMinutes} min</span>
                    </div>
                    <div className="session-focus-badge" style={{
                      backgroundColor: focusRate >= 80 ? '#27AE60' :
                                      focusRate >= 60 ? '#F39C12' : '#E74C3C'
                    }}>
                      {focusRate}% focused
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="empty-state">
            <p>No study sessions yet. Start your first session!</p>
            <button onClick={() => navigate('/session')} className="btn-primary">
              Start Session
            </button>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button onClick={() => navigate('/achievements')} className="action-card">
            <span className="action-icon">🏆</span>
            <span className="action-label">View Achievements</span>
          </button>
          <button onClick={handleExport} className="action-card">
            <span className="action-icon">📥</span>
            <span className="action-label">Export Data</span>
          </button>
          <button onClick={() => navigate('/settings')} className="action-card">
            <span className="action-icon">⚙️</span>
            <span className="action-label">Settings</span>
          </button>
        </div>
      </section>
    </div>
  );
}
