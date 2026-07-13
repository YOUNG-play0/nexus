import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ProgressProvider } from '../context/ProgressContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import LevelScreen from '../screens/LevelScreen';
import SubjectScreen from '../screens/SubjectScreen';
import ModuleScreen from '../screens/ModuleScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <ProgressProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Level" component={LevelScreen} options={{ title: '' }} />
          <Stack.Screen name="Subject" component={SubjectScreen} options={{ title: '' }} />
          <Stack.Screen name="Module" component={ModuleScreen} options={{ title: '' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProgressProvider>
  );
}
