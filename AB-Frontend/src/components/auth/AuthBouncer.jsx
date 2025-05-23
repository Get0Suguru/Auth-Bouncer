import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import HeroSection from '../layout/HeroSection';
import MobileHeader from '../layout/MobileHeader';
import AuthHeader from './AuthHeader';
import OAuthButtons from './OAuthButtons';
import AuthForm from './AuthForm';
import AuthFooter from './AuthFooter';
import TutorialOverlay from './TutorialOverlay';

export default function AuthBouncer({ isLogin = true }) {
  const { login, register, loading, error, registrationSuccess, clearRegistrationSuccess, clearError } = useAuthContext();
  const navigate = useNavigate();
  const prevIsLoginRef = useRef(isLogin);
  const [showTutorial, setShowTutorial] = useState(false);

  // Clear error only when switching between login/register (not on initial mount)
  useEffect(() => {
    if (prevIsLoginRef.current !== isLogin && clearError) {
      clearError();
    }
    prevIsLoginRef.current = isLogin;
  }, [isLogin, clearError]);

  // Handle registration success
  useEffect(() => {
    if (registrationSuccess) {
      alert('Registration successful! Please sign in with your credentials.');
      clearRegistrationSuccess();
      navigate('/login');
    }
  }, [registrationSuccess, clearRegistrationSuccess, navigate]);

  // Check if tutorial should be shown (only for first-time login users)
  useEffect(() => {
    if (isLogin) {
      const hasSeenTutorial = localStorage.getItem('auth-tutorial-completed');
      if (!hasSeenTutorial) {
        // Show tutorial after a short delay to let the page load
        const timer = setTimeout(() => {
          setShowTutorial(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLogin]);

  const handleLogin = async (formData) => {
    try {
      await login({ email: formData.email, password: formData.password });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleRegister = async (formData) => {
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('auth-tutorial-completed', 'true');
  };

  const resetTutorial = () => {
    localStorage.removeItem('auth-tutorial-completed');
    setShowTutorial(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 flex">
      <HeroSection />
      
      {/* Right Form Side */}
      <div className="w-full md:ml-[50%] p-8 md:p-12 flex flex-col justify-center relative">
        {/* Tutorial reset button (for testing) - remove in production */}
        {isLogin && (
          <button
            onClick={resetTutorial}
            className="absolute top-0 right-8 text-xs text-gray-500 hover:text-gray-300 underline bg-gray-800 bg-opacity-50 px-2 py-1 rounded"
          >
            Reset Tutorial
          </button>
        )}
        <div className="max-w-md mx-auto w-full">
          <MobileHeader />
          <AuthHeader isLogin={isLogin} />
          <OAuthButtons />
          
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <AuthForm 
            isLogin={isLogin} 
            onLogin={handleLogin}
            onRegister={handleRegister}
            loading={loading}
            error={error}
          />
          
          <AuthFooter isLogin={isLogin} />
        </div>
      </div>

      {/* Tutorial Overlay */}
      <TutorialOverlay 
        isVisible={showTutorial}
        onComplete={handleTutorialComplete}
      />
    </div>
  );
} 