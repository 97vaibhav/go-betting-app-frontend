import { create } from 'zustand';

interface Wallet {
  wallet_id: string;
  balance_cents: number;
  currency: string;
}

interface WalletState {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet) => void;
  updateBalance: (amountCents: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  setWallet: (wallet) => set({ wallet }),
  updateBalance: (amountCents) => 
    set((state) => ({
      wallet: state.wallet ? { ...state.wallet, balance_cents: amountCents } : null
    })),
}));
