# 📚 StudySmart - AI-Powered Study Focus Tracker

> Boost your productivity with real-time focus tracking, analytics, and gamification

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.12-green.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-lightgrey.svg)](https://flask.palletsprojects.com/)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.11-red.svg)](https://opencv.org/)

## 🎯 What is StudySmart?

StudySmart is an intelligent study companion that uses **computer vision** to track your focus in real-time. Unlike simple timers, it provides **objective metrics** on study quality using camera-based face detection, blink analysis, and distraction tracking.

### ✨ Key Features

- 🎥 **Camera-Based Focus Tracking** - Monitors presence and attention
- 📊 **Real-Time Analytics** - Live charts and metrics during sessions
- ⏱️ **Smart Timer Presets** - Pomodoro (25/5), Deep Work (50/10), Custom
- ✅ **Task Management** - CRUD operations with priority/due dates
- 🏆 **Gamification** - 15+ achievement badges and streak tracking
- 📈 **Advanced Metrics** - Hybrid focus score with distraction severity analysis
- 🔒 **Privacy-First** - All processing happens locally, no data sent to servers
- 📥 **Data Export** - CSV export of all sessions and analytics

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **Webcam** (for focus tracking)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/StudyNew.git
   cd StudyNew
   ```

2. **Install Python dependencies**
   ```bash
   cd backend
   pip install flask flask-cors opencv-python numpy
   ```

3. **Install React dependencies**
   ```bash
   cd ../new-app
   npm install
   ```

### Running the App

**Terminal 1 - Backend:**
```bash
cd backend
python main_base64.py
```

**Terminal 2 - Frontend:**
```bash
cd new-app
npm start
```

**Access:** http://localhost:3000

---

## 📖 How It Works

### 1️⃣ Face Detection
Uses OpenCV Haar Cascades to detect when you're present at your desk.

### 2️⃣ Blink Detection
Tracks eye blinks using Hough Circle detection to monitor attention and fatigue.

### 3️⃣ Distraction Tracking
Records when you look away, categorizing distractions by severity:
- **Brief** (<5 sec) - Quick glance
- **Short** (5-15 sec) - Phone check
- **Long** (>15 sec) - Extended break

### 4️⃣ Hybrid Focus Score
Calculates study quality using:
- **70%** - Time focused ratio
- **20%** - Stability (distraction frequency)
- **10%** - Distraction severity penalty

**Example:**
```
20 min focused + 5 min distracted (10 brief checks)
Score = 72% (penalized for instability)

20 min focused + 5 min distracted (1 long break)
Score = 78% (single break, less penalty)
```

---

## 🎨 Features Breakdown

### 📊 Analytics Dashboard
- Weekly focus trend line chart (7-day view)
- Focus vs Distraction pie chart
- Session history with individual scores
- Today's progress summary
- Streak tracking
- **Real-time updates** during active sessions 🟢

### ✅ Task Planner
- Create/edit/delete tasks
- Priority levels (High, Medium, Low)
- Due dates and subject tagging
- Estimated time tracking
- Filter by status (All, Active, Completed)

### 🏆 Achievements
15 unlockable badges including:
- 🎯 Getting Started (1 session)
- 🔥 3-Day Streak
- 💪 Week Warrior (7 days)
- 👑 Monthly Master (30 days)
- 🎓 Focus Apprentice (30 min no distraction)
- ⏰ 10 Hour Club

### ⚙️ Settings
Customize:
- Camera monitoring on/off
- Timer presets
- Notifications & sounds
- Theme (Light/Dark/Auto)
- Privacy controls
- Data management

---

## 📁 Project Structure

```
StudyNew/
├── backend/
│   ├── main_base64.py          # Flask server (base64 frame streaming)
│   └── main.py                 # Alternative MJPEG streaming backend
│
├── new-app/                    # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── SessionTimer.js
│   │   │   ├── TaskPlanner.js
│   │   │   ├── FocusAnalytics.js
│   │   │   ├── Achievements.js
│   │   │   ├── Settings.js
│   │   │   ├── OnboardingModal.js
│   │   │   └── PrivacyModal.js
│   │   │
│   │   ├── context/            # State management
│   │   │   ├── SessionContext.js
│   │   │   └── SettingsContext.js
│   │   │
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useLocalStorage.js
│   │   │   ├── useTimer.js
│   │   │   └── useFocusStats.js
│   │   │
│   │   ├── utils/              # Utilities
│   │   │   └── exportData.js   # CSV export logic
│   │   │
│   │   └── styles/             # Component CSS
│   │
│   └── package.json
│
├── README.md                   # This file
├── QUICK_START.md             # Quick setup guide
├── STUDYSMART_V2_README.md    # Detailed technical docs
└── FOCUS_SCORE_UPDATE.md      # Focus score algorithm explanation
```

---

## 🧠 Technologies Used

### Frontend
- **React** 18.3.1 - UI framework
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **React Confetti** - Celebration animations
- **Context API** - State management

### Backend
- **Flask** - Python web framework
- **OpenCV** - Computer vision
- **Flask-CORS** - Cross-origin support
- **NumPy** - Numerical operations

---

## 📊 Data Privacy

### 100% Local Processing
- ✅ All camera analysis happens in your browser/computer
- ✅ No images or video sent to any server
- ✅ No account required, no data collection
- ✅ All data stored in browser localStorage (your device only)

### What's Stored Locally
```javascript
localStorage keys:
- studysmart_tasks          // Your tasks
- studysmart_sessions       // Completed sessions
- studysmart_analytics      // Focus stats
- studysmart_achievements   // Unlocked badges
- studysmart_settings       // User preferences
```

### Export Your Data
Export all data as CSV files anytime from the Dashboard.

---

## 🎯 Use Cases

### 📚 Students
- Track study quality, not just hours
- Identify optimal study times
- Build consistent study habits
- Reduce phone distractions

### 💼 Remote Workers
- Maintain focus during work-from-home
- Track deep work sessions
- Measure productivity objectively
- Take timely breaks

### 🧠 Researchers
- Long reading/writing sessions
- Fatigue detection via blink rate
- Distraction pattern analysis
- Session optimization

---

## 🐛 Troubleshooting

### Black Camera Screen
1. Make sure backend is running: `python main_base64.py`
2. Close other apps using camera (Zoom, Teams, etc.)
3. Grant camera permissions in browser
4. Try opening: http://localhost:5000/frame

### Charts Not Updating
1. Start a study session from the Dashboard
2. Navigate to Analytics tab
3. Charts update in real-time with "🟢 Live" indicator

### Detection Not Working
1. Ensure good lighting
2. Position face in center of frame
3. Look directly at camera
4. Check detection status below camera feed

---

## 📈 Roadmap

- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Cloud sync (optional)
- [ ] Google Calendar integration
- [ ] Study group collaboration
- [ ] Advanced analytics (heat maps, productivity scores)
- [ ] Notion/Trello integration

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use and modify!

---

## 🙏 Acknowledgments

- OpenCV for computer vision libraries
- React team for amazing framework
- Recharts for beautiful charts
- All contributors and users!

---

## 📞 Support

- **Issues:** Open an issue on GitHub
- **Docs:** See `STUDYSMART_V2_README.md` for detailed documentation
- **Quick Start:** See `QUICK_START.md` for 3-step setup

---

## ⭐ Star This Repo

If StudySmart helps you study better, please give it a star! ⭐

**Made with ❤️ for productive studying**

---

## 📸 Screenshots

### Dashboard
![Dashboard Overview](screenshots/dashboard.png)

### Session Timer
![Study Session](screenshots/session.png)

### Analytics
![Focus Analytics](screenshots/analytics.png)

### Achievements
![Badges](screenshots/achievements.png)

---

**Happy Studying! 📚✨**
