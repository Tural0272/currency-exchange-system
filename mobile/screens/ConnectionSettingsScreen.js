import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getApiBaseUrl, setApiBaseUrl } from '../utils/api';

export default function ConnectionSettingsScreen() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    loadCurrentUrl();
  }, []);

  const loadCurrentUrl = async () => {
    const currentUrl = await getApiBaseUrl();
    setUrl(currentUrl);
  };

  const handleSave = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }

    // Basic URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      Alert.alert('Error', 'URL must start with http:// or https://');
      return;
    }

    await setApiBaseUrl(url.trim());
    Alert.alert('Success', 'Connection settings saved. Restart the app for changes to take effect.');
  };

  const handleReset = async () => {
    await setApiBaseUrl('');
    await loadCurrentUrl();
    Alert.alert('Success', 'Connection settings reset to default');
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Base URL</Text>
        <Text style={styles.sectionSubtitle}>
          Enter the backend server URL. Default is auto-detected from your network.
        </Text>
        <Text style={styles.currentUrlLabel}>Current URL:</Text>
        <Text style={styles.currentUrl}>{url || 'Auto-detected'}</Text>
        <TextInput
          style={styles.input}
          placeholder="http://192.168.1.100:3010"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.hint}>
          Examples:{'\n'}
          • http://192.168.1.100:3010 (your PC's IP){'\n'}
          • http://10.0.2.2:3010 (Android emulator){'\n'}
          • http://localhost:3010 (web/local)
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset to Default</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
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
  currentUrlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    marginTop: 8,
  },
  currentUrl: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
  },
  buttonContainer: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
