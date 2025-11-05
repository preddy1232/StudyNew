/**
 * OnboardingModal Component
 * First-time user onboarding experience
 * Explains app features and camera tracking
 */
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import '../styles/OnboardingModal.css';

export default function OnboardingModal() {
  const [onboardingComplete, setOnboardingComplete] = useLocalStorage('studysmart_onboarding_complete', false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to StudySmart! 🎓',
      description: 'Your AI-powered study companion that helps you stay focused and productive.',
      icon: '👋',
      content: (
        <div className="onboarding-content">
          <p>StudySmart uses smart technology to:</p>
          <ul>
            <li>✅ Track your focus and study time</li>
            <li>📊 Provide detailed analytics</li>
            <li>🏆 Reward your progress with achievements</li>
            <li>⏱️ Help you manage study sessions</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Camera-Based Focus Tracking 📹',
      description: 'We use your camera to monitor your focus during study sessions.',
      icon: '📹',
      content: (
        <div className="onboarding-content">
          <p><strong>How it works:</strong></p>
          <ul>
            <li>🔍 Face detection tracks when you\'re present</li>
            <li>👁️ Blink detection monitors attention levels</li>
            <li>📱 Phone detection identifies distractions</li>
          </ul>
          <div className="info-box">
            <strong>🔒 Your Privacy Matters</strong>
            <p>All camera processing happens locally in your browser. No images are saved or transmitted anywhere.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Study Timer & Sessions ⏱️',
      description: 'Choose from Pomodoro, Deep Work, or custom timer presets.',
      icon: '⏱️',
      content: (
        <div className="onboarding-content">
          <p><strong>Timer Options:</strong></p>
          <ul>
            <li><strong>Pomodoro:</strong> 25 min work, 5 min break</li>
            <li><strong>Deep Work:</strong> 50 min work, 10 min break</li>
            <li><strong>Custom:</strong> Set your own durations</li>
          </ul>
          <p>Your focus metrics are automatically tracked during each session!</p>
        </div>
      )
    },
    {
      title: 'Analytics & Achievements 📊',
      description: 'Track your progress and unlock badges as you study.',
      icon: '🏆',
      content: (
        <div className="onboarding-content">
          <p><strong>Features:</strong></p>
          <ul>
            <li>📈 Weekly focus trends and statistics</li>
            <li>🎯 Focus score calculations</li>
            <li>🔥 Daily study streaks</li>
            <li>🏅 Unlockable achievement badges</li>
          </ul>
          <p>All data is stored locally on your device for privacy.</p>
        </div>
      )
    },
    {
      title: 'Keyboard Shortcuts ⌨️',
      description: 'Control StudySmart without lifting your hands from the keyboard.',
      icon: '⌨️',
      content: (
        <div className="onboarding-content">
          <div className="shortcuts-grid">
            <div className="shortcut-item">
              <kbd>Space</kbd>
              <span>Start/Pause Timer</span>
            </div>
            <div className="shortcut-item">
              <kbd>R</kbd>
              <span>Reset Timer</span>
            </div>
            <div className="shortcut-item">
              <kbd>S</kbd>
              <span>Skip to Break</span>
            </div>
            <div className="shortcut-item">
              <kbd>Esc</kbd>
              <span>Close Modals</span>
            </div>
          </div>
          <p className="shortcut-note">More shortcuts available in settings!</p>
        </div>
      )
    },
    {
      title: 'Ready to Start! 🚀',
      description: 'You\'re all set to begin your focused study journey.',
      icon: '🎉',
      content: (
        <div className="onboarding-content final-step">
          <p><strong>Quick Tips:</strong></p>
          <ul>
            <li>💡 Find a quiet, well-lit space for best camera tracking</li>
            <li>🎯 Start with short sessions and gradually increase</li>
            <li>☕ Take breaks seriously - they\'re essential!</li>
            <li>📊 Check your analytics regularly to spot patterns</li>
          </ul>
          <div className="success-box">
            <strong>You\'re ready to ace your studies! 💪</strong>
            <p>Click "Get Started" to begin your first session.</p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOnboardingComplete(true);
    }
  };

  const handleSkip = () => {
    setOnboardingComplete(true);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (onboardingComplete) {
    return null;
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <button onClick={handleSkip} className="skip-button">
          Skip Tutorial
        </button>

        <div className="onboarding-header">
          <div className="step-icon">{currentStepData.icon}</div>
          <h2>{currentStepData.title}</h2>
          <p>{currentStepData.description}</p>
        </div>

        <div className="onboarding-body">
          {currentStepData.content}
        </div>

        <div className="onboarding-footer">
          <div className="progress-dots">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>

          <div className="onboarding-actions">
            {currentStep > 0 && (
              <button onClick={handlePrevious} className="btn-secondary">
                Previous
              </button>
            )}
            <button onClick={handleNext} className="btn-primary">
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
