import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import RatesScreen from './screens/RatesScreen';
import HistoryScreen from './screens/HistoryScreen';
import TradeScreen from './screens/TradeScreen';
import WalletScreen from './screens/WalletScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutScreen from './screens/AboutScreen';
import ConnectionSettingsScreen from './screens/ConnectionSettingsScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: { active: 'home', inactive: 'home-outline' },
  Rates: { active: 'cash', inactive: 'cash-outline' },
  History: { active: 'time', inactive: 'time-outline' },
  Trade: { active: 'swap-horizontal', inactive: 'swap-horizontal-outline' },
  Wallet: { active: 'wallet', inactive: 'wallet-outline' },
  Settings: { active: 'settings', inactive: 'settings-outline' },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarShowLabel: true,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const name = icons ? (focused ? icons.active : icons.inactive) : 'ellipse-outline';
          return <Ionicons name={name} size={size ?? 24} color={color} />;
        },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          backgroundColor: '#F2F2F7',
          marginHorizontal: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Rates" component={RatesScreen} options={{ title: 'Rates' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="Trade" component={TradeScreen} options={{ title: 'Trade' }} />
      <Tab.Screen name="Wallet" component={WalletScreen} options={{ title: 'Wallet' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: true, title: 'About' }} />
            <Stack.Screen name="ConnectionSettings" component={ConnectionSettingsScreen} options={{ headerShown: true, title: 'Connection Settings' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const isWeb = Platform.OS === 'web';

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ErrorBoundary>
          <View style={[styles.container, isWeb && styles.webContainer]}>
            <StatusBar style="auto" />
            <AppNavigator />
          </View>
        </ErrorBoundary>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webContainer: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});
