import { useState } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  function changeTheme(newTheme: 'light' | 'dark' | 'system') {
    setTheme(newTheme);
  }

  return { theme, setTheme, toggleTheme, changeTheme };
}

// Also export as named export for compatibility
export { useTheme };