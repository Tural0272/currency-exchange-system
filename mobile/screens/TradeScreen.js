import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { createApiClient, getNormalizedErrorMessage } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export default function TradeScreen({ navigation }) {
  const { token, balances, refreshBalances } = useAuth();
  const [type, setType] = useState('BUY');
  const [code, setCode] = useState('');
  const [codeName, setCodeName] = useState('');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingRate, setLoadingRate] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadCurrencies();
      refreshBalances();
    }, [])
  );

  useEffect(() => {
    if (code) {
      loadRate();
    }
  }, [code, type]);

  const loadCurrencies = async () => {
    try {
      setError(null);
      const api = createApiClient(token);
      let list = [];
      try {
        const res = await api.get('/rates/available');
        list = (res.data.currencies || []).map(c => ({ code: c.code, currency: c.currency }));
      } catch (_) {
        const res = await api.get('/rates/current');
        const rates = res.data.rates || [];
        list = rates.map(r => ({ code: r.code, currency: r.currency }));
      }
      setCurrencies(list);
      if (list.length > 0 && !code) {
        setCode(list[0].code);
        setCodeName(list[0].currency);
      }
    } catch (err) {
      setError(getNormalizedErrorMessage(err));
    } finally {
      setLoadingCurrencies(false);
    }
  };

  const loadRate = async () => {
    if (!code.trim()) return;
    setLoadingRate(true);
    try {
      setError(null);
      const api = createApiClient(token);
      const response = await api.get(`/rates/buy-sell?code=${code}`);
      setRate(response.data);
    } catch (err) {
      setRate(null);
      setError(getNormalizedErrorMessage(err));
    } finally {
      setLoadingRate(false);
    }
  };

  const handleTrade = async () => {
    if (!code.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please select currency and enter amount');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid positive amount');
      return;
    }

    setLoading(true);
    try {
      const api = createApiClient(token);
      const endpoint = type === 'BUY' ? '/trade/buy' : '/trade/sell';
      const response = await api.post(endpoint, {
        code: code.toUpperCase(),
        amountForeign: amountNum,
      });
      await refreshBalances();
      setAmount('');
      Alert.alert(
        'Success',
        `${type === 'BUY' ? 'Bought' : 'Sold'} ${amountNum} ${code.toUpperCase()} at rate ${response.data.rate.toFixed(4)}`
      );
    } catch (err) {
      Alert.alert('Transaction Failed', getNormalizedErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const selectCurrency = (currency) => {
    setCode(currency.code);
    setCodeName(currency.currency);
    setShowCurrencyPicker(false);
  };

  const currentRate = type === 'BUY' ? rate?.ask : rate?.bid;
  const plnAmount = currentRate && amount ? (parseFloat(amount) * currentRate).toFixed(2) : null;
  const plnBalance = balances.find(b => b.currencyCode === 'PLN')?.balance ?? 0;
  const selectedBalance = code ? (balances.find(b => b.currencyCode === code)?.balance ?? 0) : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceSummary}>
        <Text style={styles.balanceSummaryTitle}>Your balances</Text>
        <View style={styles.balanceSummaryRow}>
          <Text style={styles.balanceSummaryLabel}>PLN</Text>
          <Text style={styles.balanceSummaryValue}>{plnBalance.toFixed(2)} PLN</Text>
        </View>
        {code ? (
          <View style={styles.balanceSummaryRow}>
            <Text style={styles.balanceSummaryLabel}>{code}</Text>
            <Text style={styles.balanceSummaryValue}>{selectedBalance.toFixed(2)} {code}</Text>
          </View>
        ) : null}
      </View>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => code ? loadRate() : loadCurrencies()}>
            <Text style={styles.errorLink}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction Type</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'BUY' && styles.typeButtonActive]}
            onPress={() => setType('BUY')}
          >
            <Text style={[styles.typeButtonText, type === 'BUY' && styles.typeButtonTextActive]}>
              Buy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'SELL' && styles.typeButtonActive]}
            onPress={() => setType('SELL')}
          >
            <Text style={[styles.typeButtonText, type === 'SELL' && styles.typeButtonTextActive]}>
              Sell
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currency</Text>
        <TouchableOpacity
          style={styles.currencyButton}
          onPress={() => setShowCurrencyPicker(true)}
        >
          <View style={styles.currencyButtonContent}>
            <View>
              <Text style={styles.currencyCode}>{code || 'Select Currency'}</Text>
              {codeName && <Text style={styles.currencyName}>{codeName}</Text>}
            </View>
            <Text style={styles.currencyArrow}>▼</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadRate}
          disabled={loadingRate || !code}
        >
          {loadingRate ? (
            <ActivityIndicator color="#007AFF" />
          ) : (
            <Text style={styles.refreshButtonText}>Refresh Rate</Text>
          )}
        </TouchableOpacity>
      </View>

      {rate && (
        <View style={styles.rateCard}>
          <Text style={styles.rateLabel}>
            {type === 'BUY' ? 'Buy Rate (Ask)' : 'Sell Rate (Bid)'}
          </Text>
          <Text style={styles.rateValue}>
            {type === 'BUY' ? rate.ask.toFixed(4) : rate.bid.toFixed(4)} PLN
          </Text>
          <Text style={styles.rateDate}>Date: {rate.effectiveDate}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Amount ({code.toUpperCase() || 'CURRENCY'})
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
        {plnAmount && (
          <Text style={styles.conversionText}>
            ≈ {plnAmount} PLN
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, (loading || !rate || !code) && styles.buttonDisabled]}
        onPress={handleTrade}
        disabled={loading || !rate || !code}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {type === 'BUY' ? 'Buy' : 'Sell'} {code.toUpperCase() || 'Currency'}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {type === 'BUY'
            ? 'You will spend PLN to buy foreign currency.'
            : 'You will receive PLN by selling foreign currency.'}
        </Text>
      </View>

      <Modal
        visible={showCurrencyPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCurrencyPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            {loadingCurrencies ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            ) : (
              <FlatList
                data={currencies}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.currencyItem}
                    onPress={() => selectCurrency(item)}
                  >
                    <View>
                      <Text style={styles.currencyItemCode}>{item.code}</Text>
                      <Text style={styles.currencyItemName}>{item.currency}</Text>
                    </View>
                    {code === item.code && <Text style={styles.currencyItemSelected}>✓</Text>}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  balanceSummary: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  balanceSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  balanceSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  balanceSummaryLabel: {
    fontSize: 14,
    color: '#000',
  },
  balanceSummaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
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
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  currencyButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  currencyButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  currencyName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  currencyArrow: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  refreshButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rateCard: {
    backgroundColor: '#007AFF',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  rateValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  rateDate: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  conversionText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    margin: 16,
    marginTop: 0,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#fff3cd',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  infoText: {
    fontSize: 14,
    color: '#856404',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
  },
  modalLoading: {
    padding: 40,
    alignItems: 'center',
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  currencyItemCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  currencyItemName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  currencyItemSelected: {
    fontSize: 20,
    color: '#007AFF',
  },
});
