import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Currency Exchange System</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Author Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>Tural Alakbarov</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Index Number:</Text>
          <Text style={styles.infoValue}>39251</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>tural0272@gmail.com</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Description</Text>
        <Text style={styles.description}>
          This application provides a complete currency exchange system with mobile app,
          REST API backend, and SQLite database. Users can register, login, view exchange
          rates from NBP (National Bank of Poland), buy and sell currencies, view transaction
          history, and manage their wallet balances.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technology Stack</Text>
        <Text style={styles.techItem}>• Mobile: React Native with Expo</Text>
        <Text style={styles.techItem}>• Backend: Node.js with Express</Text>
        <Text style={styles.techItem}>• Database: SQLite</Text>
        <Text style={styles.techItem}>• API: NBP Exchange Rates API</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  version: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  techItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});
