# FashionSwap - Hackathon Demo

## 🎯 Project Overview

**FashionSwap** is a peer-to-peer fashion rental marketplace built on Starknet, powered by Chipi Pay for ultra-low-fee daily payments. Our platform enables sustainable fashion consumption by allowing users to rent designer clothes instead of buying them, reducing fashion waste and carbon emissions.

## 🌟 Key Features

### For Renters:
- Browse and search thousands of fashion items
- Filter by category, brand, size, and location
- Rent items with daily or weekly pricing
- Automatic daily payments via Chipi Pay (0.1% fees)
- Track active rentals and rental history
- View CO₂ savings from each rental
- Escrow protection for deposits

### For Owners:
- List fashion items with photos and details
- Set daily and weekly rental rates
- Earn passive income from unused clothes
- Automatic payment collection
- Item protection via escrow deposits

### Blockchain Integration:
- Built on Starknet for scalability and low fees
- Smart contract-based rental agreements
- Automated daily payment processing
- Transparent transaction history
- Decentralized escrow system

## 🛠️ Tech Stack

- **Frontend**: React Native + Expo (cross-platform mobile app)
- **Blockchain**: Starknet
- **Payment**: Chipi Pay integration
- **Smart Contracts**: Cairo (Starknet)
- **Navigation**: React Navigation (Stack + Tab navigators)
- **TypeScript** for type safety

## 📱 Implemented Screens

1. **Home Screen** (`src/screens/HomeScreen.tsx`)
   - Hero section with wallet connection
   - Platform statistics
   - Featured items carousel
   - Category filters
   - How it works section

2. **Explore Screen** (`src/screens/ExploreScreen.tsx`)
   - Search functionality
   - Category filters
   - Grid view of available items
   - Real-time search and filtering

3. **Item Detail Screen** (`src/screens/ItemDetailScreen.tsx`)
   - Full item information
   - Owner details
   - Rental duration selector
   - Cost calculator
   - Rent button with Chipi Pay integration
   - Environmental impact display

4. **List Item Screen** (`src/screens/ListItemScreen.tsx`)
   - Complete listing form
   - Category and condition selectors
   - Pricing inputs (daily/weekly)
   - Description field
   - Benefits information

5. **My Rentals Screen** (`src/screens/MyRentalsScreen.tsx`)
   - Active rentals tab
   - Completed rentals tab
   - Rental details (dates, cost, CO₂ saved)
   - Extend rental option
   - Return item functionality

6. **Profile Screen** (`src/screens/ProfileScreen.tsx`)
   - User statistics
   - Financial overview
   - CO₂ savings tracker
   - Account information
   - Achievements/badges
   - Transaction history

## 🔐 Smart Contract Architecture

### Mock Implementation (`src/services/rentalContract.ts`)

The app includes a complete mock smart contract service that simulates:

```typescript
- listItem(): List new items for rent
- rentItem(): Initiate a rental with escrow
- processDailyPayment(): Automatic daily charges via Chipi Pay
- returnItem(): Process returns and refund deposits
- calculateRentalCost(): Fee calculation with Chipi Pay rates
```

### Production Smart Contract (To Be Deployed)

```cairo
// Core functions needed:
- list_item(metadata_uri, daily_price, deposit_amount)
- initiate_rental(item_id, duration)
- process_daily_payment(rental_id)
- return_item(rental_id)
- withdraw_earnings(owner_address)
```

## 💰 Chipi Pay Integration

**Why Chipi Pay?**
- Ultra-low fees (0.1% vs traditional 2-3%)
- Instant settlement
- Perfect for micro-payments (daily rentals)
- Built on Starknet for seamless integration

**Payment Flow:**
1. User initiates rental
2. Deposit (50% of total) held in escrow
3. Daily payments auto-charged via Chipi Pay
4. Owner receives payments instantly
5. Deposit refunded upon item return

## 🌱 Environmental Impact

- Each rental displays CO₂ saved vs buying new
- User profiles track total environmental impact
- Achievements for sustainability milestones
- Promotes circular fashion economy

## 🚀 Running the App

```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on web (for demo)
Press 'w' in terminal

# Run on mobile
Use Expo Go app to scan QR code
```

## 📦 Project Structure

```
frontend/
├── src/
│   ├── screens/          # All screen components
│   ├── services/         # Mock data & contract services
│   ├── types/            # TypeScript type definitions
│   └── components/       # Reusable components (future)
├── App.tsx              # Main app with navigation
└── package.json
```

## 🎨 Design System

- **Primary Color**: `#4ADE80` (Green - sustainability theme)
- **Background**: `#000` (Black)
- **Cards**: `#111` (Dark gray)
- **Accent**: `#1E293B` (Slate)
- **Text**: White/Gray scale

## 🔮 Future Enhancements

### Phase 2:
- [ ] Real Starknet wallet integration (Argent X, Braavos)
- [ ] Deploy smart contracts to Starknet testnet
- [ ] Image upload for item listings
- [ ] Rating and review system
- [ ] In-app messaging between users
- [ ] Push notifications for payments/returns

### Phase 3:
- [ ] Mainnet deployment
- [ ] NFT receipts for rentals
- [ ] DAO governance for platform
- [ ] Carbon credit rewards
- [ ] Insurance integration
- [ ] Multi-chain support

## 🏆 Hackathon Value Proposition

### Problem Solved:
- Fashion industry produces 10% of global carbon emissions
- Average person wears 20% of their wardrobe 80% of the time
- Designer items are expensive and underutilized

### Our Solution:
- P2P rental marketplace on Starknet
- Ultra-low fees via Chipi Pay enable daily rentals
- Automated payments reduce friction
- Environmental impact tracking

### Innovation:
- First fashion rental platform on Starknet
- Novel use of Chipi Pay for micro-transactions
- Gamified sustainability tracking
- Decentralized escrow for trust

## 📊 Demo Data

The app includes comprehensive mock data:
- 6 sample fashion items across categories
- 2 sample rentals (active & completed)
- Mock user profile with statistics
- Simulated blockchain transactions

## 🎥 Demo Flow

1. **Onboarding**: Show homepage with platform stats
2. **Browse**: Navigate to Explore, search for items
3. **Detail**: Click item to see full details
4. **Rent**: Select duration, show cost breakdown
5. **Payment**: Explain Chipi Pay integration
6. **Manage**: Show My Rentals with active rental
7. **Profile**: Display sustainability impact
8. **List**: Show how owners can list items

## 👥 Team

- Developer: [Your Name]
- Built for: [Hackathon Name]
- Date: October 2025

## 📝 License

MIT License - Feel free to use for hackathon evaluation

---

**Built with ❤️ for sustainable fashion and powered by Starknet + Chipi Pay**
