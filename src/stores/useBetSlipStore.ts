import { create } from 'zustand';

export interface Selection {
  selection_id: string;
  event_id: string;
  market_type: string;
  selection_name: string;
  odds_decimal: string;
  event_name: string;
}

interface BetSlipState {
  selections: Selection[];
  stakeCents: number;
  addSelection: (selection: Selection) => void;
  removeSelection: (selectionId: string) => void;
  clearSlip: () => void;
  setStake: (cents: number) => void;
  calculateTotalOdds: () => string;
  calculatePotentialReturn: () => string;
}

export const useBetSlipStore = create<BetSlipState>((set, get) => ({
  selections: [],
  stakeCents: 0,
  addSelection: (selection) => {
    const exists = get().selections.some(s => s.selection_id === selection.selection_id);
    if (!exists) {
      set((state) => ({ selections: [...state.selections, selection] }));
    }
  },
  removeSelection: (selectionId) => 
    set((state) => ({ selections: state.selections.filter(s => s.selection_id !== selectionId) })),
  clearSlip: () => set({ selections: [], stakeCents: 0 }),
  setStake: (cents) => set({ stakeCents: cents }),
  calculateTotalOdds: () => {
    const odds = get().selections.reduce((acc, s) => acc * parseFloat(s.odds_decimal), 1);
    return odds.toFixed(2);
  },
  calculatePotentialReturn: () => {
    const totalOdds = parseFloat(get().calculateTotalOdds());
    const payoutRaw = get().stakeCents * totalOdds;
    return (payoutRaw / 100).toFixed(2);
  }
}));
