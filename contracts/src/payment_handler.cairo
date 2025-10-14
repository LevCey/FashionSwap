#[starknet::contract]
mod PaymentHandler {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
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
        // Payment token (e.g., STRK or stablecoin address)
        payment_token: ContractAddress,
        // Chipi Pay integration address (placeholder for actual Chipi Pay contract)
        chipi_pay_gateway: ContractAddress,
        // Escrow balances
        escrow_balances: LegacyMap::<u256, EscrowPayment>,
        // Platform treasury
        platform_treasury: ContractAddress,
        // Withdrawal balances
        withdrawable_balances: LegacyMap::<ContractAddress, u256>,
        // Payment counter
        payment_counter: u256,
        // Ultra-low fee structure
        micro_payment_fee_bps: u256, // Even lower fee for micro-payments
        standard_fee_bps: u256,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct EscrowPayment {
        payment_id: u256,
        payer: ContractAddress,
        recipient: ContractAddress,
        amount: u256,
        security_deposit: u256,
        purpose: felt252, // 'rental', 'swap', etc.
        status: u8, // 0=pending, 1=completed, 2=refunded, 3=disputed
        created_at: u64,
        released_at: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
        PaymentCreated: PaymentCreated,
        PaymentReleased: PaymentReleased,
        PaymentRefunded: PaymentRefunded,
        DepositReturned: DepositReturned,
        WithdrawalMade: WithdrawalMade,
        MicroPaymentProcessed: MicroPaymentProcessed,
    }

    #[derive(Drop, starknet::Event)]
    struct PaymentCreated {
        payment_id: u256,
        payer: ContractAddress,
        recipient: ContractAddress,
        amount: u256,
        security_deposit: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct PaymentReleased {
        payment_id: u256,
        recipient: ContractAddress,
        amount: u256,
        fee: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct PaymentRefunded {
        payment_id: u256,
        payer: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct DepositReturned {
        payment_id: u256,
        payer: ContractAddress,
        deposit_amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct WithdrawalMade {
        user: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct MicroPaymentProcessed {
        payer: ContractAddress,
        recipient: ContractAddress,
        amount: u256,
        fee: u256,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        payment_token: ContractAddress,
        platform_treasury: ContractAddress,
    ) {
        self.ownable.initializer(owner);
        self.payment_token.write(payment_token);
        self.platform_treasury.write(platform_treasury);
        self.payment_counter.write(0);

        // Ultra-low fees for hackathon demo
        self.micro_payment_fee_bps.write(50); // 0.5% for payments under threshold
        self.standard_fee_bps.write(150); // 1.5% for larger payments
    }

    #[abi(embed_v0)]
    impl PaymentHandlerImpl of super::IPaymentHandler<ContractState> {
        // Create escrow payment for rental
        fn create_rental_payment(
            ref self: ContractState,
            recipient: ContractAddress,
            rental_amount: u256,
            security_deposit: u256,
        ) -> u256 {
            self.reentrancy_guard.start();

            let caller = get_caller_address();
            let total_amount = rental_amount + security_deposit;

            assert(rental_amount > 0, 'Amount must be positive');
            assert(recipient != caller, 'Cannot pay yourself');

            // In production, transfer tokens from caller to this contract
            // For hackathon demo, we'll skip actual token transfer

            let payment_id = self.payment_counter.read() + 1;
            self.payment_counter.write(payment_id);

            let escrow = EscrowPayment {
                payment_id,
                payer: caller,
                recipient,
                amount: rental_amount,
                security_deposit,
                purpose: 'rental',
                status: 0, // pending
                created_at: get_block_timestamp(),
                released_at: 0,
            };

            self.escrow_balances.write(payment_id, escrow);

            self.emit(PaymentCreated {
                payment_id,
                payer: caller,
                recipient,
                amount: rental_amount,
                security_deposit,
            });

            self.reentrancy_guard.end();
            payment_id
        }

        // Process micro-payment (Chipi Pay specialty)
        fn process_micro_payment(
            ref self: ContractState,
            recipient: ContractAddress,
            amount: u256,
        ) {
            self.reentrancy_guard.start();

            let caller = get_caller_address();

            assert(amount > 0, 'Amount must be positive');

            // Calculate ultra-low fee
            let fee_bps = if amount < 10_000_000_000_000_000_000 { // < 10 tokens (micro)
                self.micro_payment_fee_bps.read()
            } else {
                self.standard_fee_bps.read()
            };

            let fee = (amount * fee_bps) / 10000;
            let net_amount = amount - fee;

            // Update recipient balance
            let current_balance = self.withdrawable_balances.read(recipient);
            self.withdrawable_balances.write(recipient, current_balance + net_amount);

            // Update platform treasury balance
            let treasury = self.platform_treasury.read();
            let treasury_balance = self.withdrawable_balances.read(treasury);
            self.withdrawable_balances.write(treasury, treasury_balance + fee);

            self.emit(MicroPaymentProcessed {
                payer: caller,
                recipient,
                amount: net_amount,
                fee,
            });

            self.reentrancy_guard.end();
        }

        // Release payment to recipient (called when rental ends successfully)
        fn release_payment(ref self: ContractState, payment_id: u256) {
            self.reentrancy_guard.start();

            let mut escrow = self.escrow_balances.read(payment_id);

            assert(escrow.status == 0, 'Payment not pending');

            // Calculate fee
            let fee_bps = if escrow.amount < 10_000_000_000_000_000_000 {
                self.micro_payment_fee_bps.read()
            } else {
                self.standard_fee_bps.read()
            };

            let fee = (escrow.amount * fee_bps) / 10000;
            let net_amount = escrow.amount - fee;

            // Update balances
            let current_balance = self.withdrawable_balances.read(escrow.recipient);
            self.withdrawable_balances.write(escrow.recipient, current_balance + net_amount);

            let treasury = self.platform_treasury.read();
            let treasury_balance = self.withdrawable_balances.read(treasury);
            self.withdrawable_balances.write(treasury, treasury_balance + fee);

            // Update escrow status
            escrow.status = 1; // completed
            escrow.released_at = get_block_timestamp();
            self.escrow_balances.write(payment_id, escrow);

            self.emit(PaymentReleased {
                payment_id,
                recipient: escrow.recipient,
                amount: net_amount,
                fee,
            });

            self.reentrancy_guard.end();
        }

        // Return security deposit to renter
        fn return_deposit(ref self: ContractState, payment_id: u256) {
            self.reentrancy_guard.start();

            let mut escrow = self.escrow_balances.read(payment_id);

            assert(escrow.security_deposit > 0, 'No deposit to return');

            // Update payer balance
            let current_balance = self.withdrawable_balances.read(escrow.payer);
            self.withdrawable_balances.write(
                escrow.payer,
                current_balance + escrow.security_deposit
            );

            let deposit_amount = escrow.security_deposit;
            escrow.security_deposit = 0;
            self.escrow_balances.write(payment_id, escrow);

            self.emit(DepositReturned {
                payment_id,
                payer: escrow.payer,
                deposit_amount,
            });

            self.reentrancy_guard.end();
        }

        // Refund payment (if rental is cancelled before start)
        fn refund_payment(ref self: ContractState, payment_id: u256) {
            self.reentrancy_guard.start();

            let mut escrow = self.escrow_balances.read(payment_id);

            assert(escrow.status == 0, 'Cannot refund');

            let total_refund = escrow.amount + escrow.security_deposit;

            // Update payer balance
            let current_balance = self.withdrawable_balances.read(escrow.payer);
            self.withdrawable_balances.write(escrow.payer, current_balance + total_refund);

            escrow.status = 2; // refunded
            self.escrow_balances.write(payment_id, escrow);

            self.emit(PaymentRefunded {
                payment_id,
                payer: escrow.payer,
                amount: total_refund,
            });

            self.reentrancy_guard.end();
        }

        // Withdraw available balance
        fn withdraw(ref self: ContractState) -> u256 {
            self.reentrancy_guard.start();

            let caller = get_caller_address();
            let balance = self.withdrawable_balances.read(caller);

            assert(balance > 0, 'No balance to withdraw');

            self.withdrawable_balances.write(caller, 0);

            // In production, transfer tokens to caller
            // For hackathon demo, we'll skip actual token transfer

            self.emit(WithdrawalMade {
                user: caller,
                amount: balance,
            });

            self.reentrancy_guard.end();
            balance
        }

        fn get_escrow_payment(self: @ContractState, payment_id: u256) -> EscrowPayment {
            self.escrow_balances.read(payment_id)
        }

        fn get_withdrawable_balance(self: @ContractState, user: ContractAddress) -> u256 {
            self.withdrawable_balances.read(user)
        }

        fn get_fee_structure(self: @ContractState) -> (u256, u256) {
            (self.micro_payment_fee_bps.read(), self.standard_fee_bps.read())
        }

        fn set_chipi_pay_gateway(ref self: ContractState, gateway: ContractAddress) {
            self.ownable.assert_only_owner();
            self.chipi_pay_gateway.write(gateway);
        }

        fn get_chipi_pay_gateway(self: @ContractState) -> ContractAddress {
            self.chipi_pay_gateway.read()
        }
    }
}

#[starknet::interface]
trait IPaymentHandler<TContractState> {
    fn create_rental_payment(
        ref self: TContractState,
        recipient: ContractAddress,
        rental_amount: u256,
        security_deposit: u256,
    ) -> u256;
    fn process_micro_payment(
        ref self: TContractState,
        recipient: ContractAddress,
        amount: u256,
    );
    fn release_payment(ref self: TContractState, payment_id: u256);
    fn return_deposit(ref self: TContractState, payment_id: u256);
    fn refund_payment(ref self: TContractState, payment_id: u256);
    fn withdraw(ref self: TContractState) -> u256;
    fn get_escrow_payment(self: @TContractState, payment_id: u256) -> PaymentHandler::EscrowPayment;
    fn get_withdrawable_balance(self: @TContractState, user: ContractAddress) -> u256;
    fn get_fee_structure(self: @TContractState) -> (u256, u256);
    fn set_chipi_pay_gateway(ref self: TContractState, gateway: ContractAddress);
    fn get_chipi_pay_gateway(self: @TContractState) -> ContractAddress;
}
