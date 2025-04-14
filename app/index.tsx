// app/index.tsx
import "../global.css";
import { useEffect, useState } from "react";
import { useRouter, useRootNavigationState } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rootNavigationState?.key) return; //spera a que cargue la navegación

    // Esperamos un momentto para mostrar splash
    setTimeout(() => {
      router.replace("/Login");
    }, 500); // medio segundo para que se vea bonito
  }, [rootNavigationState?.key]);

  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      className="flex flex-shrink-0"
    >
      <ActivityIndicator size="large" color="#007BFF" />
    </View>
  );
}
