import { Link } from 'react-router-dom';

export default function AuthFooter({ isLogin = true }) {
  return (
    <>
      <div className="mt-6 text-center text-sm">
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="hover:underline font-medium" style={{ color: 'var(--dynamic-secondary-color)' }}>
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link to="/login" className="hover:underline font-medium" style={{ color: 'var(--dynamic-secondary-color)' }}>
              Sign in
            </Link>
          </p>
        )}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-500">
          By continuing, you agree to our <br />
          <a href="#" className="hover:underline" style={{ color: 'var(--dynamic-secondary-color)' }}>Terms of Service</a> and{' '}
          <a href="#" className="hover:underline" style={{ color: 'var(--dynamic-secondary-color)' }}>Privacy Policy</a>
        </p>
      </div>
    </>
  );
} 