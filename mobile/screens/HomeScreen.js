import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { createApiClient, getApiBaseUrl, getNormalizedErrorMessage, NETWORK_ERROR_MESSAGE } from '../utils/api';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const { token, balances, refreshBalances } = useAuth();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [apiBaseUrl, setApiBaseUrl] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [token])
  );

  const loadData = async () => {
    try {
      setError(null);
      const baseUrl = await getApiBaseUrl();
      setApiBaseUrl(baseUrl);
      await refreshBalances();
      const api = createApiClient(token);
      const ratesRes = await api.get('/rates/current');
      setRates(ratesRes.data.rates || []);
    } catch (err) {
      const errorMsg = getNormalizedErrorMessage(err);
      setError(errorMsg === NETWORK_ERROR_MESSAGE ? errorMsg : `${err.response?.status || 'Error'}: ${errorMsg}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const plnBalance = balances.find(b => b.currencyCode === 'PLN')?.balance || 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet Overview</Text>
        <Text style={styles.plnBalance}>{plnBalance.toFixed(2)} PLN</Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.errorLink}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ConnectionSettings')}>
            <Text style={styles.errorLink}>Connection Settings</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Balances</Text>
        {balances.filter(b => b.currencyCode !== 'PLN' && b.balance > 0).map(wallet => (
          <View key={wallet.currencyCode} style={styles.balanceItem}>
            <Text style={styles.currencyCode}>{wallet.currencyCode}</Text>
            <Text style={styles.balance}>{wallet.balance.toFixed(2)}</Text>
          </View>
        ))}
        {balances.filter(b => b.currencyCode !== 'PLN' && b.balance > 0).length === 0 && (
          <Text style={styles.emptyText}>No foreign currency balances</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Trade')}
        >
          <Text style={styles.actionButtonText}>Buy/Sell Currency</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Wallet')}
        >
          <Text style={styles.actionButtonText}>Fund Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonLast]}
          onPress={() => navigation.navigate('Rates')}
        >
          <Text style={styles.actionButtonText}>View Rates</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  plnBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  balance: {
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    paddingVertical: 12,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  actionButtonLast: {
    marginBottom: 0,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    marginBottom: 8,
  },
  errorLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    marginBottom: 8,
  },
});
