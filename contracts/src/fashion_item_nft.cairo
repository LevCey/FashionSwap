use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store, Copy)]
pub struct ItemMetadata {
    pub name: felt252,
    pub brand: felt252,
    pub category: felt252, // dress, shirt, pants, shoes, etc.
    pub size: felt252,
    pub color: felt252,
    pub image_uri: felt252,
    pub condition: u8, // 1-10 scale
    pub original_price: u256,
    pub carbon_footprint_saved: u256, // in grams of CO2
}

#[derive(Drop, Serde, starknet::Store, Copy)]
pub struct RentalHistory {
    pub total_rentals: u32,
    pub total_days_rented: u64,
    pub last_rental_timestamp: u64,
    pub total_revenue: u256,
}

#[derive(Drop, Serde, starknet::Store, Copy)]
pub struct Rating {
    pub total_rating: u64,
    pub rating_count: u32,
}

#[starknet::contract]
mod FashionItemNFT {
    use super::{ItemMetadata, RentalHistory, Rating};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess, StorageMapWriteAccess};
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::access::ownable::OwnableComponent;

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    // ERC721 Mixin
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    // Ownable Mixin
    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        // Custom storage
        token_counter: u256,
        item_metadata: Map::<u256, ItemMetadata>,
        rental_history: Map::<u256, RentalHistory>,
        item_ratings: Map::<u256, Rating>,
        is_listed: Map::<u256, bool>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        ItemMinted: ItemMinted,
        ItemListed: ItemListed,
        ItemUnlisted: ItemUnlisted,
        ItemRated: ItemRated,
    }

    #[derive(Drop, starknet::Event)]
    struct ItemMinted {
        token_id: u256,
        owner: ContractAddress,
        category: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct ItemListed {
        token_id: u256,
        owner: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct ItemUnlisted {
        token_id: u256,
        owner: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct ItemRated {
        token_id: u256,
        rating: u8,
        rater: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        let name = "FashionSwap Items";
        let symbol = "FSWAP";
        let base_uri = "";

        self.erc721.initializer(name, symbol, base_uri);
        self.ownable.initializer(owner);
        self.token_counter.write(0);
    }

    #[abi(embed_v0)]
    impl FashionItemNFTImpl of super::IFashionItemNFT<ContractState> {
        fn mint_fashion_item(
            ref self: ContractState,
            to: ContractAddress,
            name: felt252,
            brand: felt252,
            category: felt252,
            size: felt252,
            color: felt252,
            image_uri: felt252,
            condition: u8,
            original_price: u256,
        ) -> u256 {
            let caller = get_caller_address();

            let token_id = self.token_counter.read() + 1;
            self.token_counter.write(token_id);

            // Mint NFT
            self.erc721.mint(to, token_id);

            // Store metadata
            let metadata = ItemMetadata {
                name,
                brand,
                category,
                size,
                color,
                image_uri,
                condition,
                original_price,
                carbon_footprint_saved: 0,
            };
            self.item_metadata.write(token_id, metadata);

            // Initialize rental history
            let history = RentalHistory {
                total_rentals: 0,
                total_days_rented: 0,
                last_rental_timestamp: 0,
                total_revenue: 0,
            };
            self.rental_history.write(token_id, history);

            // Initialize rating
            let rating = Rating {
                total_rating: 0,
                rating_count: 0,
            };
            self.item_ratings.write(token_id, rating);

            self.emit(ItemMinted { token_id, owner: to, category });

            token_id
        }

        fn list_item(ref self: ContractState, token_id: u256) {
            let caller = get_caller_address();
            let owner = self.erc721.owner_of(token_id);

            assert(caller == owner, 'Not token owner');
            assert(!self.is_listed.read(token_id), 'Already listed');

            self.is_listed.write(token_id, true);
            self.emit(ItemListed { token_id, owner: caller });
        }

        fn unlist_item(ref self: ContractState, token_id: u256) {
            let caller = get_caller_address();
            let owner = self.erc721.owner_of(token_id);

            assert(caller == owner, 'Not token owner');
            assert(self.is_listed.read(token_id), 'Not listed');

            self.is_listed.write(token_id, false);
            self.emit(ItemUnlisted { token_id, owner: caller });
        }

        fn rate_item(ref self: ContractState, token_id: u256, rating: u8) {
            assert(rating >= 1 && rating <= 5, 'Rating must be 1-5');

            let caller = get_caller_address();
            let mut current_rating = self.item_ratings.read(token_id);

            current_rating.total_rating += rating.into();
            current_rating.rating_count += 1;

            self.item_ratings.write(token_id, current_rating);
            self.emit(ItemRated { token_id, rating, rater: caller });
        }

        fn update_rental_stats(
            ref self: ContractState,
            token_id: u256,
            days_rented: u64,
            revenue: u256,
        ) {
            // This should only be called by the marketplace contract
            let mut history = self.rental_history.read(token_id);

            history.total_rentals += 1;
            history.total_days_rented += days_rented;
            history.last_rental_timestamp = get_block_timestamp();
            history.total_revenue += revenue;

            self.rental_history.write(token_id, history);

            // Update carbon footprint saved (rough estimate: 2kg CO2 per day of avoided new purchase)
            let mut metadata = self.item_metadata.read(token_id);
            metadata.carbon_footprint_saved += (days_rented.into() * 2000); // in grams
            self.item_metadata.write(token_id, metadata);
        }

        fn get_item_metadata(self: @ContractState, token_id: u256) -> ItemMetadata {
            self.item_metadata.read(token_id)
        }

        fn get_rental_history(self: @ContractState, token_id: u256) -> RentalHistory {
            self.rental_history.read(token_id)
        }

        fn get_item_rating(self: @ContractState, token_id: u256) -> (u64, u32) {
            let rating = self.item_ratings.read(token_id);
            (rating.total_rating, rating.rating_count)
        }

        fn is_item_listed(self: @ContractState, token_id: u256) -> bool {
            self.is_listed.read(token_id)
        }

        fn get_average_rating(self: @ContractState, token_id: u256) -> u64 {
            let rating = self.item_ratings.read(token_id);
            if rating.rating_count == 0 {
                return 0;
            }
            rating.total_rating / rating.rating_count.into()
        }
    }
}

#[starknet::interface]
trait IFashionItemNFT<TContractState> {
    fn mint_fashion_item(
        ref self: TContractState,
        to: ContractAddress,
        name: felt252,
        brand: felt252,
        category: felt252,
        size: felt252,
        color: felt252,
        image_uri: felt252,
        condition: u8,
        original_price: u256,
    ) -> u256;
    fn list_item(ref self: TContractState, token_id: u256);
    fn unlist_item(ref self: TContractState, token_id: u256);
    fn rate_item(ref self: TContractState, token_id: u256, rating: u8);
    fn update_rental_stats(
        ref self: TContractState,
        token_id: u256,
        days_rented: u64,
        revenue: u256,
    );
    fn get_item_metadata(self: @TContractState, token_id: u256) -> crate::fashion_item_nft::ItemMetadata;
    fn get_rental_history(self: @TContractState, token_id: u256) -> crate::fashion_item_nft::RentalHistory;
    fn get_item_rating(self: @TContractState, token_id: u256) -> (u64, u32);
    fn is_item_listed(self: @TContractState, token_id: u256) -> bool;
    fn get_average_rating(self: @TContractState, token_id: u256) -> u64;
}
