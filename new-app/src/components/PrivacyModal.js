/**
 * PrivacyModal Component
 * Privacy notice displayed when camera is first enabled
 * Explains data handling and user consent
 */
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import '../styles/PrivacyModal.css';

export default function PrivacyModal({ onAccept, onDecline }) {
  const { settings, updateSetting } = useSettings();

  const handleAccept = () => {
    updateSetting('privacyNoticeAccepted', true);
    onAccept();
  };

  if (settings.privacyNoticeAccepted) {
    return null;
  }

  return (
    <div className="privacy-overlay">
      <div className="privacy-modal">
        <div className="privacy-header">
          <div className="privacy-icon">🔒</div>
          <h2>Privacy & Camera Access</h2>
        </div>

        <div className="privacy-content">
          <section className="privacy-section">
            <h3>📹 How We Use Your Camera</h3>
            <p>
              StudySmart uses your camera to provide focus tracking and attention monitoring
              during study sessions. This helps you understand your concentration patterns
              and improve productivity.
            </p>
          </section>

          <section className="privacy-section">
            <h3>🔐 Your Data is Private</h3>
            <ul>
              <li>
                <strong>Local Processing:</strong> All camera processing happens entirely
                in your browser using JavaScript. No video is sent to any server.
              </li>
              <li>
                <strong>No Storage:</strong> Camera frames are analyzed in real-time and
                immediately discarded. No images or videos are ever saved.
              </li>
              <li>
                <strong>No Tracking:</strong> We don't collect, store, or transmit any
                personal information or biometric data.
              </li>
              <li>
                <strong>Local Storage Only:</strong> Study statistics are saved in your
                browser's local storage and never leave your device.
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>✋ You're In Control</h3>
            <ul>
              <li>You can disable camera monitoring at any time in Settings</li>
              <li>You can clear all stored data whenever you want</li>
              <li>Camera access can be revoked in your browser settings</li>
              <li>The app works without camera (but with limited features)</li>
            </ul>
          </section>

          <section className="privacy-section technical">
            <h3>🔧 Technical Details</h3>
            <p>
              We use open-source computer vision libraries (OpenCV.js, MediaPipe) that
              run entirely client-side. The backend only processes video frames you
              explicitly send and returns detection results - no data is persisted.
            </p>
          </section>

          <div className="privacy-consent">
            <label className="consent-checkbox">
              <input type="checkbox" id="consent-check" required />
              <span>
                I understand that StudySmart will use my camera for focus tracking,
                and I consent to this local processing. I acknowledge that I can
                disable this feature at any time.
              </span>
            </label>
          </div>
        </div>

        <div className="privacy-actions">
          <button onClick={onDecline} className="btn-secondary">
            Decline - Use Without Camera
          </button>
          <button
            onClick={() => {
              const checkbox = document.getElementById('consent-check');
              if (checkbox && checkbox.checked) {
                handleAccept();
              } else {
                alert('Please read and accept the consent checkbox to continue.');
              }
            }}
            className="btn-primary"
          >
            Accept & Enable Camera
          </button>
        </div>

        <div className="privacy-footer">
          <p>
            Questions? Visit our{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Privacy Policy
            </a>{' '}
            or{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
