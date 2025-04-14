import { AuthProvider } from "./src/context/AuthContext";
import {
  ThemeProvider as AppThemeProvider,
  useTheme,
} from "./src/context/ThemeContext";
import "~/global.css";
import {
  ThemeProvider as NavigationThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";

const LIGHT_THEME = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  return (
    <AppThemeProvider>
      {" "}
      {/* <<-- AQUI envuelves tu app */}
      <ThemeWrapper />
    </AppThemeProvider>
  );
}

function ThemeWrapper() {
  const { theme } = useTheme(); // <-- Usas el theme de tu contexto

  const isDark = theme === "dark";

  React.useEffect(() => {
    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
    }
  }, []);

  return (
    <NavigationThemeProvider value={isDark ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </NavigationThemeProvider>
  );
}
