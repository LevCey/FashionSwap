import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const ListItemScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Dress',
    size: '',
    dailyPrice: '',
    weeklyPrice: '',
    description: '',
    condition: 'Like New',
  });

  const categories = ['Dress', 'Jacket', 'Pants', 'Shoes', 'Accessories'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.brand || !formData.size || !formData.dailyPrice) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    // In real app, this would call smart contract
    Alert.alert(
      'Success!',
      'Your item has been listed on FashionSwap. Buyers can now rent it!',
      [{ text: 'OK' }]
    );

    // Reset form
    setFormData({
      name: '',
      brand: '',
      category: 'Dress',
      size: '',
      dailyPrice: '',
      weeklyPrice: '',
      description: '',
      condition: 'Like New',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>List Your Item</Text>
        <Text style={styles.subtitle}>Share your fashion, earn money, save the planet</Text>
      </View>

      <View style={styles.form}>
        {/* Item Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Summer Floral Dress"
            placeholderTextColor="#666"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        {/* Brand */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Brand *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Zara, H&M, Gucci"
            placeholderTextColor="#666"
            value={formData.brand}
            onChangeText={(text) => setFormData({ ...formData, brand: text })}
          />
        </View>

        {/* Category */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  formData.category === cat && styles.chipActive,
                ]}
                onPress={() => setFormData({ ...formData, category: cat })}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.category === cat && styles.chipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Size */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Size *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. M, L, 32, One Size"
            placeholderTextColor="#666"
            value={formData.size}
            onChangeText={(text) => setFormData({ ...formData, size: text })}
          />
        </View>

        {/* Condition */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Condition *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {conditions.map((cond) => (
              <TouchableOpacity
                key={cond}
                style={[
                  styles.chip,
                  formData.condition === cond && styles.chipActive,
                ]}
                onPress={() => setFormData({ ...formData, condition: cond })}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.condition === cond && styles.chipTextActive,
                  ]}
                >
                  {cond}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Pricing */}
        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Daily Price ($) *</Text>
            <TextInput
              style={styles.input}
              placeholder="8"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={formData.dailyPrice}
              onChangeText={(text) => setFormData({ ...formData, dailyPrice: text })}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Weekly Price ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="45"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={formData.weeklyPrice}
              onChangeText={(text) => setFormData({ ...formData, weeklyPrice: text })}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your item, its features, and condition..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Listing Benefits</Text>
          <Text style={styles.infoText}>• Earn money from unused clothes</Text>
          <Text style={styles.infoText}>• Help reduce fashion waste</Text>
          <Text style={styles.infoText}>• Payments via Chipi Pay (ultra-low fees)</Text>
          <Text style={styles.infoText}>• Escrow protection for your items</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>List Item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  form: {
    padding: 24,
    paddingTop: 0,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  chipActive: {
    backgroundColor: '#4ADE80',
  },
  chipText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#000',
  },
  infoBox: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4ADE80',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ADE80',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  submitButton: {
    backgroundColor: '#4ADE80',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ListItemScreen;
