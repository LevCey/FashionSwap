import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyRentalsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Active Rentals</Text>
      <Text style={styles.subtitle}>Track your rentals and returns</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
  },
});

export default MyRentalsScreen;
