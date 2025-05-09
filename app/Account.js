import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { removeUser } from '../assets/functions';
import { useTheme } from '../context/ThemeContext';
import AppContext from '../store/AppContext';

const Account = () => {
  const router = useRouter();
  const { user, setUser } = useContext(AppContext);
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    header: {
      alignItems: 'center',
      paddingTop: 60,
      paddingBottom: 30,
      backgroundColor: colors.surface,
    },
    profileImageContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 2,
      borderColor: colors.border,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emailText: {
      fontSize: 18,
      color: colors.text,
    },
    optionsContainer: {
      paddingVertical: 16,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: 12,
      marginHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
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
      color: colors.text,
    },
    logoutOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 12,
      marginTop: 'auto',
      marginHorizontal: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.error,
    },
    logoutText: {
      flex: 1,
      marginLeft: 16,
      fontSize: 16,
      fontWeight: '600',
      color: colors.error,
    },
    themeToggle: {
      position: 'absolute',
      top: Platform.OS === 'android' ? 45 : 5,
      right: 16,
      padding: 8,
      zIndex: 1,
    },
    authButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 12,
      alignItems: 'center',
    },
    signUpButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    authButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    menuSection: {
      paddingVertical: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: 12,
      marginHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    menuItemText: {
      flex: 1,
      marginLeft: 16,
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      marginHorizontal: 16,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 12,
      marginTop: 'auto',
      marginHorizontal: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.error,
    },
  });

  const handleSignUp = () => {
    router.push('/SignUpScreen');
  };

  const handleLogin = () => {
    router.push('/Login');
  };

  const handleLogout = async () => {
    try {
      await removeUser();
      setUser(null);
      router.push('/Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Icon name="person" size={60} color={colors.text} />
          </View>
          <Text style={styles.welcomeText}>
            Welcome Back!{'\n'}
            <Text style={styles.emailText}>{user ? user.email : 'Guest'}</Text>
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {!user ? (
            <>
              <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
                <Text style={styles.authButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.authButton, styles.signUpButton]} onPress={handleSignUp}>
                <Text style={styles.authButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Account</Text>
              <View style={styles.menuSection}>
                <TouchableOpacity
                  style={[styles.menuItem, { backgroundColor: colors.surface }]}
                  onPress={() => router.push('/Orders')}
                >
                  <Icon name="shopping-bag" size={24} color={colors.text} />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>My Orders</Text>
                  <Icon name="chevron-right" size={24} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuItem, { backgroundColor: colors.surface }]}
                  onPress={() => router.push('/settings')}
                >
                  <Icon name="settings" size={24} color={colors.text} />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>Settings</Text>
                  <Icon name="chevron-right" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Support</Text>
              <View style={styles.menuSection}>
                <TouchableOpacity
                  style={[styles.menuItem, { backgroundColor: colors.surface }]}
                  onPress={() => router.push('/help')}
                >
                  <Icon name="help" size={24} color={colors.text} />
                  <Text style={[styles.menuItemText, { color: colors.text }]}>Help & Support</Text>
                  <Icon name="chevron-right" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.menuItem, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Icon name="logout" size={24} color={colors.error} />
                <Text style={[styles.menuItemText, { color: colors.error }]}>Logout</Text>
                <Icon name="chevron-right" size={24} color={colors.error} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Account;