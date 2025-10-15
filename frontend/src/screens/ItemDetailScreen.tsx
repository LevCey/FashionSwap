import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FashionItem } from '../types';

const ItemDetailScreen = ({ route, navigation }: any) => {
  const { item }: { item: FashionItem } = route.params;
  const [rentalDays, setRentalDays] = useState(1);

  const calculateTotal = () => {
    if (rentalDays >= 7) {
      return item.weeklyPrice * Math.floor(rentalDays / 7) +
             item.dailyPrice * (rentalDays % 7);
    }
    return item.dailyPrice * rentalDays;
  };

  const handleRent = () => {
    const total = calculateTotal();
    Alert.alert(
      'Confirm Rental',
      `Rent "${item.name}" for ${rentalDays} day(s)?\n\nTotal: $${total}\nDeposit: $${total * 0.5} (refundable)\n\nPayment will be processed via Chipi Pay with ultra-low fees.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert(
              'Success!',
              'Rental initiated! Daily payments will be auto-charged via Chipi Pay.',
              [{ text: 'OK', onPress: () => navigation.navigate('Rentals') }]
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image */}
      <Image source={{ uri: item.image }} style={styles.image} />

      {/* Basic Info */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.brand}>{item.brand}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.category}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Size {item.size}</Text>
          </View>
          <View style={[styles.tag, styles.conditionTag]}>
            <Text style={[styles.tagText, styles.conditionText]}>{item.condition}</Text>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Daily Rate</Text>
            <Text style={styles.priceValue}>${item.dailyPrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Weekly Rate</Text>
            <Text style={styles.priceValue}>${item.weeklyPrice}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        {/* Owner Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner</Text>
          <View style={styles.ownerCard}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerAvatarText}>{item.owner.charAt(0)}</Text>
            </View>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{item.owner}</Text>
              <Text style={styles.ownerAddress}>{item.ownerAddress}</Text>
              <Text style={styles.location}>📍 {item.location}</Text>
            </View>
          </View>
        </View>

        {/* Carbon Impact */}
        <View style={styles.carbonCard}>
          <Text style={styles.carbonTitle}>🌱 Environmental Impact</Text>
          <Text style={styles.carbonText}>
            Renting this item saves approximately {item.carbonSaved}kg of CO₂ compared to buying new!
          </Text>
        </View>

        {/* Rental Duration Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rental Duration</Text>
          <View style={styles.durationSelector}>
            <TouchableOpacity
              style={styles.durationButton}
              onPress={() => setRentalDays(Math.max(1, rentalDays - 1))}
            >
              <Text style={styles.durationButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.durationDisplay}>
              <Text style={styles.durationNumber}>{rentalDays}</Text>
              <Text style={styles.durationLabel}>day{rentalDays !== 1 ? 's' : ''}</Text>
            </View>
            <TouchableOpacity
              style={styles.durationButton}
              onPress={() => setRentalDays(rentalDays + 1)}
            >
              <Text style={styles.durationButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${calculateTotal()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.depositLabel}>Refundable Deposit</Text>
            <Text style={styles.depositValue}>${(calculateTotal() * 0.5).toFixed(2)}</Text>
          </View>
        </View>

        {/* Rent Button */}
        <TouchableOpacity style={styles.rentButton} onPress={handleRent}>
          <Text style={styles.rentButtonText}>Rent Now with Chipi Pay</Text>
        </TouchableOpacity>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Daily auto-payment</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Escrow protection</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureText}>Ultra-low fees</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: 400,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  brand: {
    fontSize: 18,
    color: '#888',
    marginTop: 4,
  },
  ratingBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rating: {
    fontSize: 14,
    color: '#fff',
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#888',
  },
  conditionTag: {
    backgroundColor: '#1E3A28',
  },
  conditionText: {
    color: '#4ADE80',
  },
  pricingCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: '#888',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ADE80',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
  ownerCard: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4ADE80',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ownerAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  ownerAddress: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  carbonCard: {
    backgroundColor: '#1E3A28',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4ADE80',
  },
  carbonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ADE80',
    marginBottom: 8,
  },
  carbonText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  durationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
  },
  durationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4ADE80',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  durationDisplay: {
    alignItems: 'center',
    marginHorizontal: 40,
  },
  durationNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  durationLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  totalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ADE80',
  },
  depositLabel: {
    fontSize: 12,
    color: '#888',
  },
  depositValue: {
    fontSize: 14,
    color: '#888',
  },
  rentButton: {
    backgroundColor: '#4ADE80',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  rentButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  feature: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default ItemDetailScreen;
