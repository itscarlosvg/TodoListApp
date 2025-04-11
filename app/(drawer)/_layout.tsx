import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';

export default function DrawerLayout() {
  const router = useRouter();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.replace('/Login');
  };

  return (
    <Drawer
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: theme === 'dark' ? '#121212' : '#fff',
        },
        headerTintColor: theme === 'dark' ? '#fff' : '#333',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
        drawerActiveTintColor: theme === 'dark' ? '#fff' : '#007BFF',
        drawerInactiveTintColor: theme === 'dark' ? '#aaa' : '#555',
        drawerStyle: {
          backgroundColor: theme === 'dark' ? '#121212' : '#fff',
        },
        drawerLabelStyle: { fontSize: 16 },
        drawerIcon: ({ color, size }) => {
          if (route.name === 'home') {
            return <Ionicons name="home-outline" size={size} color={color} />;
          }
          if (route.name === 'todo') {
            return <Ionicons name="checkmark-done-outline" size={size} color={color} />;
          }
          return null;
        },
        title:
          route.name === 'home'
            ? 'Inicio'
            : route.name === 'todo'
            ? 'To-Do List'
            : route.name,
      })}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          {}
          <DrawerItemList {...props} />

          {}
          <View style={{ marginVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }} />

          {}
          <DrawerItem
            label={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            onPress={toggleTheme}
            icon={({ color, size }) => (
              <Ionicons
                name={theme === 'dark' ? 'sunny' : 'moon'}
                size={size}
                color={theme === 'dark' ? '#fff' : '#000'}
              />
            )}
            labelStyle={{ 
                fontWeight: 'bold',
                color: theme === 'dark' ? '#fff' : '#000',
             }}
          />

          {/* Botón de logout */}
          <DrawerItem
            label="Cerrar sesión"
            onPress={handleLogout}
            icon={({ color, size }) => (
              <Ionicons name="exit-outline" size={size} color="#FF3B30" />
            )}
            labelStyle={{ color: '#FF3B30', fontWeight: 'bold' }}
          />
        </DrawerContentScrollView>
      )}
    />
  );
}
