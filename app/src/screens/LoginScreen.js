import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signInAsGuest } = useAuth();
  const [pseudo, setPseudo] = useState('');

  const handleContinue = () => {
    const trimmed = pseudo.trim();
    if (!trimmed) {
      Alert.alert('Pseudo requis', 'Choisis un pseudo pour commencer.');
      return;
    }
    signInAsGuest(trimmed);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <Text style={styles.subtitle}>Choisis un pseudo pour suivre ta progression.</Text>
      <TextInput
        style={styles.input}
        placeholder="Ton pseudo"
        value={pseudo}
        onChangeText={setPseudo}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Commencer à réviser</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#555', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: { backgroundColor: '#4f46e5', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
