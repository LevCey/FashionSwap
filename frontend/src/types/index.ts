export interface FashionItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  size: string;
  dailyPrice: number;
  weeklyPrice: number;
  image: string;
  rating: number;
  carbonSaved: number;
  description: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  owner: string;
  ownerAddress: string;
  available: boolean;
  location: string;
}

export interface Rental {
  id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  startDate: string;
  endDate: string;
  dailyPrice: number;
  totalPaid: number;
  status: 'active' | 'completed' | 'overdue';
  renterAddress: string;
  ownerAddress: string;
  depositAmount: number;
  carbonSaved: number;
}

export interface UserProfile {
  address: string;
  name: string;
  joinedDate: string;
  totalRentals: number;
  totalListings: number;
  totalCarbonSaved: number;
  totalEarned: number;
  totalSpent: number;
  rating: number;
  reviewCount: number;
}
