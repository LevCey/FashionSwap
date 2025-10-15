import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { MOCK_ITEMS } from '../services/mockData';
import { FashionItem } from '../types';

const ExploreScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredItems, setFilteredItems] = useState(MOCK_ITEMS);

  const categories = ['All', 'Dress', 'Jacket', 'Pants', 'Shoes', 'Accessories'];

  const filterItems = (query: string, category: string) => {
    let items = MOCK_ITEMS;

    if (category !== 'All') {
      items = items.filter((item) => item.category === category);
    }

    if (query) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.brand.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredItems(items);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterItems(query, selectedCategory);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    filterItems(searchQuery, category);
  };

  const renderItem = ({ item }: { item: FashionItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate('ItemDetail', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemBrand}>{item.brand}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.price}>${item.dailyPrice}/day</Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.location}>📍 {item.location}</Text>
        </View>
        <View style={styles.carbonBadge}>
          <Text style={styles.carbonText}>🌱 {item.carbonSaved}kg CO₂ saved</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items or brands..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              selectedCategory === cat && styles.categoryChipActive,
            ]}
            onPress={() => handleCategorySelect(cat)}
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

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredItems.length} items available
        </Text>
      </View>

      {/* Items Grid */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.itemsList}
        columnWrapperStyle={styles.itemsRow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchContainer: {
    padding: 16,
    paddingTop: 8,
  },
  searchInput: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  categories: {
    paddingHorizontal: 16,
    marginBottom: 12,
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
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsText: {
    color: '#888',
    fontSize: 14,
  },
  itemsList: {
    padding: 8,
  },
  itemsRow: {
    justifyContent: 'space-between',
  },
  itemCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#111',
    borderRadius: 12,
    overflow: 'hidden',
    maxWidth: '48%',
  },
  itemImage: {
    width: '100%',
    height: 180,
  },
  itemInfo: {
    padding: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemBrand: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4ADE80',
  },
  rating: {
    fontSize: 12,
    color: '#fff',
  },
  row: {
    marginTop: 6,
  },
  location: {
    fontSize: 11,
    color: '#888',
  },
  carbonBadge: {
    marginTop: 8,
    backgroundColor: '#1E3A28',
    padding: 6,
    borderRadius: 6,
  },
  carbonText: {
    fontSize: 10,
    color: '#4ADE80',
  },
});

export default ExploreScreen;
