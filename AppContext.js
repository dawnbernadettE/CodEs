import React, { createContext, useState, useCallback } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [username, setUsername] = useState('Alex');
  const [darkMode, setDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const saveSettings = useCallback((newUsername, newDarkMode) => {
    if (!newUsername.trim()) {
      setErrorMessage('Username cannot be empty.');
      return;
    }

    setErrorMessage('');
    setIsSaving(true);

    setTimeout(() => {
      setUsername(newUsername.trim());
      setDarkMode(newDarkMode);
      setIsSaving(false);
    }, 1000);
  }, []);

  const value = {
    username,
    darkMode,
    isSaving,
    errorMessage,
    saveSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
