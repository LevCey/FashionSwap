import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contract, Provider, Account } from 'starknet';

interface StarknetContextType {
  account: Account | null;
  provider: Provider;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const StarknetContext = createContext<StarknetContextType | null>(null);

export const useStarknet = () => {
  const context = useContext(StarknetContext);
  if (!context) {
    throw new Error('useStarknet must be used within StarknetProvider');
  }
  return context;
};

export const StarknetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [connected, setConnected] = useState(false);

  // Initialize provider (Starknet testnet for demo)
  const provider = new Provider({
    sequencer: {
      network: 'goerli-alpha',
    },
  });

  const connect = async () => {
    try {
      // In production, use get-starknet or wallet connection
      // For hackathon demo, this would connect to user's wallet
      console.log('Connecting to Starknet wallet...');

      // Mock connection for demo
      setConnected(true);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setConnected(false);
  };

  return (
    <StarknetContext.Provider
      value={{
        account,
        provider,
        connected,
        connect,
        disconnect,
      }}
    >
      {children}
    </StarknetContext.Provider>
  );
};
