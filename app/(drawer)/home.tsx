import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../src/context/ThemeContext"; // Importamos tu context
import { Check } from "@/lib/icons/Check";
import { Button } from "@/components/ui/button";

export default function HomeScreen() {
  const { theme } = useTheme(); // Accedemos al tema actual

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#121212" : "#f9f9f9" }, // Fondo dinámico
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: theme === "dark" ? "#fff" : "#333" }, // Color de texto dinámico
        ]}
      >
        Bienvenido a Home!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
