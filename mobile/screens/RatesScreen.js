import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { createApiClient, getNormalizedErrorMessage } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function RatesScreen() {
  const { token } = useAuth();
  const [rates, setRates] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedRate, setSelectedRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      setError(null);
      const api = createApiClient(token);
      const response = await api.get('/rates/current');
      setRates(response.data.rates || []);
    } catch (err) {
      setError(getNormalizedErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadSingleRate = async (code) => {
    try {
      const api = createApiClient(token);
      const response = await api.get(`/rates/current?code=${code}`);
      setSelectedRate(response.data);
    } catch (err) {
      setSelectedRate(null);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRates();
  };

  const handleSearch = () => {
    if (searchCode.trim()) {
      setSelectedCode(searchCode.toUpperCase());
      loadSingleRate(searchCode.toUpperCase());
    }
  };

  const filteredRates = searchCode.trim() 
    ? rates.filter(r => 
        r.code.toUpperCase().includes(searchCode.toUpperCase().trim()) || 
        r.currency.toLowerCase().includes(searchCode.toLowerCase().trim())
      )
    : rates;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadRates}>
            <Text style={styles.errorLink}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search currency (e.g., USD, EUR)"
          value={searchCode}
          onChangeText={(text) => {
            setSearchCode(text);
            // Auto-search as user types
            if (text.trim()) {
              const upperText = text.toUpperCase().trim();
              const found = rates.find(r => 
                r.code.toUpperCase() === upperText || 
                r.code.toUpperCase().includes(upperText) ||
                r.currency.toLowerCase().includes(text.toLowerCase().trim())
              );
              if (found) {
                setSelectedCode(found.code);
                loadSingleRate(found.code);
              }
            }
          }}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {selectedRate && (
        <View style={styles.selectedRateCard}>
          <Text style={styles.selectedCode}>{selectedRate.code}</Text>
          <Text style={styles.selectedRateValue}>{(selectedRate.mid || selectedRate.rate || 0).toFixed(4)} PLN</Text>
          <Text style={styles.selectedDate}>Date: {selectedRate.effectiveDate}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Exchange Rates (Table A)</Text>
        <Text style={styles.sourceNote}>Real-time rates from NBP (National Bank of Poland)</Text>
        {filteredRates.map(rate => (
          <TouchableOpacity
            key={rate.code}
            style={styles.rateItem}
            onPress={() => {
              setSelectedCode(rate.code);
              loadSingleRate(rate.code);
            }}
          >
            <View>
              <Text style={styles.currencyCode}>{rate.code}</Text>
              <Text style={styles.currencyName}>{rate.currency}</Text>
            </View>
            <Text style={styles.rateValue}>{rate.mid.toFixed(4)} PLN</Text>
          </TouchableOpacity>
        ))}
        {filteredRates.length === 0 && (
          <Text style={styles.emptyText}>No rates found</Text>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  selectedRateCard: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  selectedRateValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  selectedDate: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
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
    marginBottom: 4,
    color: '#000',
  },
  sourceNote: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  rateItem: {
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
  currencyName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
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
