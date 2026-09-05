export default function UserDashboard({ onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col">
      <div className="flex justify-end p-4">
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <p className="text-white text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl">
          This is a demo page for user — showing you have the role &quot;user&quot;
        </p>
      </div>
    </div>
  );
}
