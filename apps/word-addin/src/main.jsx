import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { FluentProvider, createLightTheme, createDarkTheme } from '@fluentui/react-components'

// Custom A11yFred Purple Theme
const a11yfredBrandRamp = {
  10: "#020104",
  20: "#10091e",
  30: "#191033",
  40: "#211646",
  50: "#2a1c5b",
  60: "#332271",
  70: "#3c2987",
  80: "#45309e",
  90: "#4f37b6",
  100: "#5a40cf",
  110: "#6951d4",
  120: "#7863d9",
  130: "#8675de",
  140: "#9587e3",
  150: "#a399e7",
  160: "#b2abec"
};

const lightTheme = {
  ...createLightTheme(a11yfredBrandRamp),
  // Force links and brand text to use darker purple shades to easily pass WCAG AA 4.5:1 on light backgrounds
  colorBrandForegroundLink: a11yfredBrandRamp[90],
  colorBrandForegroundLinkHover: a11yfredBrandRamp[100],
  colorBrandForegroundLinkPressed: a11yfredBrandRamp[80],
  colorBrandForeground1: a11yfredBrandRamp[90],
  colorBrandForeground2: a11yfredBrandRamp[100],
  // Focus ring styling to match A11yFred.app
  colorStrokeFocus2: a11yfredBrandRamp[110],
};
const darkTheme = {
  ...createDarkTheme(a11yfredBrandRamp),
  // Force links and brand text to use lighter purple shades to pass WCAG AA 4.5:1 on dark backgrounds
  colorBrandForegroundLink: a11yfredBrandRamp[150],
  colorBrandForegroundLinkHover: a11yfredBrandRamp[160],
  colorBrandForegroundLinkPressed: a11yfredBrandRamp[140],
  colorBrandForeground1: a11yfredBrandRamp[150],
  colorBrandForeground2: a11yfredBrandRamp[160],
  // Focus ring styling to match A11yFred.app
  colorStrokeFocus2: a11yfredBrandRamp[140],
  // Match A11yFred.app dark background
  colorNeutralBackground1: '#111111',
};

function ThemeWrapper({ isOfficeInitialized }) {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <FluentProvider theme={isDarkMode ? darkTheme : lightTheme} style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <App isOfficeInitialized={isOfficeInitialized} />
    </FluentProvider>
  );
}

// Wait for Office to initialize before rendering React
Office.onReady((info) => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ThemeWrapper isOfficeInitialized={info.host != null} />
    </React.StrictMode>,
  )
});
