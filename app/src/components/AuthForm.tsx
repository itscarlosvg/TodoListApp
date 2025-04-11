// AuthForm.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';

interface AuthFormProps {
    onLoginSuccess: (email: string, password: string) => void;
}
  

const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [accountCreated, setAccountCreated] = useState(false); // Añadido

  const handleAuth = () => {
    if (!email || !password || (!isLogin && !nombre)) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    if (isLogin) {
      console.log('Iniciar sesión:', { email, password });
      Alert.alert('Bienvenido', `Iniciaste sesión como ${email}`);
      onLoginSuccess(email, password);;
    } else {
      console.log('Registrarse:', { nombre, email, password });
      setAccountCreated(true); //Mostrar mensaje de cuenta creada
      setTimeout(() => setAccountCreated(false), 3000); // Ocultar mensaje después de 3s
    }
  };

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setEmail('');
    setPassword('');
    setNombre('');
    setAccountCreated(false); // Resetear mensaje si cambia de login/signup
  };

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', duration: 800 }}
        style={styles.card}
      >
        <Text style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</Text>

        <AnimatePresence>
          {!isLogin && (
            <MotiView
              key="nombre"
              from={{ opacity: 0, translateX: -100 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: 100 }}
              transition={{ type: 'timing', duration: 500 }}
              style={{ width: '100%', alignItems: 'center', marginBottom: 10 }}
            >
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
              />
            </MotiView>
          )}
        </AnimatePresence>

        <MotiView
          from={{ opacity: 0, translateX: 100 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={{ width: '100%', alignItems: 'center' }}
        >
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateX: -100 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={{ width: '100%', alignItems: 'center', marginTop: 10 }}
        >
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </MotiView>

        <TouchableOpacity
          style={styles.button}
          onPress={handleAuth}
        >
          <Text style={styles.buttonText}>
            {isLogin ? 'Entrar' : 'Crear cuenta'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleForm} style={styles.toggleButton}>
          <Text style={styles.toggleText}>
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </Text>
        </TouchableOpacity>

        {/* Mensaje de cuenta creada */}
        <AnimatePresence>
          {accountCreated && (
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'timing', duration: 500 }}
              style={styles.successMessage}
            >
              <Text style={styles.successText}>¡Cuenta creada con éxito!</Text>
            </MotiView>
          )}
        </AnimatePresence>
      </MotiView>
    </View>
  );
};

export default AuthForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dde6f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    marginTop: 20,
    width: '40%',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 8,
    fontSize: 16,
  },
  toggleButton: {
    marginTop: 15,
  },
  toggleText: {
    color: '#666',
    fontSize: 14,
  },
  successMessage: {
    marginTop: 20,
    backgroundColor: '#d4edda',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  successText: {
    color: '#155724',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
