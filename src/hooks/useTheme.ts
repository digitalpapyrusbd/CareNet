import { useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  function changeTheme(newTheme: 'light' | 'dark' | 'system') {
    setTheme(newTheme);
  }

  return { theme, setTheme, toggleTheme, changeTheme };
}

// Also export as default for compatibility
export default useTheme;