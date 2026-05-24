import { createContext, useCallback, useContext } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const applyTheme = useCallback((theme) => {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-light', theme.accent);
    root.style.setProperty('--color-bg-tinted', theme.bg);
  }, []);

  const resetTheme = useCallback(() => {
    const root = document.documentElement;
    root.style.removeProperty('--color-primary');
    root.style.removeProperty('--color-primary-light');
    root.style.removeProperty('--color-bg-tinted');
  }, []);

  return (
    <ThemeContext.Provider value={{ applyTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
