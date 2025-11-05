/**
 * Simple camera test component - exact copy of v1 camera display
 * This should work if v1 worked
 */
import React, { useEffect, useState } from 'react';

export default function CameraTest() {
  const [detectionState, setDetectionState] = useState({
    face_detected: false,
    blink_count: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/detection_state')
        .then(response => response.json())
        .then(data => setDetectionState(data))
        .catch(error => console.error('Error fetching detection state:', error));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>Camera Test - V1 Style</h1>
      <p>This uses EXACT same code as v1</p>

      <div style={{ margin: '20px auto', maxWidth: '640px' }}>
        <img
          src="http://localhost:5000/video_feed"
          width="640"
          height="480"
          alt="Live Video Feed"
          style={{ border: '2px solid #ccc' }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '18px' }}>
          Face Detected: <strong>{detectionState.face_detected ? "Yes ✅" : "No ❌"}</strong>
        </p>
        <p style={{ fontSize: '18px' }}>
          Blinks Detected: <strong>{detectionState.blink_count}</strong>
        </p>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Troubleshooting</h3>
        <p>If you see a black screen:</p>
        <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
          <li>Check backend is running: <code>python main.py</code></li>
          <li>Test URL directly: <a href="http://localhost:5000/video_feed" target="_blank" rel="noopener noreferrer">http://localhost:5000/video_feed</a></li>
          <li>Check browser console (F12) for errors</li>
          <li>Make sure no other app is using the camera</li>
        </ul>
      </div>
    </div>
  );
}
