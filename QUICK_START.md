# 🚀 StudySmart v2 - Quick Start Guide

## ⚡ Get Running in 3 Steps

### Step 1: Update Entry Point

Replace the contents of [new-app/src/index.js](new-app/src/index.js) with:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppV2 from './AppV2';
import './styles/App.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppV2 />
  </React.StrictMode>
);
```

### Step 2: Start Backend

```bash
cd backend
python main.py
```

Backend will run on http://localhost:5000

### Step 3: Start Frontend

```bash
cd new-app
npm start
```

Frontend will run on http://localhost:3000

---

## 🎯 First Actions

1. **Complete Onboarding** - Interactive tutorial will guide you
2. **Start a Study Session** - Click "Start Study Session" from Dashboard
3. **Create Tasks** - Navigate to Tasks tab
4. **Check Analytics** - View your focus stats
5. **Earn Badges** - Complete sessions to unlock achievements

---

## 📱 Key Features Quick Access

| Feature | Route | Description |
|---------|-------|-------------|
| **Dashboard** | `/dashboard` | Overview, today's stats, quick actions |
| **Session Timer** | `/session` | Pomodoro/Deep Work timer with camera |
| **Tasks** | `/tasks` | Create and manage study tasks |
| **Analytics** | `/analytics` | Charts, trends, focus score |
| **Achievements** | `/achievements` | Badges, streaks, progress |
| **Settings** | `/settings` | Customize everything |

---

## ⌨️ Keyboard Shortcuts

- `Space` - Start/Pause Timer
- `R` - Reset Timer
- `S` - Skip to Break
- `Esc` - Close Modals

---

## 🎨 What's New in v2

✅ **Task Management** - Full CRUD with priority, due dates, subjects
✅ **Focus Analytics** - Weekly trends, focus score, insights
✅ **15 Badges** - Gamification with confetti animations
✅ **Timer Presets** - Pomodoro (25/5), Deep Work (50/10), Custom
✅ **Settings Page** - Camera, timer, theme, privacy controls
✅ **Onboarding** - First-time user guide
✅ **Privacy Modal** - Camera consent & data transparency
✅ **CSV Export** - Download all your data
✅ **Responsive Design** - Mobile-friendly
✅ **Keyboard Shortcuts** - Productivity boost

---

## 📦 File Organization

```
All new files are in:
- src/components/     (8 new components)
- src/context/        (2 context providers)
- src/hooks/          (3 custom hooks)
- src/utils/          (export utilities)
- src/styles/         (9 CSS files)
```

Original files unchanged - v2 is fully isolated!

---

## 🔧 Configuration

### Default Settings

```javascript
{
  cameraEnabled: true,
  timerPreset: 'pomodoro',      // 25 min work, 5 min break
  notificationsEnabled: true,
  theme: 'light',
  showAchievements: true
}
```

Change in Settings page or edit `context/SettingsContext.js`

---

## 💾 Data Storage

All data stored in browser localStorage:

```javascript
studysmart_tasks              // Your tasks
studysmart_sessions           // Completed sessions
studysmart_analytics          // Focus stats
studysmart_achievements       // Unlocked badges
studysmart_settings           // Preferences
studysmart_onboarding_complete // Tutorial flag
```

**To reset:** Settings → Danger Zone → Clear All Data

**To backup:** Dashboard → Export Data (CSV files)

---

## 🎥 Camera Setup

1. **Accept Privacy Modal** - First time you enable camera
2. **Allow Browser Permission** - Grant camera access
3. **Position yourself** - Good lighting, face visible
4. **Start Session** - Focus tracking begins automatically

**No camera?** App works without it (limited tracking)

---

## 🏆 Earning Badges

| Badge | Requirement |
|-------|-------------|
| 🎯 Getting Started | 1 session |
| 📚 Consistency Builder | 3 sessions |
| ⭐ Dedicated Learner | 10 sessions |
| 🔥 3-Day Streak | Study 3 days in a row |
| 💪 Week Warrior | Study 7 days in a row |
| 🎓 Focus Apprentice | 30 min focused session |
| 🎯 Laser Focused | 90%+ focus score |
| ⏰ 10 Hour Club | 10 hours total study time |

...and 7 more! Check Achievements page.

---

## 📊 Understanding Focus Score

```
Focus Score = (Focused Minutes / Total Minutes) × 100
```

**Example:**
- 20 min focused + 5 min distracted = 80% focus score

**Tracked by:**
- Face detection (are you present?)
- Blink patterns (attention level)
- Session duration

---

## ❓ Common Questions

**Q: Can I use this without a camera?**
A: Yes! Disable in Settings. You'll get manual timers without automatic focus tracking.

**Q: Where is my data stored?**
A: Locally in your browser only. Nothing sent to servers (privacy-first).

**Q: Can I export my data?**
A: Yes! Dashboard → Quick Actions → Export Data (CSV format).

**Q: How do I change timer duration?**
A: Settings → Timer Preferences → Select "Custom" preset.

**Q: Will I lose data if I clear cookies?**
A: Yes, localStorage data clears with cookies. Export regularly!

---

## 🐛 Issues?

**Camera not working:**
```bash
# Check backend is running
curl http://localhost:5000/detection_state

# Should return: {"face_detected": false, "blink_count": 0}
```

**Page blank:**
```bash
# Check for console errors
# Open browser DevTools (F12) → Console
```

**Dependencies missing:**
```bash
cd new-app
npm install
```

---

## 📚 Full Documentation

See [STUDYSMART_V2_README.md](STUDYSMART_V2_README.md) for complete technical details.

---

## 🎉 You're All Set!

Enjoy your new productivity powerhouse! 🚀

**Happy Studying! 📚✨**
