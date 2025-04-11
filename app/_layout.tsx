import { Slot } from 'expo-router';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';

export default function RootLayout() {
  return (
    <AuthProvider>
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  </AuthProvider>
  );
}

