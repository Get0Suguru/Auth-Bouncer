import { useState, useEffect, useRef } from 'react';
import { FaArrowRight, FaTimes, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

export default function TutorialOverlay({ isVisible, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });

  const tutorialSteps = [
    {
      id: 'oauth-buttons',
      title: 'OAuth2 Login',
      description: 'Login securely with your Google or GitHub account using industry-standard OAuth2 protocol',
      position: 'top',
      arrowDirection: 'down'
    },
    {
      id: 'email-password',
      title: 'Traditional Login',
      description: 'Use your email and password for secure authentication with our encrypted system',
      position: 'bottom',
      arrowDirection: 'up'
    },
    {
      id: 'otp-toggle',
      title: 'One-Time Password',
      description: 'Enhanced security with OTP sent to your email - no password needed!',
      position: 'bottom',
      arrowDirection: 'up'
    },
    {
      id: 'jwt-security',
      title: 'JWT Token Security',
      description: 'We use both Access and Refresh tokens for maximum security. Your session is protected with industry-leading JWT technology!',
      position: 'top',
      arrowDirection: 'down'
    }
  ];

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isVisible]);

  // Update highlighted element and arrow position when step changes
  useEffect(() => {
    if (isVisible && currentStep < tutorialSteps.length) {
      const stepId = tutorialSteps[currentStep].id;
      const element = document.querySelector(`[data-tutorial="${stepId}"]`);
      
      if (element) {
        setHighlightedElement(element);
        
        // Calculate arrow position
        const rect = element.getBoundingClientRect();
        const isTop = tutorialSteps[currentStep].position === 'top';
        
        setArrowPosition({
          top: isTop ? rect.top - 80 : rect.bottom + 20,
          left: rect.left + rect.width / 2
        });
      }
    }
  }, [currentStep, isVisible]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 150);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isVisible) return null;

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop without blur - we'll handle blur differently */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      
      {/* Highlighted element spotlight */}
      {highlightedElement && (
        <div 
          className="absolute rounded-lg shadow-2xl border-2 border-orange-400 bg-orange-400 bg-opacity-10"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 4,
            left: highlightedElement.getBoundingClientRect().left - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
            zIndex: 10
          }}
        />
      )}
      
      {/* Arrow pointing to highlighted element */}
      {highlightedElement && (
        <div 
          className="absolute z-20"
          style={{
            top: arrowPosition.top,
            left: arrowPosition.left - 20,
          }}
        >
          <div className={`text-4xl text-orange-400 drop-shadow-lg ${currentStepData.arrowDirection === 'down' ? 'rotate-90' : '-rotate-90'}`}>
            <FaArrowRight />
          </div>
        </div>
      )}
      
      {/* Tutorial overlay */}
      <div className="relative h-full flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
        >
          <FaTimes />
        </button>

        {/* Tutorial content */}
        <div className={`relative max-w-md mx-4 transition-all duration-300 z-20 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Tutorial card */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                {currentStepData.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {currentStepData.description}
              </p>
              
              {/* Progress indicator */}
              <div className="flex justify-center space-x-2 mb-6">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentStep 
                        ? 'bg-orange-500 scale-125' 
                        : index < currentStep 
                          ? 'bg-green-500' 
                          : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    currentStep === 0
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <FaChevronLeft className="text-sm" />
                  <span className="text-sm">Previous</span>
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  style={{ background: 'var(--dynamic-secondary-color)', color: '#000' }}
                >
                  <span className="text-sm">
                    {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                  </span>
                  {currentStep < tutorialSteps.length - 1 && <FaChevronRight className="text-sm" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 