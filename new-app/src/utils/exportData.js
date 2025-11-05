/**
 * Export Utilities
 * Functions for exporting study data in various formats
 */

/**
 * Convert sessions data to CSV format
 * @param {Array} sessions - Array of session objects
 * @returns {string} CSV formatted string
 */
export function sessionsToCSV(sessions) {
  if (!sessions || sessions.length === 0) {
    return 'No data available';
  }

  // CSV Headers
  const headers = [
    'Session ID',
    'Start Time',
    'End Time',
    'Duration (min)',
    'Subject',
    'Preset',
    'Focused Time (min)',
    'Distracted Time (min)',
    'Focus Rate (%)',
    'Blink Count',
    'Face Detection Lost Count'
  ];

  // Convert sessions to CSV rows
  const rows = sessions.map(session => {
    const totalSeconds = session.focusedSeconds + session.distractedSeconds;
    const durationMinutes = Math.round(totalSeconds / 60);
    const focusedMinutes = Math.round(session.focusedSeconds / 60);
    const distractedMinutes = Math.round(session.distractedSeconds / 60);
    const focusRate = totalSeconds > 0
      ? Math.round((session.focusedSeconds / totalSeconds) * 100)
      : 0;

    return [
      session.id,
      session.startTime,
      session.endTime || 'In Progress',
      durationMinutes,
      session.subject || 'General',
      session.preset || 'N/A',
      focusedMinutes,
      distractedMinutes,
      focusRate,
      session.blinkCount || 0,
      session.faceDetectionLost || 0
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Convert analytics data to CSV format
 * @param {Object} analytics - Analytics object
 * @returns {string} CSV formatted string
 */
export function analyticsToCSV(analytics) {
  const headers = ['Metric', 'Value'];

  const rows = [
    ['Total Sessions', analytics.sessions.length],
    ['Total Focused Minutes', analytics.totalFocusedMinutes],
    ['Total Distraction Minutes', analytics.totalDistractionMinutes],
    ['Average Session Length (min)', analytics.averageSessionLength],
    ['Focus Score (%)', analytics.focusScore],
    ['Export Date', new Date().toISOString()]
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Convert tasks to CSV format
 * @param {Array} tasks - Array of task objects
 * @returns {string} CSV formatted string
 */
export function tasksToCSV(tasks) {
  if (!tasks || tasks.length === 0) {
    return 'No tasks available';
  }

  const headers = [
    'Task ID',
    'Title',
    'Description',
    'Subject',
    'Priority',
    'Status',
    'Due Date',
    'Estimated Time (min)',
    'Created At',
    'Updated At'
  ];

  const rows = tasks.map(task => [
    task.id,
    task.title,
    task.description || '',
    task.subject || '',
    task.priority,
    task.completed ? 'Completed' : 'Active',
    task.dueDate || 'No due date',
    task.estimatedTime,
    task.createdAt,
    task.updatedAt
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Trigger browser download of CSV file
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Name of file to download
 */
export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export all study data as a combined CSV
 * @param {Object} data - Object containing sessions, analytics, and tasks
 */
export function exportAllData(data) {
  const { sessions, analytics, tasks } = data;

  const timestamp = new Date().toISOString().split('T')[0];

  // Export sessions
  if (sessions && sessions.length > 0) {
    const sessionsCSV = sessionsToCSV(sessions);
    downloadCSV(sessionsCSV, `studysmart-sessions-${timestamp}.csv`);
  }

  // Export analytics summary
  if (analytics) {
    const analyticsCSV = analyticsToCSV(analytics);
    downloadCSV(analyticsCSV, `studysmart-analytics-${timestamp}.csv`);
  }

  // Export tasks
  if (tasks && tasks.length > 0) {
    const tasksCSV = tasksToCSV(tasks);
    downloadCSV(tasksCSV, `studysmart-tasks-${timestamp}.csv`);
  }
}

/**
 * Export data as JSON (alternative format)
 * @param {Object} data - Data to export
 * @param {string} filename - Name of file
 */
export function exportAsJSON(data, filename) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Google Calendar integration stub
 * Prepares session data for Google Calendar API
 * @param {Object} session - Session object
 * @returns {Object} Google Calendar event object
 */
export function prepareGoogleCalendarEvent(session) {
  const startDate = new Date(session.startTime);
  const endDate = session.endTime ? new Date(session.endTime) : new Date();

  const focusRate = session.focusedSeconds + session.distractedSeconds > 0
    ? Math.round((session.focusedSeconds / (session.focusedSeconds + session.distractedSeconds)) * 100)
    : 0;

  return {
    summary: `Study Session - ${session.subject || 'General'}`,
    description: `Studied for ${Math.round((session.focusedSeconds + session.distractedSeconds) / 60)} minutes with ${focusRate}% focus rate.\n\nTracked with StudySmart`,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    colorId: '9' // Blue color for study sessions
  };
}

/**
 * Placeholder for Google Calendar API integration
 * To implement: Add Google OAuth and Calendar API calls
 * @param {Object} session - Session to add to calendar
 */
export async function addToGoogleCalendar(session) {
  const event = prepareGoogleCalendarEvent(session);

  // TODO: Implement Google Calendar API integration
  // 1. Set up Google OAuth 2.0 client
  // 2. Request calendar.events scope
  // 3. Call gapi.client.calendar.events.insert()

  console.log('Google Calendar integration not yet implemented');
  console.log('Event to be created:', event);

  alert('Google Calendar integration coming soon! Event data logged to console.');

  return event;
}
