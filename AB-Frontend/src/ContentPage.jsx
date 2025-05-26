import React from "react";

export default function ContentPage({ onLogout }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome! 🎉</h1>
      <p className="mb-8">You are now logged in. This is your content page.</p>
      {onLogout && (
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
        >
          Logout
        </button>
      )}
    </div>
  );
} 