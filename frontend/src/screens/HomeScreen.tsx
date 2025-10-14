import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useStarknet } from '../services/StarknetProvider';

interface FashionItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  dailyPrice: number;
  image: string;
  rating: number;
  carbonSaved: number;
}

// Mock data for demo
const FEATURED_ITEMS: FashionItem[] = [
  {
    id: '1',
    name: 'Summer Dress',
    brand: 'Zara',
    category: 'Dress',
    dailyPrice: 8,
    image: 'https://via.placeholder.com/300x400/FF6B9D/fff?text=Summer+Dress',
    rating: 4.8,
    carbonSaved: 15,
  },
  {
    id: '2',
    name: 'Leather Jacket',
    brand: 'H&M',
    category: 'Jacket',
    dailyPrice: 12,
    image: 'https://via.placeholder.com/300x400/4ADE80/fff?text=Leather+Jacket',
    rating: 4.9,
    carbonSaved: 28,
  },
  {
    id: '3',
    name: 'Designer Jeans',
    brand: "Levi's",
    category: 'Pants',
    dailyPrice: 6,
    image: 'https://via.placeholder.com/300x400/3B82F6/fff?text=Designer+Jeans',
    rating: 4.7,
    carbonSaved: 12,
  },
];

const HomeScreen = () => {
  const { connected, connect } = useStarknet();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Dress', 'Jacket', 'Pants', 'Shoes', 'Accessories'];

  const renderItem = ({ item }: { item: FashionItem }) => (
    <TouchableOpacity style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemBrand}>{item.brand}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.price}>${item.dailyPrice}/day</Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <View style={styles.carbonBadge}>
          <Text style={styles.carbonText}>🌱 {item.carbonSaved}kg CO₂ saved</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Sustainable Fashion,{'\n'}One Rental at a Time</Text>
        <Text style={styles.heroSubtitle}>
          Rent designer clothes. Save money. Save the planet.
        </Text>

        {!connected ? (
          <TouchableOpacity style={styles.connectButton} onPress={connect}>
            <Text style={styles.connectButtonText}>Connect Wallet</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.connectedBadge}>
            <Text style={styles.connectedText}>✓ Wallet Connected</Text>
          </View>
        )}
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>10K+</Text>
          <Text style={styles.statLabel}>Items</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>50K+</Text>
          <Text style={styles.statLabel}>Rentals</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>100T</Text>
          <Text style={styles.statLabel}>CO₂ Saved</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Items</Text>
        <FlatList
          data={FEATURED_ITEMS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepTitle}>Browse</Text>
            <Text style={styles.stepText}>Discover sustainable fashion from local owners</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepTitle}>Rent</Text>
            <Text style={styles.stepText}>Pay daily with ultra-low fees via Chipi Pay</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepTitle}>Enjoy</Text>
            <Text style={styles.stepText}>Wear, return, repeat. Track your CO₂ savings!</Text>
          </View>
        </View>
      </View>

      {/* Chipi Pay Badge */}
      <View style={styles.chipiBadge}>
        <Text style={styles.chipiText}>Powered by Chipi Pay</Text>
        <Text style={styles.chipiSubtext}>Ultra-low fees • Instant settlements</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  hero: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#111',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
  },
  connectButton: {
    backgroundColor: '#4ADE80',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectedBadge: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4ADE80',
  },
  connectedText: {
    color: '#4ADE80',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
    backgroundColor: '#111',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ADE80',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  categories: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryChipActive: {
    backgroundColor: '#4ADE80',
  },
  categoryText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#000',
  },
  itemCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: '#111',
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemImage: {
    width: 200,
    height: 260,
  },
  itemInfo: {
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemBrand: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ADE80',
  },
  rating: {
    fontSize: 14,
    color: '#fff',
  },
  carbonBadge: {
    marginTop: 8,
    backgroundColor: '#1E3A28',
    padding: 6,
    borderRadius: 6,
  },
  carbonText: {
    fontSize: 12,
    color: '#4ADE80',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  step: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  stepNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4ADE80',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  chipiBadge: {
    margin: 24,
    padding: 20,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4ADE80',
    alignItems: 'center',
  },
  chipiText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ADE80',
  },
  chipiSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default HomeScreen;
