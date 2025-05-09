import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [orderUpdates, setOrderUpdates] = React.useState(true);
  const [promotions, setPromotions] = React.useState(false);
  const [currency, setCurrency] = React.useState('₪');
  const [language, setLanguage] = React.useState('English');

  const handleLanguageChange = () => {
    Alert.alert('Change Language', 'This feature will be available soon.');
  };

  const handleCurrencyChange = () => {
    Alert.alert('Change Currency', 'This feature will be available soon.');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'This feature will be available soon.');
  };

  const handleTerms = () => {
    Alert.alert('Terms of Service', 'This feature will be available soon.');
  };

  const handleAbout = () => {
    Alert.alert('About', 'PlayStation Store App\nVersion 1.0.0');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Appearance Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name={isDarkMode ? "dark-mode" : "light-mode"} size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="notifications" size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="local-shipping" size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>Order Updates</Text>
            </View>
            <Switch
              value={orderUpdates}
              onValueChange={setOrderUpdates}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="local-offer" size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>Promotions & Offers</Text>
            </View>
            <Switch
              value={promotions}
              onValueChange={setPromotions}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="language" size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>Language</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={[styles.settingValueText, { color: colors.textSecondary }]}>{language}</Text>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleCurrencyChange}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="attach-money" size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>Currency</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={[styles.settingValueText, { color: colors.textSecondary }]}>{currency}</Text>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacyPolicy}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="privacy-tip" size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>Privacy Policy</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleTerms}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="description" size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>Terms of Service</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="info" size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>About App</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingBottom: 24,
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValueText: {
    fontSize: 16,
    marginRight: 4,
  },
});

export default Settings;