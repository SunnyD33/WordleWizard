import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';
type ThemeMode = 'light' | 'dark' | 'auto';

const THEME_STORAGE_KEY = 'themeMode';

function getSavedTheme(): ThemeMode {
  try {
    return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) ?? 'auto';
  } catch {
    return 'auto';
  }
}

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * Also reads the user's saved themeMode from localStorage so Settings changes take effect.
 */
export function useColorScheme(): ColorScheme {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [savedTheme, setSavedTheme] = useState<ThemeMode>('auto');
  const systemColorScheme = useRNColorScheme() ?? 'light';

  useEffect(() => {
    setSavedTheme(getSavedTheme());
    setHasHydrated(true);

    const handleStorageChange = () => {
      setSavedTheme(getSavedTheme());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!hasHydrated) {
    return 'light';
  }

  if (savedTheme === 'dark') return 'dark';
  if (savedTheme === 'light') return 'light';
  return systemColorScheme;
}
