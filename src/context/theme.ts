import React from 'react';

export type Theme = 'light' | 'dark';

export type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);
