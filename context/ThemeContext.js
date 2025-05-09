import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

const THEME_STORAGE_KEY = '@theme_preference';

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

    // Load saved theme preference
    useEffect(() => {
        const loadThemePreference = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme !== null) {
                    setIsDarkMode(savedTheme === 'dark');
                }
            } catch (error) {
                console.error('Error loading theme preference:', error);
            }
        };
        loadThemePreference();
    }, []);

    const toggleTheme = useCallback(async () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    }, [isDarkMode]);

    const theme = {
        isDarkMode,
        toggleTheme,
        colors: isDarkMode ? {
            // Dark theme colors
            background: '#121212',
            surface: '#1E1E1E',
            primary: '#BB86FC',
            secondary: '#03DAC6',
            text: '#FFFFFF',
            textSecondary: '#B3B3B3',
            border: '#2C2C2C',
            error: '#CF6679',
            success: '#03DAC6',
            card: '#1E1E1E',
            buttonBackground: '#BB86FC',
            buttonText: '#000000',
            inputBackground: '#2C2C2C',
            placeholder: '#666666',
        } : {
            // Light theme colors
            background: '#FFFFFF',
            surface: '#F8F9FA',
            primary: '#000000',
            secondary: '#666666',
            text: '#000000',
            textSecondary: '#666666',
            border: '#E0E0E0',
            error: '#B00020',
            success: '#4CAF50',
            card: '#FFFFFF',
            buttonBackground: '#000000',
            buttonText: '#FFFFFF',
            inputBackground: '#F5F5F5',
            placeholder: '#999999',
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);