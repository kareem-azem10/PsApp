import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createUser } from '../api/api';
import { useTheme } from '../context/ThemeContext';

const SignUpScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors, isDarkMode } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    backButton: {
      position: 'absolute',
      top: Platform.OS === 'android' ? 40 : 0,
      left: 0,
      padding: 16,
      zIndex: 1,
    },
    content: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? 80 : 40,
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    form: {
      marginTop: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: 16,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      paddingVertical: 16,
      fontSize: 16,
      color: colors.text,
    },
    signUpButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
    },
    signUpButtonText: {
      color: isDarkMode ? '#000' : '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    loginLink: {
      marginTop: 24,
      alignItems: 'center',
    },
    loginLinkText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    loginText: {
      color: colors.primary,
      fontWeight: '600',
    },
  });

  const handleSignUp = async () => {
    if (!username || !email || !password || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!/^\d+$/.test(phoneNumber)) {
      Alert.alert('Error', 'Phone number must contain only digits');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        UserName: username,
        Email: email,
        Password: password,
        PhoneNumber: parseInt(phoneNumber)
      };
      
      const response = await createUser(userData);

      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }

      if (response.message === "User was created") {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Icon name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Icon name="person" size={20} color={colors.text} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color={colors.text} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color={colors.text} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color={colors.text} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={isDarkMode ? '#000' : '#fff'} />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => router.push('/(app)/Login')}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginText}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;