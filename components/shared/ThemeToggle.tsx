'use client';

import { useTheme } from '@/lib/hooks/useTheme';
import { DarkMode as MoonIcon, LightMode as SunIcon } from '@mui/icons-material';

export const ThemeToggle = () => {
  const { theme, setTheme, mounted } = useTheme();
  
  // Don't render anything during SSR to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-100 focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
};