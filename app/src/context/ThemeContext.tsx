import { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

type Colors = {
  background: string;
  text: string;
  selected: string;
  today: string;
  arrow: string;
  disabled: string;
};

interface ThemeContextProps {
  theme: Theme;
  colors: Colors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  colors: {
    background: "#ffffff",
    text: "#333333",
    selected: "#6366F1",
    today: "#06B6D4",
    arrow: "#666666",
    disabled: "#cccccc",
  },
  toggleTheme: () => {},
});

const lightColors: Colors = {
  background: "#ffffff",
  text: "#333333",
  selected: "#6366F1",
  today: "#06B6D4",
  arrow: "#666666",
  disabled: "#cccccc",
};

const darkColors: Colors = {
  background: "#1e1e1e",
  text: "#eeeeee",
  selected: "#4F46E5",
  today: "#10B981",
  arrow: "#cccccc",
  disabled: "#555555",
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>("light");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        if (storedTheme === "light" || storedTheme === "dark") {
          setTheme(storedTheme);
        } else if (systemColorScheme) {
          setTheme(systemColorScheme === "dark" ? "dark" : "light");
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme: Theme = theme === "dark" ? "light" : "dark";
    try {
      await AsyncStorage.setItem("theme", newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  if (loading) return null;

  const colors = theme === "dark" ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
