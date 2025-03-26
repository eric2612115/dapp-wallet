'use client';

import { useTheme } from '@/app/theme';
import { DarkMode as MoonIcon, LightMode as SunIcon } from '@mui/icons-material';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-md p-2 text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
};