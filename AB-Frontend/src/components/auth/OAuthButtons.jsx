import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export default function OAuthButtons() {
  const handleGoogleLogin = () => {
    const clientId = '623707348621-9nobhgabk862fak8h14k0suf5b3dphm4.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('http://localhost:5173');
    const scope = encodeURIComponent('email profile');
    
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    
    window.location.href = googleOAuthUrl;
  };

  const handleGitHubLogin = () => {
    // You'll need to replace these with your actual GitHub OAuth app credentials
    const clientId = 'Ov23li9GwFmcr0kqkdvG'; // Replace with your GitHub Client ID
    const redirectUri = encodeURIComponent('http://localhost:5173');
    const scope = encodeURIComponent('user:email');
    const state = Math.random().toString(36).substring(7); // Random state for security
    
    // Store the state in sessionStorage for verification
    sessionStorage.setItem('github_oauth_state', state);
    
    const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    
    window.location.href = githubOAuthUrl;
  };

  return (
    <div className="space-y-4 mb-8" data-tutorial="oauth-buttons">
      <button 
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-700 py-3 px-4 rounded-lg transition-all"
      >
        <FcGoogle className="text-xl" />
        <span>Continue with Google</span>
      </button>
      <button 
        onClick={handleGitHubLogin}
        className="w-full flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-700 py-3 px-4 rounded-lg transition-all"
      >
        <FaGithub className="text-xl" />
        <span>Continue with GitHub</span>
      </button>
    </div>
  );
} 