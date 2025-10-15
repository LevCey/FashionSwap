import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const ProfileScreen = () => {
  // Mock user data - in real app, this would come from wallet/backend
  const userProfile = {
    address: '0x742d...89Ab',
    name: 'Fashion Enthusiast',
    joinedDate: 'October 2024',
    totalRentals: 12,
    totalListings: 5,
    totalCarbonSaved: 142,
    totalEarned: 580,
    totalSpent: 240,
    rating: 4.8,
    reviewCount: 15,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userProfile.name.charAt(0)}
          </Text>
        </View>
        <Text style={styles.name}>{userProfile.name}</Text>
        <Text style={styles.address}>{userProfile.address}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {userProfile.rating}</Text>
          <Text style={styles.reviewCount}>({userProfile.reviewCount} reviews)</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userProfile.totalRentals}</Text>
          <Text style={styles.statLabel}>Total Rentals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userProfile.totalListings}</Text>
          <Text style={styles.statLabel}>Items Listed</Text>
        </View>
        <View style={[styles.statCard, styles.carbonCard]}>
          <Text style={[styles.statNumber, styles.carbonNumber]}>
            {userProfile.totalCarbonSaved}kg
          </Text>
          <Text style={styles.statLabel}>CO₂ Saved 🌱</Text>
        </View>
      </View>

      {/* Financial Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <View style={styles.financialCard}>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Total Earned</Text>
            <Text style={[styles.financialValue, styles.earnedValue]}>
              ${userProfile.totalEarned}
            </Text>
          </View>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Total Spent</Text>
            <Text style={styles.financialValue}>${userProfile.totalSpent}</Text>
          </View>
          <View style={[styles.financialRow, styles.netRow]}>
            <Text style={styles.financialLabel}>Net Balance</Text>
            <Text style={[styles.financialValue, styles.netValue]}>
              ${userProfile.totalEarned - userProfile.totalSpent}
            </Text>
          </View>
        </View>
      </View>

      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>{userProfile.joinedDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Wallet Address</Text>
            <Text style={styles.infoValue}>{userProfile.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Network</Text>
            <Text style={styles.infoValue}>Starknet Sepolia</Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievements}>
          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>🌟</Text>
            <Text style={styles.badgeText}>Early Adopter</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>♻️</Text>
            <Text style={styles.badgeText}>Eco Warrior</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>👕</Text>
            <Text style={styles.badgeText}>Fashion Sharer</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            Transaction History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
          <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
            Disconnect Wallet
          </Text>
        </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ADE80',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#fff',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#888',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  carbonCard: {
    borderWidth: 2,
    borderColor: '#4ADE80',
    backgroundColor: '#1E3A28',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  carbonNumber: {
    color: '#4ADE80',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  financialCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  netRow: {
    borderBottomWidth: 0,
    paddingTop: 16,
  },
  financialLabel: {
    fontSize: 14,
    color: '#888',
  },
  financialValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  earnedValue: {
    color: '#4ADE80',
  },
  netValue: {
    fontSize: 20,
    color: '#4ADE80',
  },
  infoCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
  },
  achievements: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  badgeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#4ADE80',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  secondaryButton: {
    backgroundColor: '#1E293B',
  },
  secondaryButtonText: {
    color: '#4ADE80',
  },
  dangerButton: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  dangerButtonText: {
    color: '#EF4444',
  },
  chipiBadge: {
    margin: 16,
    padding: 20,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4ADE80',
    alignItems: 'center',
  },
  chipiText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ADE80',
  },
  chipiSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

export default ProfileScreen;
