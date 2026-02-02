import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, Modal, FlatList, Alert } from 'react-native';
import { createApiClient, getNormalizedErrorMessage } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

// Simple chart component using bars
function SimpleChart({ data }) {
  if (!data || data.length === 0) return null;

  const maxRate = Math.max(...data.map(d => d.rate || d.mid || 0));
  const minRate = Math.min(...data.map(d => d.rate || d.mid || 0));
  const range = maxRate - minRate || 1;
  const chartHeight = 150;
  const barWidth = Math.max(2, (width - 64) / data.length - 2);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Rate History</Text>
        <Text style={styles.chartSubtitle}>
          {(data[0]?.rate || data[0]?.mid || 0).toFixed(4)} - {(data[data.length - 1]?.rate || data[data.length - 1]?.mid || 0).toFixed(4)} PLN
        </Text>
        <Text style={styles.chartSubtitle}>
          Min: {minRate.toFixed(4)} | Max: {maxRate.toFixed(4)}
        </Text>
      </View>
      <View style={styles.chart}>
        <View style={styles.chartBars}>
          {data.map((item, index) => {
            const rateValue = item.rate || item.mid || 0;
            const barHeight = ((rateValue - minRate) / range) * chartHeight;
            return (
              <View
                key={index}
                style={[
                  styles.chartBar,
                  {
                    width: barWidth,
                    height: Math.max(1, barHeight),
                    marginLeft: index === 0 ? 0 : 2,
                  }
                ]}
              />
            );
          })}
        </View>
        <View style={styles.chartLabels}>
          <Text style={styles.chartLabel}>{data[0]?.effectiveDate}</Text>
          <Text style={styles.chartLabel}>{data[data.length - 1]?.effectiveDate}</Text>
        </View>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { token } = useAuth();
  const [code, setCode] = useState('');
  const [codeName, setCodeName] = useState('');
  const [days, setDays] = useState('30');
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCurrencies();
  }, []);

  useEffect(() => {
    if (code) {
      loadHistory();
    }
  }, [code]);

  const loadCurrencies = async () => {
    try {
      setError(null);
      const api = createApiClient(token);
      const response = await api.get('/rates/current');
      const rates = response.data.rates || [];
      setCurrencies(rates.map(r => ({ code: r.code, currency: r.currency })));
      if (rates.length > 0 && !code) {
        setCode(rates[0].code);
        setCodeName(rates[0].currency);
      }
    } catch (err) {
      setError(getNormalizedErrorMessage(err));
    } finally {
      setLoadingCurrencies(false);
    }
  };

  const loadHistory = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      setError(null);
      const api = createApiClient(token);
      const response = await api.get(`/rates/history?code=${code}&days=${days}`);
      setHistory(response.data);
    } catch (err) {
      setError(getNormalizedErrorMessage(err));
      setHistory(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => code ? loadHistory() : loadCurrencies()}>
            <Text style={styles.errorLink}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.searchSection}>
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
        <TextInput
          style={styles.input}
          placeholder="Days (e.g., 30)"
          value={days}
          onChangeText={setDays}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={loadHistory}
          disabled={loading || !code}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Load History</Text>
          )}
        </TouchableOpacity>
      </View>

      {history && (
        <>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{history.code}</Text>
            <Text style={styles.infoSubtitle}>{history.currency}</Text>
            <Text style={styles.infoText}>{history.rates.length} data points</Text>
          </View>

          {history.rates.length > 0 && (
            <SimpleChart data={history.rates.map(r => ({ ...r, rate: r.mid || r.rate }))} />
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historical Rates</Text>
            {history.rates.map((rate, index) => (
              <View key={index} style={styles.rateItem}>
                <View>
                  <Text style={styles.date}>{rate.effectiveDate}</Text>
                </View>
                <Text style={styles.rateValue}>{(rate.mid || rate.rate).toFixed(4)} PLN</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {!history && !loading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Select currency and click "Load History"</Text>
        </View>
      )}

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
                    onPress={() => {
                      setCode(item.code);
                      setCodeName(item.currency);
                      setShowCurrencyPicker(false);
                    }}
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
  searchSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  chart: {
    height: 150,
    marginBottom: 8,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    paddingBottom: 20,
  },
  chartBar: {
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  date: {
    fontSize: 16,
    color: '#000',
  },
  rateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
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
