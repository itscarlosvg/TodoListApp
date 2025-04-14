import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useAuth } from "../app/src/context/AuthContext";
import AuthForm from "../app/src/components/AuthForm"; // <- tu componente

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = (email: string, password: string) => {
    // Aquí podrías validar credenciales reales
    login(); // Cambia estado de autenticado
    router.replace("/(drawer)/Home"); // Redirige al Home
  };

  return (
    <View style={styles.container}>
      <AuthForm onLoginSuccess={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
});
