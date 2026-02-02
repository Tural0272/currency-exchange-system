import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { createApiClient, getNormalizedErrorMessage } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export default function WalletScreen() {
  const { token, balances, refreshBalances } = useAuth();
  const [fundAmount, setFundAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadBalances();
    }, [token])
  );

  const loadBalances = async () => {
    try {
      setError(null);
      await refreshBalances();
    } catch (err) {
      setError(getNormalizedErrorMessage(err));
    } finally {
      setRefreshing(false);
    }
  };

  const handleFund = async () => {
    if (!fundAmount.trim()) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid positive amount');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const api = createApiClient(token);
      await api.post('/wallet/fund', { amountPLN: amount });
      await refreshBalances();
      setFundAmount('');
      Alert.alert('Success', `Funded ${amount.toFixed(2)} PLN`);
    } catch (err) {
      Alert.alert('Error', getNormalizedErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBalances();
  };

  const plnBalance = balances.find(b => b.currencyCode === 'PLN')?.balance || 0;
  const otherBalances = balances.filter(b => b.currencyCode !== 'PLN');

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PLN Balance</Text>
        <Text style={styles.plnBalance}>{plnBalance.toFixed(2)} PLN</Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadBalances}>
            <Text style={styles.errorLink}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fund Wallet</Text>
        <Text style={styles.sectionSubtitle}>Add PLN to your wallet (simulated)</Text>
        <TextInput
          style={styles.input}
          placeholder="Amount in PLN"
          value={fundAmount}
          onChangeText={setFundAmount}
          keyboardType="decimal-pad"
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleFund}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Fund Wallet</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Balances</Text>
        {balances.map(wallet => (
          <View key={wallet.currencyCode} style={styles.balanceItem}>
            <View>
              <Text style={styles.currencyCode}>{wallet.currencyCode}</Text>
            </View>
            <Text style={styles.balance}>
              {wallet.balance.toFixed(2)} {wallet.currencyCode}
            </Text>
          </View>
        ))}
        {balances.length === 0 && (
          <Text style={styles.emptyText}>No balances found</Text>
        )}
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
    marginBottom: 4,
    color: '#000',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  balance: {
    fontSize: 18,
    color: '#666',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    paddingVertical: 12,
    textAlign: 'center',
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
});
