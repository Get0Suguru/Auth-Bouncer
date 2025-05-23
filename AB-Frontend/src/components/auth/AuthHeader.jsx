export default function AuthHeader({ isLogin = true }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-2">
        {isLogin ? 'Welcome Back' : 'Join the Club'}
      </h2>
      <p className="text-gray-400">
        {isLogin ? 'Secure login to your account' : 'Get started with the most secure auth system'}
      </p>
    </div>
  );
} 