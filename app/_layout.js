import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../context/ThemeContext';
import AppProvider from '../store/AppProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppProvider>
        <ThemeProvider>
        <Stack screenOptions={{
          headerShown: false,
          headerShadowVisible: false,
          animation: 'slide_from_right',
        }}>
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="ProductInfo" 
            options={{
              headerShown: false,
            }} 
          />
          <Stack.Screen name="Orders" />
          <Stack.Screen name="ViewAllOrders" />
          <Stack.Screen name="SignUpScreen" />
          <Stack.Screen name="Login" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="help" />

        </Stack>
        </ThemeProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
