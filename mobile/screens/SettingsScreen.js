import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      setLoggingOut(true);
      logout()
        .catch(() => {})
        .finally(() => setLoggingOut(false));
      return;
    }

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  const handleRegisterNewAccount = () => {
    if (Platform.OS === 'web') {
      setLoggingOut(true);
      logout()
        .catch(() => {})
        .finally(() => setLoggingOut(false));
      return;
    }

    Alert.alert(
      'Register new account',
      'You will be logged out. On the next screen, tap "Create new account" to register.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => logout() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ConnectionSettings')}
        >
          <Text style={styles.menuItemText}>Connection Settings</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={styles.menuItemText}>About</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.registerNewItem]}
          onPress={handleRegisterNewAccount}
          disabled={loggingOut}
        >
          <Text style={styles.registerNewText}>Register new account</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <Text style={[styles.menuItemText, styles.logoutText]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ===== STYLES ===== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuItemText: {
    fontSize: 16,
    color: '#000000',
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#999999',
  },
  registerNewItem: {
    borderBottomWidth: 0,
  },
  registerNewText: {
    fontSize: 16,
    color: '#007AFF',
  },
  logoutItem: {
    borderBottomWidth: 0,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '500',
    textAlign: 'center',
  },
});
