# 📹 Camera Troubleshooting Guide

## 🔍 Issue: Black Screen / "No Face Detected"

### Quick Fixes (Try These First)

#### **Step 1: Test Your Camera**
```bash
cd backend
python test_camera.py
```

This will:
- ✅ Check if camera opens
- ✅ Display camera properties
- ✅ Show live preview with face detection
- ✅ Verify Haar cascades are working

**Expected Output:**
```
✅ Camera opened successfully!
✅ Face cascade loaded successfully
✅ Eye cascade loaded successfully
✅ Face detection is working!
```

---

#### **Step 2: Use Enhanced Backend**

The enhanced backend includes visual feedback (like your blink.py):

**Stop the current backend** (Ctrl+C), then run:
```bash
python main_enhanced.py
```

**What's different:**
- ✅ Draws rectangles around faces (blue)
- ✅ Draws rectangles around eyes (green)
- ✅ Draws circles on pupils (white)
- ✅ Shows blink count on video
- ✅ Shows "Face: Detected" status
- ✅ Better error messages

---

#### **Step 3: Check Browser Console**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors like:
   - `Failed to fetch` → Backend not running
   - `CORS error` → CORS not configured (already fixed in main.py)
   - `ERR_CONNECTION_REFUSED` → Wrong port

---

## 🛠️ Common Issues & Solutions

### **Issue 1: Camera Not Opening**

**Symptoms:**
- Black screen in browser
- `camera_active: false` in detection_state
- Backend logs show "Failed to read frame"

**Solutions:**

1. **Close other applications using camera:**
   - Zoom, Microsoft Teams, Skype
   - OBS, Streamlabs
   - Other browser tabs with camera access

2. **Check Windows Camera Privacy Settings:**
   ```
   Settings → Privacy & Security → Camera
   → Allow apps to access your camera: ON
   → Allow desktop apps to access your camera: ON
   ```

3. **Try different camera index:**

   Edit `main_enhanced.py` line 14:
   ```python
   # Try index 1 instead of 0
   camera = cv2.VideoCapture(1)
   ```

4. **Restart camera driver:**
   - Open Device Manager
   - Find "Cameras" or "Imaging Devices"
   - Right-click → Disable → Enable

---

### **Issue 2: Video Stream Not Showing in Browser**

**Symptoms:**
- Backend logs show frames being read
- Browser shows black box
- No error in console

**Solutions:**

1. **Check the URL:**

   Open directly in browser:
   ```
   http://localhost:5000/video_feed
   ```

   Should show raw MJPEG stream

2. **CORS Issue:**

   Verify CORS is enabled in backend (already done in main.py):
   ```python
   CORS(app, resources={r"/*": {"origins": "*"}})
   ```

3. **Browser Cache:**

   Clear cache and hard reload:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

4. **Try different browser:**
   - Chrome (recommended)
   - Firefox
   - Edge

---

### **Issue 3: Face Not Detected (Camera Works)**

**Symptoms:**
- Video shows in browser
- Face is visible but says "No Face"
- `face_detected: false`

**Solutions:**

1. **Improve lighting:**
   - Face camera toward light source
   - Avoid backlighting (window behind you)
   - Turn on room lights

2. **Position yourself:**
   - Center your face in frame
   - Move closer to camera
   - Look directly at camera

3. **Adjust detection sensitivity:**

   Edit `main_enhanced.py` line 54:
   ```python
   # More sensitive (detect smaller/farther faces)
   faces = face_cascade.detectMultiScale(
       gray,
       scaleFactor=1.05,  # Lower = more sensitive (was 1.1)
       minNeighbors=3,    # Lower = more sensitive (was 5)
       minSize=(20, 20)   # Smaller minimum (was 30, 30)
   )
   ```

4. **Test with test_camera.py:**
   ```bash
   python test_camera.py
   ```
   See live face detection rectangles

---

### **Issue 4: Blink Detection Not Working**

**Symptoms:**
- Face detected
- Blink count stays at 0
- You're blinking but not counted

**Solutions:**

1. **Check eye detection:**

   Look at video feed - are green rectangles around your eyes?

   If not:
   - Open eyes wider
   - Look directly at camera
   - Improve lighting

2. **Adjust Hough Circle parameters:**

   Edit `main_enhanced.py` lines 72-79:
   ```python
   circles = cv2.HoughCircles(
       roi_gray,
       cv2.HOUGH_GRADIENT,
       1,
       200,
       param1=150,  # Lower = more sensitive (was 200)
       param2=8,    # Higher = fewer false positives (was 1)
       minRadius=0,
       maxRadius=0
   )
   ```

3. **Test standalone blink.py:**
   ```bash
   python blink.py
   ```
   This shows exactly what your original code detects

---

## 📊 Comparison: main.py vs main_enhanced.py vs blink.py

| Feature | main.py | main_enhanced.py | blink.py |
|---------|---------|------------------|----------|
| Flask server | ✅ | ✅ | ❌ |
| Video streaming | ✅ | ✅ | ❌ |
| Face rectangles | ❌ | ✅ | ❌ |
| Eye rectangles | ❌ | ✅ | ✅ |
| Pupil circles | ❌ | ✅ | ✅ |
| Blink count display | ❌ | ✅ | ✅ |
| Status text | ❌ | ✅ | ✅ |
| Visual feedback | ❌ | ✅ | ✅ |
| API endpoints | ✅ | ✅ | ❌ |
| Recommended | For production | **For development** | For testing |

---

## 🔄 Switching Between Backends

### **Option 1: Enhanced Backend (Recommended for Development)**

```bash
# Stop current server (Ctrl+C)
python main_enhanced.py
```

**Benefits:**
- See what the AI sees (rectangles, circles)
- Debug face/eye detection
- See blink count on video
- Better error messages

---

### **Option 2: Original Backend**

```bash
python main.py
```

**Benefits:**
- Cleaner video (no overlays)
- Slightly better performance
- Production-ready

---

### **Option 3: Use Your blink.py Logic in Frontend**

If you want the graph visualization from blink.py, we can:

1. **Add matplotlib to backend** to generate graphs
2. **Return graph as image** via new endpoint
3. **Display in FocusAnalytics** component

Let me know if you want this!

---

## 🧪 Testing Checklist

Before using StudySmart, verify:

- [ ] **Camera opens:** `python test_camera.py` shows video
- [ ] **Face detected:** Blue rectangle appears around your face
- [ ] **Eyes detected:** Green rectangles appear around eyes
- [ ] **Pupils detected:** White circles appear in eyes
- [ ] **Blinks count:** Counter increases when you blink
- [ ] **Backend running:** `http://localhost:5000/health` returns OK
- [ ] **Video stream works:** `http://localhost:5000/video_feed` shows video
- [ ] **Frontend loads:** `http://localhost:3000` shows app

---

## 🔧 Advanced Configuration

### **Optimize for Your Camera**

Edit `main_enhanced.py` constants at the top:

```python
# Camera selection
CAMERA_INDEX = 0  # Try 0, 1, 2 for different cameras

# Face detection sensitivity
FACE_SCALE_FACTOR = 1.1  # 1.05-1.3 (lower = more sensitive)
FACE_MIN_NEIGHBORS = 5   # 3-8 (lower = more detections)
FACE_MIN_SIZE = (30, 30) # Minimum face size in pixels

# Eye detection
EYE_MIN_SIZE = (20, 20)  # Adjust for your face size

# Blink detection (Hough Circles)
HOUGH_PARAM1 = 200  # Edge detection threshold
HOUGH_PARAM2 = 1    # Accumulator threshold (higher = fewer circles)
```

---

## 🆘 Still Not Working?

### **Diagnostic Commands**

1. **Check camera device:**
   ```bash
   # Windows - List video devices
   ffmpeg -list_devices true -f dshow -i dummy
   ```

2. **Test OpenCV install:**
   ```bash
   python -c "import cv2; print(cv2.__version__); print(cv2.getBuildInformation())"
   ```

3. **Check Flask server:**
   ```bash
   curl http://localhost:5000/health
   ```

4. **Check detection state:**
   ```bash
   curl http://localhost:5000/detection_state
   ```

---

### **Get Verbose Logs**

Add debug logging to backend:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Then check terminal for detailed output.

---

## 📝 Report an Issue

If still not working, provide:

1. **Output of test_camera.py**
2. **Backend terminal logs** (first 50 lines)
3. **Browser console errors** (screenshot)
4. **Your camera model** (Device Manager → Cameras)
5. **Windows version**

---

## 💡 Quick Win: Use Enhanced Backend Now

**Right now, stop your current backend and run:**

```bash
cd backend
python main_enhanced.py
```

**Then refresh your browser** - you should see:
- Blue rectangles around your face
- Green rectangles around your eyes
- White circles on your pupils
- Blink counter in top-left
- "Face: Detected" status

This gives you **exactly what blink.py shows**, but streamed to your browser!

---

## ✅ Success Checklist

You know it's working when you see:

- [ ] Video feed in browser (not black)
- [ ] Blue rectangle around your face
- [ ] Green rectangles around your eyes
- [ ] White circles in your eye regions
- [ ] "Face: Detected" text in green
- [ ] Blink counter increases when you blink
- [ ] "StudySmart Focus Monitor" watermark at bottom

**Now you can start studying with full focus tracking!** 🎉
