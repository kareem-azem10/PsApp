import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LoginUser, removeUser } from '../../api/api';
import { useTheme } from '../../context/ThemeContext';
import AppContext from '../../store/AppContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 0,
    left: 0,
    padding: 16,
    zIndex: 1,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 80 : 40,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  signUpLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  signUpLinkText: {
    fontSize: 14,
  },
  signUpText: {
    fontWeight: '600',
  },
  // Base styles for logged in view
  loggedInContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  loggedInHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  optionsContainer: {
    padding: 16,
  },
  optionSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutOption: {
    marginTop: 20,
  }
});

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(AppContext);
  const { colors, isDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await removeUser();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const LoginFun = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const userData = {
      email: email,
      password: password,
      isLoggedIn: true
    };

    try {
      const response = await LoginUser(userData);
      console.log("response login", response);
      
      setUser({
        ...userData,
        isLoggedIn: true
      });
    } catch (error) {
      console.log("error login", error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const dynamicStyles = {
    loggedInContainer: [styles.loggedInContainer, { backgroundColor: colors.background }],
    loggedInHeader: [styles.loggedInHeader, { 
      backgroundColor: colors.surface,
      borderBottomColor: colors.border
    }],
    profileImage: [styles.profileImage, { backgroundColor: colors.primary + '20' }],
    welcomeTitle: [styles.welcomeTitle, { color: colors.text }],
    emailText: [styles.emailText, { color: colors.textSecondary }],
    option: [styles.option, { backgroundColor: colors.surface, shadowColor: colors.text }],
    optionText: [styles.optionText, { color: colors.text }],
    // logoutOption: [styles.logoutOption, { backgroundColor: colors.error + '10', shadowColor: colors.text }],
    container: [styles.container, { backgroundColor: colors.background }],
    backButton: styles.backButton,
    backIcon: [styles.backIcon, { tintColor: colors.text }],
    content: styles.content,
    header: styles.header,
    title: [styles.title, { color: colors.text }],
    subtitle: [styles.subtitle, { color: colors.textSecondary }],
    form: styles.form,
    inputContainer: [styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }],
    inputIcon: styles.inputIcon,
    input: [styles.input, { color: colors.text }],
    loginButton: [styles.loginButton, { backgroundColor: colors.primary }],
    loginButtonText: [styles.loginButtonText, { color: isDarkMode ? '#000' : '#fff' }],
    signUpLink: styles.signUpLink,
    signUpLinkText: [styles.signUpLinkText, { color: colors.textSecondary }],
    signUpText: [styles.signUpText, { color: colors.primary }]
  };

  if (user?.isLoggedIn) {
    return (
      <View style={[styles.loggedInContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.loggedInHeader, { 
          backgroundColor: colors.surface,
          borderBottomColor: colors.border
        }]}>
          <View style={[styles.profileImage, { backgroundColor: colors.primary + '20' }]}>
            <Icon name="person" size={50} color={colors.primary} />
          </View>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>Welcome Back!</Text>
          <Text style={[styles.emailText, { color: colors.textSecondary }]}>{user.email}</Text>
        </View>
        
        <ScrollView style={styles.optionsContainer}>
          <View style={styles.optionSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
            <TouchableOpacity 
              style={[styles.option, { 
                backgroundColor: colors.surface, 
                shadowColor: colors.text,
                borderColor: colors.border,
                borderWidth: 1
              }]} 
              onPress={() => router.push('/Orders')}
            >
              <Icon name="shopping-bag" size={24} color={colors.primary} />
              <Text style={[styles.optionText, { color: colors.text }]}>My Orders</Text>
              <Icon name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.option, { 
                backgroundColor: colors.surface, 
                shadowColor: colors.text,
                borderColor: colors.border,
                borderWidth: 1
              }]} 
              onPress={() => router.push('/settings')}
            >
              <Icon name="settings" size={24} color={colors.primary} />
              <Text style={[styles.optionText, { color: colors.text }]}>
                Settings
              </Text>
              <Icon name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
            <TouchableOpacity 
              style={[styles.option, { 
                backgroundColor: colors.surface, 
                shadowColor: colors.text,
                borderColor: colors.border,
                borderWidth: 1
              }]} 
              onPress={() => router.push('/help')}
            >
              <Icon name="help" size={24} color={colors.primary} />
              <Text style={[styles.optionText, { color: colors.text }]}>Help & Support</Text>
              <Icon name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[
              styles.option, 
              styles.logoutOption,
              { 
                backgroundColor: colors.error + '10',
                shadowColor: colors.text,
                borderColor: colors.error,
                borderWidth: 1
              }
            ]} 
            onPress={handleLogout}
          >
            <Icon name="logout" size={24} color={colors.error} />
            <Text style={[styles.optionText, { color: colors.error }]}>Logout</Text>
            <Icon name="chevron-right" size={24} color={colors.error} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <TouchableOpacity
        style={dynamicStyles.backButton}
        onPress={() => router.back()}
      >
        <Image
          source={require('../../photos/back.png')}
          style={dynamicStyles.backIcon}
        />
      </TouchableOpacity>

      <View style={dynamicStyles.content}>
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.title}>Welcome Back</Text>
          <Text style={dynamicStyles.subtitle}>Login to your account</Text>
        </View>

        <View style={dynamicStyles.form}>
          <View style={dynamicStyles.inputContainer}>
            <Icon name="email" size={20} color={colors.text} style={dynamicStyles.inputIcon} />
            <TextInput
              style={dynamicStyles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={dynamicStyles.inputContainer}>
            <Icon name="lock" size={20} color={colors.text} style={dynamicStyles.inputIcon} />
            <TextInput
              style={dynamicStyles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={dynamicStyles.loginButton}
            onPress={LoginFun}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={isDarkMode ? '#000' : '#fff'} />
            ) : (
              <Text style={dynamicStyles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={dynamicStyles.signUpLink}
            onPress={() => router.push('/SignUpScreen')}
          >
            <Text style={dynamicStyles.signUpLinkText}>
              Don't have an account? <Text style={dynamicStyles.signUpText}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
