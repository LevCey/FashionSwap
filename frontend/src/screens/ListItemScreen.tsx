import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ListItemScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>List Your Fashion Items</Text>
      <Text style={styles.subtitle}>Upload photos, set pricing, earn money</Text>
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

export default ListItemScreen;
