"""
Alternative backend - sends frames as base64 JSON instead of MJPEG
This works better with modern browsers
"""
from flask import Flask, Response, jsonify
import cv2
from flask_cors import CORS
import base64
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize the webcam
camera = cv2.VideoCapture(0)

if not camera.isOpened():
    print("ERROR: Camera failed to open!")
    exit(1)

print("Camera opened successfully!")

# Load Haar cascades
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_righteye_2splits.xml')

# Shared state
detection_state = {
    "face_detected": False,
    "blink_count": 0,
}

circle_detected = False
current_frame = None


def analyze_frame(frame):
    """Analyze frame for face/eye/blink detection"""
    global circle_detected

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    detection_state["face_detected"] = len(faces) > 0

    eyes = eye_cascade.detectMultiScale(gray)
    circles_detected_in_frame = False

    for (ex, ey, ew, eh) in eyes:
        roi_gray = gray[ey:ey + eh, ex:ex + ew]
        circles = cv2.HoughCircles(
            roi_gray, cv2.HOUGH_GRADIENT, 1, 200,
            param1=200, param2=1, minRadius=0, maxRadius=0
        )
        if circles is not None:
            circles_detected_in_frame = True
            break

    if circles_detected_in_frame:
        if not circle_detected:
            detection_state["blink_count"] += 1
        circle_detected = True
    else:
        circle_detected = False


def capture_frames():
    """Background thread to continuously capture frames"""
    global current_frame

    while True:
        success, frame = camera.read()
        if success:
            analyze_frame(frame)
            # Resize frame for faster transmission (optional - remove if you want full quality)
            # frame = cv2.resize(frame, (640, 480))
            current_frame = frame
        # No sleep - capture as fast as possible


# Start frame capture in background
import threading
capture_thread = threading.Thread(target=capture_frames, daemon=True)
capture_thread.start()


def gen_frames():
    """Generator for MJPEG stream"""
    while True:
        if current_frame is not None:
            ret, buffer = cv2.imencode('.jpg', current_frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(0.033)


@app.route('/video_feed')
def video_feed():
    """MJPEG video stream"""
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/frame')
def get_frame():
    """Get single frame as base64 - alternative to MJPEG"""
    if current_frame is not None:
        # Use lower JPEG quality for faster transmission (60-80 is good balance)
        ret, buffer = cv2.imencode('.jpg', current_frame, [cv2.IMWRITE_JPEG_QUALITY, 75])
        frame_base64 = base64.b64encode(buffer).decode('utf-8')
        return jsonify({
            "frame": f"data:image/jpeg;base64,{frame_base64}",
            "timestamp": time.time()
        })
    return jsonify({"error": "No frame available"}), 404


@app.route('/detection_state', methods=['GET'])
def get_detection_state():
    """Detection state API"""
    return jsonify(detection_state)


if __name__ == '__main__':
    print("=" * 60)
    print("StudySmart Backend - Base64 Mode")
    print("=" * 60)
    print("Endpoints:")
    print("  http://localhost:5000/video_feed (MJPEG)")
    print("  http://localhost:5000/frame (Base64 JSON)")
    print("  http://localhost:5000/detection_state")
    print("=" * 60)

    app.run(host='localhost', port=5000, debug=False, threaded=True)
