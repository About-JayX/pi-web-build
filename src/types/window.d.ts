import { PublicKey } from '@solana/web3.js';

interface SolanaProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  publicKey: {
    toString(): string;
  };
  connect(): Promise<{ publicKey: PublicKey }>;
  disconnect(): Promise<void>;
  signMessage(message: Uint8Array, encoding: string): Promise<{
    signature: Uint8Array;
    publicKey: PublicKey;
  }>;
}

declare global {
  interface Window {
    // Phantom 钱包
    solana?: SolanaProvider;
    
    // Solflare 钱包
    solflare?: SolanaProvider;
    
    // OKX 钱包
    okxwallet?: SolanaProvider;
    
    // Bitget 钱包
    bitkeep?: SolanaProvider;
  }
}

export {}; 