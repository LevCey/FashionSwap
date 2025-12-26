# 🥈 FashionSwap - Sustainable P2P Fashion Platform

![Starknet Re{Solve} Hackathon 2nd Place](https://img.shields.io/badge/🥈_Starknet_Re{Solve}_Hackathon-2nd_Place-silver?style=for-the-badge)
![Starknet](https://img.shields.io/badge/Starknet-Sepolia-blue?logo=ethereum)
![Cairo](https://img.shields.io/badge/Cairo-2.8.2+-orange)
![License](https://img.shields.io/badge/License-MIT-green)

> **🥈 2nd Place at [Starknet Re{Solve} Hackathon](https://resolve-starknet.devpost.com/) (Oct 2025)**

FashionSwap is a decentralized fashion rental and swap platform built on Starknet, enabling peer-to-peer fashion sharing with ultra-low fees powered by Chipi Pay integration.

## 🏅 Hackathon Achievement

| Competition | Result |
|-------------|--------|
| [Starknet Re{Solve} Hackathon](https://resolve-starknet.devpost.com/) | 🥈 **2nd Place** |

📺 [Demo Video](https://www.youtube.com/watch?v=gxh33SircFg) | 📝 [Devpost](https://devpost.com/software/fashionswap)


## Problem Statement

The fashion industry is one of the world's largest polluters, with fast fashion contributing to:
- 10% of global carbon emissions
- Massive textile waste (92 million tons annually)
- Overconsumption and underutilization of clothing items

**Average person wears an item only 7 times before disposal.**

## Our Solution

FashionSwap creates a circular fashion economy where users can:
- **Rent** clothing items for daily micro-payments ($1-10/day)
- **Swap** items peer-to-peer with no fees
- **Track** carbon footprint savings
- **Earn** by renting out unused wardrobe items

### Why Starknet + Chipi Pay?

- **Ultra-low fees**: Perfect for $1-5 daily rentals (micro-payments)
- **Mobile-first**: Chipi Pay enables seamless mobile payments
- **Scalability**: Handle high transaction volumes as platform grows
- **Sustainability tracking**: On-chain carbon footprint data

## Features

### Core Functionality

1. **Fashion Item NFTs**
   - Each clothing item represented as NFT
   - Rich metadata: brand, size, condition, photos
   - Rental history and ratings on-chain
   - Carbon savings tracking

2. **Rental Marketplace**
   - List items for daily/weekly rental
   - Flexible pricing (owner sets daily rate)
   - Security deposit system
   - Automated escrow payments

3. **P2P Swapping**
   - Direct clothing swaps between users
   - Category/brand matching
   - Zero platform fees for swaps
   - Build sustainable wardrobe

4. **Payment System (Chipi Pay Integration)**
   - Micro-payment processing (as low as $1)
   - Ultra-low transaction fees (0.5% for micro-payments)
   - Instant settlements
   - Escrow protection

### Social Impact Features

- **Carbon Footprint Tracker**: See your environmental impact
- **Sustainability Score**: Gamified green fashion behavior
- **Community Ratings**: Build trust through reviews
- **Local Discovery**: Find items near you (mobile-first)

## Tech Stack

### Smart Contracts (Starknet)
- **Cairo 2.8.2+** for contract development
- **OpenZeppelin** contracts for security
- **Scarb** build system

**3 Main Contracts:**
1. `FashionItemNFT.cairo` - ERC721 NFTs with fashion metadata
2. `RentalMarketplace.cairo` - Listing, renting, and swapping logic
3. `PaymentHandler.cairo` - Chipi Pay integration & escrow system

### Frontend (Mobile-First)
- **React Native** for iOS/Android
- **Starknet.js** for blockchain interaction
- **Chipi Pay SDK** for seamless payments
- **Expo** for rapid development

## Project Structure

```
FashionSwap/
├── contracts/
│   ├── src/
│   │   ├── fashion_item_nft.cairo
│   │   ├── rental_marketplace.cairo
│   │   ├── payment_handler.cairo
│   │   └── lib.cairo
│   ├── tests/
│   └── Scarb.toml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── services/
│   │   └── assets/
│   └── package.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CHIPI_PAY_INTEGRATION.md
│   └── DEMO_GUIDE.md
└── README.md
```

## Getting Started

### Prerequisites

```bash
# Install Scarb (Cairo package manager)
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh

# Install Node.js and npm
# Visit: https://nodejs.org/

# Install Starknet CLI
pip install starknet-devnet
```

### Build Smart Contracts

```bash
cd contracts
scarb build
```

### Test Contracts

```bash
cd contracts
scarb test
```

### Run Frontend (Development)

```bash
cd frontend
npm install
npm start
```

## Smart Contract Architecture

### FashionItemNFT

NFT contract representing each clothing item with:
- Metadata: name, brand, category, size, color, condition
- Rental statistics: total rentals, revenue, days rented
- Rating system: 5-star reviews
- Carbon footprint tracking

**Key Functions:**
- `mint_fashion_item()` - Create new fashion NFT
- `list_item()` / `unlist_item()` - Control marketplace availability
- `rate_item()` - Leave review after rental
- `update_rental_stats()` - Called by marketplace on rental completion

### RentalMarketplace

Core marketplace logic for rentals and swaps:
- Rental listings with customizable terms
- Swap listings with preference matching
- Active rental tracking
- Security deposit management

**Key Functions:**
- `list_for_rent()` - List item with daily price
- `rent_item()` - Initiate rental with payment
- `end_rental()` - Complete rental, return deposit
- `propose_swap()` / `accept_swap()` - P2P swapping

### PaymentHandler

Chipi Pay integration for seamless payments:
- Escrow system for rental security
- Micro-payment optimization (<$10)
- Ultra-low fee structure (0.5% - 1.5%)
- Automated settlements

**Key Functions:**
- `create_rental_payment()` - Escrow rental + deposit
- `process_micro_payment()` - Instant small payments
- `release_payment()` - Complete transaction
- `return_deposit()` - Refund security deposit

## Chipi Pay Integration

FashionSwap leverages Chipi Pay for:

1. **Micro-Payments**: Daily rentals as low as $1
2. **Mobile UX**: QR code scanning for instant checkout
3. **Low Fees**: 0.5% for transactions under $10
4. **Fast Settlement**: Immediate fund availability

### Payment Flow

```
User initiates rental
    ↓
PaymentHandler creates escrow (rental + deposit)
    ↓
Chipi Pay processes payment
    ↓
NFT access granted to renter
    ↓
Rental period ends
    ↓
PaymentHandler releases funds to owner
    ↓
Deposit returned to renter (if no issues)
```

## Environmental Impact

### Carbon Savings Calculation

Each rental saves approximately **2kg CO2** per day compared to buying new.

**Example:**
- Rent a dress for 3 days = 6kg CO2 saved
- 100 rentals/month = 600kg CO2 saved
- 1 year = 7.2 tons CO2 saved (equivalent to ~30,000 km driving)

### Platform Metrics (Target)

- **10,000 items** listed in first month
- **50,000 rentals** in first quarter
- **100 tons CO2** saved in first year

## Roadmap

### Hackathon MVP (Current)
- ✅ Smart contracts (NFT, Marketplace, Payments)
- ✅ Basic frontend structure
- ✅ Chipi Pay integration design
- ⏳ Mobile app UI
- ⏳ Demo video

### Post-Hackathon (Q4 2025)
- Full mobile app launch (iOS/Android)
- AI-powered swap recommendations
- Social features (follow, share, collections)
- Integration with physical delivery services

### Future Features
- Virtual try-on (AR)
- Sustainability badges and gamification
- Brand partnerships
- Carbon offset marketplace

## Team

Built for **Starknet Resolve Hackathon** (Oct 2025)

## Hackathon Tracks

This project competes in:
1. **Next-Gen Payments** (Starknet Foundation - $3K)
2. **Next-Gen Payments** (Chipi Pay Prize - $1K)
3. **Mobile-First dApps** ($3K)

**Total Prize Pool Target: $7,000**

## Why FashionSwap Wins

### Technical Excellence
- ✅ Production-ready Cairo contracts with OpenZeppelin
- ✅ Proper security patterns (ReentrancyGuard, Ownable)
- ✅ Optimized for micro-payments
- ✅ Mobile-first architecture

### Innovation
- ✅ First fashion rental platform on Starknet
- ✅ Unique P2P swap mechanism
- ✅ On-chain carbon tracking
- ✅ Chipi Pay perfect use case

### Real-World Impact
- ✅ Addresses $2.5 trillion fashion industry
- ✅ Clear sustainability benefits
- ✅ Solves real problem (closet underutilization)
- ✅ Scalable business model

### Market Fit
- Growing conscious consumer movement
- $1.5B+ fashion rental market by 2028
- Perfect timing with sustainable fashion trend

## License

MIT License - see LICENSE file for details

## Links

- **Demo Video**: [Coming Soon]
- **Live Demo**: [Coming Soon]
- **Documentation**: See `/docs` folder
- **Hackathon Submission**: https://devpost.com/software/fashionswap

---

**Built with ❤️ for a sustainable fashion future on Starknet**

*"Wear more, waste less - powered by blockchain"*
