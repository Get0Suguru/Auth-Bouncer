import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export default function OAuthCallback() {
  const [status, setStatus] = useState('Processing...');
  const { googleOAuthLogin, githubOAuthLogin } = useAuthContext();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Prevent multiple executions
      if (hasProcessed.current) {
        return;
      }
      hasProcessed.current = true;

      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state'); // GitHub uses state parameter

        if (error) {
          setStatus('OAuth error: ' + error);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!code) {
          setStatus('No authorization code received');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Determine which OAuth provider was used
        // GitHub typically includes a state parameter, Google doesn't
        const isGitHub = state !== null;
        
        if (isGitHub) {
          // Verify GitHub OAuth state to prevent CSRF attacks
          const storedState = sessionStorage.getItem('github_oauth_state');
          
          if (!storedState) {
            setStatus('Security error: No state found. Please try logging in again.');
            setTimeout(() => navigate('/login'), 3000);
            return;
          }
          
          if (state !== storedState) {
            setStatus('Security error: State mismatch. Possible CSRF attack detected.');
            setTimeout(() => navigate('/login'), 3000);
            return;
          }
          
          // Clear the stored state after successful verification
          sessionStorage.removeItem('github_oauth_state');
        }

        setStatus('Exchanging code for token...');
        
        // Exchange the code for a token
        if (isGitHub) {
          await githubOAuthLogin(code);
        } else {
          await googleOAuthLogin(code);
        }
        
        setStatus('Login successful! Redirecting...');
        
        // Clear the URL parameters and redirect to home
        window.history.replaceState({}, document.title, '/');
        navigate('/');
        
      } catch (err) {
        setStatus('Login failed: ' + err.message);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuthCallback();
  }, []); // Empty dependency array - only run once

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">OAuth Callback</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-300">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 