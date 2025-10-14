# Chipi Pay Integration Guide

## Overview

FashionSwap integrates Chipi Pay to enable ultra-low-cost micro-payments, making it economically viable to rent fashion items for as little as $1-5 per day. This document outlines our integration strategy and implementation.

## Why Chipi Pay for FashionSwap?

### Perfect Use Case Match

1. **Micro-Payments**: Daily rentals are typically $1-10
   - Traditional payment systems: 2.9% + $0.30 fee = unprofitable
   - Chipi Pay: 0.5% fee for micro-payments = sustainable

2. **Mobile-First**: Fashion rental is inherently mobile
   - Users browse/rent on-the-go
   - QR code checkout at pickup locations
   - In-app payments

3. **High Volume**: Platform scales with transaction count
   - Lower fees = more competitive pricing
   - Better unit economics
   - Faster growth

### Cost Comparison

**Example: $5/day dress rental**

| Payment Method | Fee | Net to Owner | Platform Fee |
|----------------|-----|--------------|--------------|
| Traditional CC | $0.45 | $4.30 | $0.25 |
| Standard Crypto | $0.30 | $4.50 | $0.20 |
| **Chipi Pay** | **$0.025** | **$4.85** | **$0.125** |

**Chipi Pay saves 94% on fees!**

## Architecture

### Smart Contract Integration

Our `PaymentHandler.cairo` contract is designed with Chipi Pay in mind:

```cairo
#[storage]
struct Storage {
    // Chipi Pay gateway address
    chipi_pay_gateway: ContractAddress,

    // Ultra-low fee structure
    micro_payment_fee_bps: u256, // 50 bps = 0.5%
    standard_fee_bps: u256,      // 150 bps = 1.5%
}
```

### Fee Structure

```cairo
// Determine fee based on payment size
let fee_bps = if amount < 10_000_000_000_000_000_000 { // < 10 tokens
    self.micro_payment_fee_bps.read() // 0.5% for micro-payments
} else {
    self.standard_fee_bps.read()       // 1.5% for larger amounts
};
```

### Payment Flow

```
┌─────────────┐
│   Renter    │
└──────┬──────┘
       │ 1. Browse items
       │
       ▼
┌─────────────────────┐
│  FashionSwap dApp   │
└──────┬──────────────┘
       │ 2. Select rental period
       │
       ▼
┌─────────────────────┐
│  Rental Marketplace │ (Smart Contract)
└──────┬──────────────┘
       │ 3. Calculate total (rental + deposit)
       │
       ▼
┌─────────────────────┐
│  Payment Handler    │ (Smart Contract)
└──────┬──────────────┘
       │ 4. Create escrow
       │
       ▼
┌─────────────────────┐
│    Chipi Pay SDK    │
└──────┬──────────────┘
       │ 5. Process payment
       │
       ▼
┌─────────────────────┐
│   Starknet Chain    │
└─────────────────────┘
```

## Implementation Details

### Contract Functions

#### 1. Micro-Payment Processing

```cairo
fn process_micro_payment(
    ref self: ContractState,
    recipient: ContractAddress,
    amount: u256,
) {
    // Optimized for small amounts
    let fee = (amount * 50) / 10000; // 0.5%
    let net_amount = amount - fee;

    // Direct payment, no escrow overhead
    self.withdrawable_balances.write(
        recipient,
        current_balance + net_amount
    );
}
```

**Use Case**: Daily rental payments, tips, small purchases

#### 2. Escrow Payments (Rentals)

```cairo
fn create_rental_payment(
    ref self: ContractState,
    recipient: ContractAddress,
    rental_amount: u256,
    security_deposit: u256,
) -> u256 {
    // Hold funds in escrow until rental completes
    let escrow = EscrowPayment {
        payer: caller,
        recipient,
        amount: rental_amount,
        security_deposit,
        status: 0, // pending
    };

    self.escrow_balances.write(payment_id, escrow);
}
```

**Use Case**: Multi-day rentals with security deposits

### Frontend Integration

#### React Native Component

```typescript
import { ChipiPaySDK } from '@chipipay/sdk';

const RentItemScreen = () => {
  const processRental = async (itemId: string, days: number) => {
    // 1. Calculate payment
    const dailyPrice = item.dailyPrice;
    const deposit = item.securityDeposit;
    const total = (dailyPrice * days) + deposit;

    // 2. Initiate Chipi Pay
    const payment = await ChipiPaySDK.createPayment({
      amount: total,
      currency: 'STRK',
      description: `Rent ${item.name} for ${days} days`,
      metadata: {
        itemId,
        rentalDays: days,
        platformFee: total * 0.005, // 0.5%
      }
    });

    // 3. Show Chipi Pay UI
    const result = await ChipiPaySDK.presentPaymentSheet(payment);

    if (result.status === 'success') {
      // 4. Call smart contract
      await rentalMarketplace.rent_item(itemId, days);

      // 5. Confirm to user
      showSuccessMessage('Rental confirmed!');
    }
  };
};
```

#### QR Code Checkout

```typescript
const QRCheckout = ({ itemId, amount }) => {
  const generateQR = async () => {
    // Generate Chipi Pay QR code
    const qrData = await ChipiPaySDK.generateQRCode({
      amount,
      recipient: MARKETPLACE_ADDRESS,
      metadata: { itemId }
    });

    return (
      <QRCode value={qrData.url} size={200} />
    );
  };

  // User scans QR -> instant payment -> rental confirmed
};
```

## User Experience

### Mobile App Flow

1. **Browse Items**
   ```
   [Instagram-style feed]
   Photo | Brand | $5/day
   ↓ Tap to rent
   ```

2. **Select Rental Period**
   ```
   How many days?
   [1] [3] [7] [Custom]

   Daily rate: $5
   Total: $15
   Deposit: $20
   ───────────
   Total due: $35
   ```

3. **Chipi Pay Checkout**
   ```
   [Chipi Pay Modal]

   Amount: $35 STRK
   Fee: $0.18 (0.5%)

   [Pay with Chipi] ← One tap
   ```

4. **Confirmation**
   ```
   ✓ Payment successful!

   Your rental:
   - Start: Oct 14, 2025
   - End: Oct 17, 2025

   [View Details]
   ```

### Rental Completion Flow

1. **Return Item** (after rental period)
   ```
   Return confirmed ✓

   Refunding deposit...
   $20 → Your wallet

   Rate your experience:
   ★★★★★
   ```

2. **Auto-Settlement**
   ```
   [Backend processing]

   PaymentHandler.release_payment()
   ↓
   Owner receives: $14.85 (after 1% fee)
   Platform earns: $0.15
   Renter gets deposit: $20
   ```

## Advanced Features

### Subscription Rentals

For power users who rent frequently:

```cairo
struct SubscriptionPlan {
    subscriber: ContractAddress,
    monthly_credits: u256,      // e.g., $50/month
    discount_bps: u256,          // e.g., 10% = 1000 bps
    auto_renew: bool,
}
```

**Benefit**: Pre-pay for lower fees (0.3% instead of 0.5%)

### Batch Payments

Rent multiple items in one transaction:

```cairo
fn batch_rental_payment(
    ref self: ContractState,
    items: Array<(u256, u8)>, // (token_id, days)
) {
    // Single Chipi Pay transaction
    // Multiple rental contracts
    // Gas optimization
}
```

### Instant Settlements

Enable instant payouts for owners (vs. waiting for rental end):

```typescript
// Owner opts-in to instant settlement
const enableInstantPayout = async () => {
  // Platform takes slightly higher fee (0.7% vs 0.5%)
  // Owner gets paid immediately when rental starts
  // Platform assumes risk of deposit issues
};
```

## Security Considerations

### Escrow Protection

```cairo
#[derive(Drop, Serde, starknet::Store)]
struct EscrowPayment {
    status: u8, // 0=pending, 1=completed, 2=refunded, 3=disputed
    // ...
}
```

**States:**
- `pending`: Funds held, rental active
- `completed`: Funds released to owner
- `refunded`: Rental cancelled, funds returned
- `disputed`: Manual review needed

### Dispute Resolution

```cairo
fn initiate_dispute(ref self: ContractState, payment_id: u256) {
    // Freeze funds
    escrow.status = 3;

    // Notify platform admins
    // Await manual resolution
    // Funds released based on evidence
}
```

### Reentrancy Protection

```cairo
component!(path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent);

fn rent_item(ref self: ContractState, token_id: u256, rental_days: u8) {
    self.reentrancy_guard.start();

    // Payment processing...

    self.reentrancy_guard.end();
}
```

## Gas Optimization

### Minimal Storage Writes

```cairo
// BAD: Multiple writes
self.balance_1.write(new_val_1);
self.balance_2.write(new_val_2);
self.balance_3.write(new_val_3);

// GOOD: Batch update struct
let updated_state = PaymentState { ... };
self.payment_states.write(id, updated_state);
```

### Chipi Pay Benefits

- Off-chain computation where possible
- On-chain only for settlement
- Optimized for L2 (Starknet)

## Testing

### Local Testing

```bash
# Start Starknet devnet
starknet-devnet --seed 0

# Deploy contracts
scarb build
starkli deploy ...

# Test Chipi Pay integration
npm run test:integration
```

### Mock Chipi Pay

For development without real Chipi Pay:

```typescript
// Mock SDK for testing
const MockChipiPay = {
  createPayment: async (opts) => ({ id: 'mock_123' }),
  presentPaymentSheet: async () => ({ status: 'success' }),
};
```

## Metrics & Analytics

### Track Key Metrics

```typescript
// Frontend analytics
trackEvent('chipi_pay_initiated', {
  amount,
  itemId,
  rentalDays,
});

trackEvent('chipi_pay_success', {
  paymentId,
  fee,
  processingTime,
});

// Smart contract events
event PaymentProcessed {
    payer: ContractAddress,
    amount: u256,
    fee: u256,
    timestamp: u64,
}
```

### Success Metrics

- Payment success rate: Target >99%
- Average processing time: <3 seconds
- Fee savings vs. traditional: >90%
- User satisfaction: >4.5 stars

## Future Enhancements

1. **Chipi Pay Rewards Integration**
   - Cashback on rentals
   - Loyalty points
   - Referral bonuses

2. **Cross-Chain Payments**
   - Accept payments from other chains
   - Bridge via Chipi Pay
   - Expand user base

3. **Fiat On-Ramp**
   - Credit card → STRK → rental
   - Seamless for non-crypto users
   - Powered by Chipi Pay partners

## Support & Resources

- **Chipi Pay Docs**: [To be linked]
- **Starknet Docs**: https://docs.starknet.io
- **FashionSwap Discord**: [Coming soon]
- **Technical Support**: support@fashionswap.xyz

## Conclusion

Chipi Pay makes FashionSwap economically viable by:
1. Enabling profitable micro-payments ($1-10)
2. Providing mobile-first UX
3. Reducing fees by 90%+ vs. traditional systems

This integration is core to our value proposition and competitive advantage.

---

**Built for Chipi Pay Prize Track ($1,000 STRK)**

*Demonstrating perfect use case for next-gen mobile payments*
