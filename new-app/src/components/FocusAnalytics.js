/**
 * FocusAnalytics Component
 * Comprehensive analytics dashboard with charts and metrics
 * Shows focus trends, distraction patterns, and performance insights
 */
import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useFocusStats } from '../hooks/useFocusStats';
import '../styles/FocusAnalytics.css';

export default function FocusAnalytics() {
  const { analytics, getTodayStats, getStreak, currentSession, isTracking } = useFocusStats();

  const todayStats = getTodayStats();
  const currentStreak = getStreak();

  // Include current session in calculations for real-time updates
  const liveAnalytics = useMemo(() => {
    if (!isTracking || !currentSession) return analytics;

    // Add current session minutes to totals
    const currentFocusedMin = Math.round(currentSession.focusedSeconds / 60);
    const currentDistractedMin = Math.round(currentSession.distractedSeconds / 60);

    return {
      ...analytics,
      totalFocusedMinutes: analytics.totalFocusedMinutes + currentFocusedMin,
      totalDistractionMinutes: analytics.totalDistractionMinutes + currentDistractedMin,
    };
  }, [analytics, currentSession, isTracking]);

  // Calculate focus score
  const focusScore = useMemo(() => {
    return liveAnalytics.focusScore;
  }, [liveAnalytics]);

  // Prepare data for pie chart (includes current session)
  const pieData = useMemo(() => {
    return [
      { name: 'Focused', value: liveAnalytics.totalFocusedMinutes, color: '#27AE60' },
      { name: 'Distracted', value: liveAnalytics.totalDistractionMinutes, color: '#E74C3C' }
    ];
  }, [liveAnalytics]);

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return '#27AE60';
    if (score >= 60) return '#F39C12';
    return '#E74C3C';
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value} min
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="focus-analytics">
      <div className="analytics-header">
        <h2>Focus Analytics</h2>
        <p>Track your productivity and focus patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-label">Focus Score</div>
            <div className="stat-value" style={{ color: getScoreColor(focusScore) }}>
              {focusScore}%
            </div>
            <div className="stat-description">
              {focusScore >= 80 ? 'Excellent!' : focusScore >= 60 ? 'Good work' : 'Room for improvement'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-label">Total Focused Time</div>
            <div className="stat-value">{liveAnalytics.totalFocusedMinutes}</div>
            <div className="stat-description">
              minutes {isTracking && '(live session active 🟢)'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Avg Session Length</div>
            <div className="stat-value">{analytics.averageSessionLength}</div>
            <div className="stat-description">minutes per session</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-label">Current Streak</div>
            <div className="stat-value">{currentStreak}</div>
            <div className="stat-description">
              {currentStreak === 1 ? 'day' : 'days'} in a row
            </div>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="chart-section">
        <h3>Today's Progress</h3>
        <div className="today-stats">
          <div className="today-stat">
            <span className="today-label">Sessions Completed</span>
            <span className="today-value">{todayStats.sessions}</span>
          </div>
          <div className="today-stat">
            <span className="today-label">Focused Time</span>
            <span className="today-value focused">{todayStats.focusedMinutes} min</span>
          </div>
          <div className="today-stat">
            <span className="today-label">Distraction Time</span>
            <span className="today-value distracted">{todayStats.distractedMinutes} min</span>
          </div>
          <div className="today-stat">
            <span className="today-label">Total Time</span>
            <span className="today-value">{todayStats.totalMinutes} min</span>
          </div>
        </div>
      </div>

      {/* Weekly Trend Chart */}
      <div className="chart-section">
        <h3>Weekly Focus Trend</h3>
        {analytics.weeklyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
              <XAxis dataKey="day" stroke="#7F8C9B" />
              <YAxis stroke="#7F8C9B" label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="focused"
                stroke="#27AE60"
                strokeWidth={3}
                name="Focused Time"
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="distracted"
                stroke="#E74C3C"
                strokeWidth={3}
                name="Distraction Time"
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-chart">
            <p>📈 Start studying to see your focus trends!</p>
            <p className="empty-chart-hint">
              Your weekly progress will appear here once you complete some study sessions.
            </p>
          </div>
        )}
      </div>

      {/* Focus vs Distraction Breakdown */}
      <div className="chart-section">
        <h3>Focus vs Distraction Breakdown {isTracking && <span style={{color: '#27AE60', fontSize: '14px'}}>● Live</span>}</h3>
        <div className="breakdown-container">
          {liveAnalytics.totalFocusedMinutes + liveAnalytics.totalDistractionMinutes > 0 ? (
            <div className="chart-with-legend">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="breakdown-stats">
                <div className="breakdown-item">
                  <div className="breakdown-color" style={{ background: '#27AE60' }}></div>
                  <div>
                    <div className="breakdown-label">Focused Time</div>
                    <div className="breakdown-value">{liveAnalytics.totalFocusedMinutes} minutes</div>
                  </div>
                </div>
                <div className="breakdown-item">
                  <div className="breakdown-color" style={{ background: '#E74C3C' }}></div>
                  <div>
                    <div className="breakdown-label">Distraction Time</div>
                    <div className="breakdown-value">{liveAnalytics.totalDistractionMinutes} minutes</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-chart">
              <p>📊 No data yet!</p>
              <p className="empty-chart-hint">
                Complete your first study session to see your focus breakdown.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="chart-section">
        <h3>Recent Sessions</h3>
        {analytics.sessions.length > 0 ? (
          <div className="sessions-list">
            {[...analytics.sessions]
              .reverse()
              .slice(0, 10)
              .map((session, index) => {
                const focusRate = session.focusedSeconds + session.distractedSeconds > 0
                  ? (session.focusedSeconds / (session.focusedSeconds + session.distractedSeconds)) * 100
                  : 0;

                return (
                  <div key={session.id} className="session-item">
                    <div className="session-header">
                      <span className="session-subject">{session.subject || 'General'}</span>
                      <span className="session-date">
                        {new Date(session.startTime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="session-stats">
                      <span>⏱️ {Math.round((session.focusedSeconds + session.distractedSeconds) / 60)} min</span>
                      <span>✅ {Math.round(session.focusedSeconds / 60)} focused</span>
                      <span>⚠️ {Math.round(session.distractedSeconds / 60)} distracted</span>
                      <span style={{ color: getScoreColor(focusRate) }}>
                        📊 {Math.round(focusRate)}% focus
                      </span>
                    </div>
                    <div className="session-progress-bar">
                      <div
                        className="session-progress-fill"
                        style={{
                          width: `${focusRate}%`,
                          background: getScoreColor(focusRate)
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="empty-chart">
            <p>📝 No sessions recorded yet</p>
            <p className="empty-chart-hint">
              Your completed study sessions will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Insights */}
      {analytics.sessions.length >= 3 && (
        <div className="insights-section">
          <h3>💡 Insights & Recommendations</h3>
          <div className="insights-list">
            {focusScore >= 80 && (
              <div className="insight-card success">
                <span className="insight-icon">🌟</span>
                <div>
                  <div className="insight-title">Excellent Focus!</div>
                  <div className="insight-text">
                    You're maintaining great concentration during your study sessions.
                  </div>
                </div>
              </div>
            )}

            {currentStreak >= 3 && (
              <div className="insight-card success">
                <span className="insight-icon">🔥</span>
                <div>
                  <div className="insight-title">Amazing Streak!</div>
                  <div className="insight-text">
                    You've studied {currentStreak} days in a row. Keep it up!
                  </div>
                </div>
              </div>
            )}

            {analytics.totalDistractionMinutes > analytics.totalFocusedMinutes * 0.3 && (
              <div className="insight-card warning">
                <span className="insight-icon">⚠️</span>
                <div>
                  <div className="insight-title">Distraction Alert</div>
                  <div className="insight-text">
                    Try to minimize distractions. Consider using the Pomodoro technique.
                  </div>
                </div>
              </div>
            )}

            {analytics.averageSessionLength < 20 && analytics.sessions.length >= 5 && (
              <div className="insight-card info">
                <span className="insight-icon">💪</span>
                <div>
                  <div className="insight-title">Extend Your Sessions</div>
                  <div className="insight-text">
                    Try longer study sessions for deeper focus and better retention.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
