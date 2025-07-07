import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { loadUsername, saveUsername, clearUserData } from './utils/localStorage';

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUsername = loadUsername();
    console.log(`App initialized with saved username: ${savedUsername}`);
    setUsername(savedUsername);
    setIsLoading(false);
  }, []);

  const handleLogin = (newUsername: string) => {
    console.log(`User logging in: ${newUsername}`);
    setUsername(newUsername);
    saveUsername(newUsername);
  };

  const handleLogout = () => {
    console.log(`User logging out: ${username}`);
    setUsername(null);
    clearUserData(); // This only clears the username, not the tasks
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard username={username} onLogout={handleLogout} />;
}

export default App;