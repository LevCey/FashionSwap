#[starknet::contract]
mod RentalMarketplace {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp, get_contract_address};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::security::reentrancyguard::ReentrancyGuardComponent;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent);

    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl ReentrancyGuardInternalImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage,
        // Contract addresses
        nft_contract: ContractAddress,
        payment_handler: ContractAddress,
        // Listings
        rental_listings: LegacyMap::<u256, RentalListing>,
        swap_listings: LegacyMap::<u256, SwapListing>,
        active_rentals: LegacyMap::<u256, ActiveRental>,
        // Platform fee (in basis points, e.g., 250 = 2.5%)
        platform_fee_bps: u256,
        // User stats
        user_rental_count: LegacyMap::<ContractAddress, u32>,
        user_swap_count: LegacyMap::<ContractAddress, u32>,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct RentalListing {
        token_id: u256,
        owner: ContractAddress,
        daily_price: u256,
        security_deposit: u256,
        min_rental_days: u8,
        max_rental_days: u8,
        is_active: bool,
        created_at: u64,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct SwapListing {
        token_id: u256,
        owner: ContractAddress,
        desired_categories: felt252, // comma-separated categories
        desired_brands: felt252, // comma-separated brands
        is_active: bool,
        created_at: u64,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct ActiveRental {
        token_id: u256,
        renter: ContractAddress,
        owner: ContractAddress,
        start_date: u64,
        end_date: u64,
        daily_price: u256,
        security_deposit: u256,
        is_active: bool,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
        ItemListedForRent: ItemListedForRent,
        ItemListedForSwap: ItemListedForSwap,
        RentalStarted: RentalStarted,
        RentalEnded: RentalEnded,
        SwapProposed: SwapProposed,
        SwapCompleted: SwapCompleted,
        ListingCancelled: ListingCancelled,
    }

    #[derive(Drop, starknet::Event)]
    struct ItemListedForRent {
        token_id: u256,
        owner: ContractAddress,
        daily_price: u256,
        security_deposit: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct ItemListedForSwap {
        token_id: u256,
        owner: ContractAddress,
        desired_categories: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct RentalStarted {
        token_id: u256,
        renter: ContractAddress,
        owner: ContractAddress,
        start_date: u64,
        end_date: u64,
        total_price: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct RentalEnded {
        token_id: u256,
        renter: ContractAddress,
        owner: ContractAddress,
        deposit_returned: bool,
    }

    #[derive(Drop, starknet::Event)]
    struct SwapProposed {
        token_id_1: u256,
        token_id_2: u256,
        proposer: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct SwapCompleted {
        token_id_1: u256,
        token_id_2: u256,
        owner_1: ContractAddress,
        owner_2: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct ListingCancelled {
        token_id: u256,
        owner: ContractAddress,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        nft_contract: ContractAddress,
        payment_handler: ContractAddress,
    ) {
        self.ownable.initializer(owner);
        self.nft_contract.write(nft_contract);
        self.payment_handler.write(payment_handler);
        self.platform_fee_bps.write(250); // 2.5% default fee
    }

    #[abi(embed_v0)]
    impl RentalMarketplaceImpl of super::IRentalMarketplace<ContractState> {
        fn list_for_rent(
            ref self: ContractState,
            token_id: u256,
            daily_price: u256,
            security_deposit: u256,
            min_rental_days: u8,
            max_rental_days: u8,
        ) {
            let caller = get_caller_address();

            // Verify ownership (would need to call NFT contract)
            assert(daily_price > 0, 'Price must be positive');
            assert(min_rental_days > 0, 'Min days must be positive');
            assert(max_rental_days >= min_rental_days, 'Invalid day range');

            let listing = RentalListing {
                token_id,
                owner: caller,
                daily_price,
                security_deposit,
                min_rental_days,
                max_rental_days,
                is_active: true,
                created_at: get_block_timestamp(),
            };

            self.rental_listings.write(token_id, listing);

            self.emit(ItemListedForRent {
                token_id,
                owner: caller,
                daily_price,
                security_deposit,
            });
        }

        fn list_for_swap(
            ref self: ContractState,
            token_id: u256,
            desired_categories: felt252,
            desired_brands: felt252,
        ) {
            let caller = get_caller_address();

            let listing = SwapListing {
                token_id,
                owner: caller,
                desired_categories,
                desired_brands,
                is_active: true,
                created_at: get_block_timestamp(),
            };

            self.swap_listings.write(token_id, listing);

            self.emit(ItemListedForSwap {
                token_id,
                owner: caller,
                desired_categories,
            });
        }

        fn rent_item(
            ref self: ContractState,
            token_id: u256,
            rental_days: u8,
        ) {
            self.reentrancy_guard.start();

            let caller = get_caller_address();
            let listing = self.rental_listings.read(token_id);

            assert(listing.is_active, 'Listing not active');
            assert(rental_days >= listing.min_rental_days, 'Below min days');
            assert(rental_days <= listing.max_rental_days, 'Above max days');
            assert(caller != listing.owner, 'Cannot rent own item');

            let total_price = listing.daily_price * rental_days.into();
            let total_with_deposit = total_price + listing.security_deposit;

            // Payment would be processed via PaymentHandler (Chipi Pay integration)
            // For now, we'll assume payment is successful

            let start_date = get_block_timestamp();
            let end_date = start_date + (rental_days.into() * 86400); // 86400 seconds = 1 day

            let rental = ActiveRental {
                token_id,
                renter: caller,
                owner: listing.owner,
                start_date,
                end_date,
                daily_price: listing.daily_price,
                security_deposit: listing.security_deposit,
                is_active: true,
            };

            self.active_rentals.write(token_id, rental);

            // Update user stats
            let current_count = self.user_rental_count.read(caller);
            self.user_rental_count.write(caller, current_count + 1);

            self.emit(RentalStarted {
                token_id,
                renter: caller,
                owner: listing.owner,
                start_date,
                end_date,
                total_price,
            });

            self.reentrancy_guard.end();
        }

        fn end_rental(
            ref self: ContractState,
            token_id: u256,
            return_deposit: bool,
        ) {
            let caller = get_caller_address();
            let mut rental = self.active_rentals.read(token_id);

            assert(rental.is_active, 'No active rental');
            assert(
                caller == rental.owner || caller == rental.renter,
                'Not authorized'
            );

            let current_time = get_block_timestamp();
            assert(current_time >= rental.end_date, 'Rental period not ended');

            rental.is_active = false;
            self.active_rentals.write(token_id, rental);

            // If deposit should be returned, process refund
            // Otherwise, deposit goes to owner (for damages, etc.)

            self.emit(RentalEnded {
                token_id,
                renter: rental.renter,
                owner: rental.owner,
                deposit_returned: return_deposit,
            });
        }

        fn propose_swap(
            ref self: ContractState,
            my_token_id: u256,
            their_token_id: u256,
        ) {
            let caller = get_caller_address();

            let my_listing = self.swap_listings.read(my_token_id);
            let their_listing = self.swap_listings.read(their_token_id);

            assert(my_listing.is_active, 'Your item not listed');
            assert(their_listing.is_active, 'Their item not listed');
            assert(my_listing.owner == caller, 'Not your item');
            assert(their_listing.owner != caller, 'Cannot swap with self');

            self.emit(SwapProposed {
                token_id_1: my_token_id,
                token_id_2: their_token_id,
                proposer: caller,
            });
        }

        fn accept_swap(
            ref self: ContractState,
            token_id_1: u256,
            token_id_2: u256,
        ) {
            self.reentrancy_guard.start();

            let caller = get_caller_address();

            let mut listing_1 = self.swap_listings.read(token_id_1);
            let mut listing_2 = self.swap_listings.read(token_id_2);

            assert(listing_1.is_active, 'Listing 1 not active');
            assert(listing_2.is_active, 'Listing 2 not active');
            assert(listing_2.owner == caller, 'Not your item');

            // Deactivate listings
            listing_1.is_active = false;
            listing_2.is_active = false;
            self.swap_listings.write(token_id_1, listing_1);
            self.swap_listings.write(token_id_2, listing_2);

            // Update swap counts
            let count_1 = self.user_swap_count.read(listing_1.owner);
            let count_2 = self.user_swap_count.read(listing_2.owner);
            self.user_swap_count.write(listing_1.owner, count_1 + 1);
            self.user_swap_count.write(listing_2.owner, count_2 + 1);

            // NFT transfers would happen here via the NFT contract

            self.emit(SwapCompleted {
                token_id_1,
                token_id_2,
                owner_1: listing_1.owner,
                owner_2: listing_2.owner,
            });

            self.reentrancy_guard.end();
        }

        fn cancel_listing(ref self: ContractState, token_id: u256, listing_type: u8) {
            let caller = get_caller_address();

            if listing_type == 0 { // Rental
                let mut listing = self.rental_listings.read(token_id);
                assert(listing.owner == caller, 'Not listing owner');
                assert(listing.is_active, 'Not active');

                listing.is_active = false;
                self.rental_listings.write(token_id, listing);
            } else { // Swap
                let mut listing = self.swap_listings.read(token_id);
                assert(listing.owner == caller, 'Not listing owner');
                assert(listing.is_active, 'Not active');

                listing.is_active = false;
                self.swap_listings.write(token_id, listing);
            }

            self.emit(ListingCancelled { token_id, owner: caller });
        }

        fn get_rental_listing(self: @ContractState, token_id: u256) -> RentalListing {
            self.rental_listings.read(token_id)
        }

        fn get_swap_listing(self: @ContractState, token_id: u256) -> SwapListing {
            self.swap_listings.read(token_id)
        }

        fn get_active_rental(self: @ContractState, token_id: u256) -> ActiveRental {
            self.active_rentals.read(token_id)
        }

        fn get_user_stats(self: @ContractState, user: ContractAddress) -> (u32, u32) {
            let rental_count = self.user_rental_count.read(user);
            let swap_count = self.user_swap_count.read(user);
            (rental_count, swap_count)
        }

        fn set_platform_fee(ref self: ContractState, fee_bps: u256) {
            self.ownable.assert_only_owner();
            assert(fee_bps <= 1000, 'Fee too high'); // Max 10%
            self.platform_fee_bps.write(fee_bps);
        }

        fn get_platform_fee(self: @ContractState) -> u256 {
            self.platform_fee_bps.read()
        }
    }
}

#[starknet::interface]
trait IRentalMarketplace<TContractState> {
    fn list_for_rent(
        ref self: TContractState,
        token_id: u256,
        daily_price: u256,
        security_deposit: u256,
        min_rental_days: u8,
        max_rental_days: u8,
    );
    fn list_for_swap(
        ref self: TContractState,
        token_id: u256,
        desired_categories: felt252,
        desired_brands: felt252,
    );
    fn rent_item(ref self: TContractState, token_id: u256, rental_days: u8);
    fn end_rental(ref self: TContractState, token_id: u256, return_deposit: bool);
    fn propose_swap(ref self: TContractState, my_token_id: u256, their_token_id: u256);
    fn accept_swap(ref self: TContractState, token_id_1: u256, token_id_2: u256);
    fn cancel_listing(ref self: TContractState, token_id: u256, listing_type: u8);
    fn get_rental_listing(self: @TContractState, token_id: u256) -> RentalMarketplace::RentalListing;
    fn get_swap_listing(self: @TContractState, token_id: u256) -> RentalMarketplace::SwapListing;
    fn get_active_rental(self: @TContractState, token_id: u256) -> RentalMarketplace::ActiveRental;
    fn get_user_stats(self: @TContractState, user: ContractAddress) -> (u32, u32);
    fn set_platform_fee(ref self: TContractState, fee_bps: u256);
    fn get_platform_fee(self: @TContractState) -> u256;
}
