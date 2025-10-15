import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MOCK_RENTALS } from '../services/mockData';
import { Rental } from '../types';

const MyRentalsScreen = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const activeRentals = MOCK_RENTALS.filter((r) => r.status === 'active');
  const completedRentals = MOCK_RENTALS.filter((r) => r.status === 'completed');

  const displayedRentals = activeTab === 'active' ? activeRentals : completedRentals;

  const getDaysRented = (rental: Rental) => {
    const start = new Date(rental.startDate);
    const end = new Date(rental.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getDaysRemaining = (rental: Rental) => {
    const end = new Date(rental.endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const renderRental = ({ item }: { item: Rental }) => {
    const daysRented = getDaysRented(item);
    const daysRemaining = item.status === 'active' ? getDaysRemaining(item) : 0;

    return (
      <View style={styles.rentalCard}>
        <Image source={{ uri: item.itemImage }} style={styles.rentalImage} />
        <View style={styles.rentalInfo}>
          <Text style={styles.rentalName}>{item.itemName}</Text>

          <View style={styles.rentalDetail}>
            <Text style={styles.detailLabel}>Period:</Text>
            <Text style={styles.detailValue}>
              {item.startDate} to {item.endDate}
            </Text>
          </View>

          {item.status === 'active' && (
            <View style={styles.rentalDetail}>
              <Text style={styles.detailLabel}>Days Remaining:</Text>
              <Text style={[styles.detailValue, styles.highlight]}>
                {daysRemaining} days
              </Text>
            </View>
          )}

          <View style={styles.rentalDetail}>
            <Text style={styles.detailLabel}>Total Paid:</Text>
            <Text style={styles.detailValue}>${item.totalPaid}</Text>
          </View>

          <View style={styles.rentalDetail}>
            <Text style={styles.detailLabel}>Daily Rate:</Text>
            <Text style={styles.detailValue}>${item.dailyPrice}/day</Text>
          </View>

          <View style={styles.carbonBadge}>
            <Text style={styles.carbonText}>
              🌱 {item.carbonSaved}kg CO₂ saved
            </Text>
          </View>

          {item.status === 'active' && (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Extend Rental</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.returnButton]}>
                <Text style={styles.returnButtonText}>Return Item</Text>
              </TouchableOpacity>
            </View>
          )}

          {item.status === 'completed' && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}
          >
            Active ({activeRentals.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'completed' && styles.tabTextActive,
            ]}
          >
            Completed ({completedRentals.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rentals List */}
      {displayedRentals.length > 0 ? (
        <FlatList
          data={displayedRentals}
          renderItem={renderRental}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {activeTab === 'active'
              ? 'No active rentals'
              : 'No completed rentals yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            Explore fashion items and start renting!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#4ADE80',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  tabTextActive: {
    color: '#000',
  },
  list: {
    padding: 16,
  },
  rentalCard: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  rentalImage: {
    width: 100,
    height: '100%',
  },
  rentalInfo: {
    flex: 1,
    padding: 14,
  },
  rentalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  rentalDetail: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#888',
    width: 110,
  },
  detailValue: {
    fontSize: 13,
    color: '#fff',
    flex: 1,
  },
  highlight: {
    color: '#4ADE80',
    fontWeight: 'bold',
  },
  carbonBadge: {
    backgroundColor: '#1E3A28',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 12,
  },
  carbonText: {
    fontSize: 12,
    color: '#4ADE80',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '600',
  },
  returnButton: {
    backgroundColor: '#4ADE80',
  },
  returnButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: '#1E3A28',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  completedText: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default MyRentalsScreen;
