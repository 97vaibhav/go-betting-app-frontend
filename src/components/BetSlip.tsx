import React, { useState } from 'react';
import styles from './BetSlip.module.css';
import { Trash2, AlertCircle, Loader2 } from 'lucide-react';
import Button from './Button';
import { useBetSlipStore } from '../stores/useBetSlipStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useWalletStore } from '../stores/useWalletStore';
import { apiClient } from '../api/apiClient';

const BetSlip: React.FC = () => {
  const { 
    selections, 
    removeSelection, 
    stakeCents, 
    setStake, 
    calculateTotalOdds, 
    calculatePotentialReturn,
    clearSlip
  } = useBetSlipStore();

  const { user, isAuthenticated } = useAuthStore();
  const { updateBalance } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalOdds = calculateTotalOdds();
  const potentialPayout = calculatePotentialReturn();

  const handlePlaceBet = async () => {
    if (!isAuthenticated) {
      setError('Please login to place a bet');
      return;
    }

    if (stakeCents <= 0) {
      setError('Please enter a valid stake');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const betData = {
        user_id: user?.user_id,
        bet_type: selections.length > 1 ? 'BET_TYPE_ACCUMULATOR' : 'BET_TYPE_SINGLE',
        total_stake_cents: stakeCents,
        idempotency_key: crypto.randomUUID(),
        legs: selections.map(s => ({
          selection_id: s.selection_id,
          event_id: s.event_id,
          market_type: s.market_type,
          stake_cents: selections.length === 1 ? stakeCents : Math.floor(stakeCents / selections.length)
        }))
      };

      await apiClient('/betting/place', {
        method: 'POST',
        body: JSON.stringify(betData),
      });

      // Refresh balance after bet
      const walletData = await apiClient(`/wallet/balance/${user?.user_id}`);
      updateBalance(walletData.wallet.real_balance_cents);

      setSuccess(true);
      setTimeout(() => {
        clearSlip();
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className={styles.betslip}>
      <div className={styles.header}>
        <div className={styles.title}>BET SLIP</div>
        {selections.length > 0 && <span className={styles.count}>{selections.length}</span>}
      </div>

      <div className={styles.content}>
        {success ? (
          <div className={styles.successState}>
            <h3>Bet Placed!</h3>
            <p>Your bet has been recorded successfully.</p>
          </div>
        ) : selections.length === 0 ? (
          <div className={styles.emptyState}>
            <AlertCircle size={40} />
            <p>Your bet slip is empty</p>
            <span>Click on odds to add selections</span>
          </div>
        ) : (
          <div className={styles.selectionsList}>
            {error && <div className={styles.errorBanner}>{error}</div>}
            {selections.map((sel) => (
              <div key={sel.selection_id} className={styles.selectionItem}>
                <div className={styles.selectionHeader}>
                  <div className={styles.selectionDetails}>
                    <span className={styles.outcomeName}>{sel.selection_name}</span>
                    <span className={styles.marketName}>{sel.market_type}</span>
                  </div>
                  <div className={styles.odds}>{sel.odds_decimal}</div>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => removeSelection(sel.selection_id)}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className={styles.eventName}>{sel.event_name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selections.length > 0 && !success && (
        <div className={styles.footer}>
          <div className={styles.summaryRow}>
            <span>Total Odds</span>
            <span className={styles.totalOdds}>{totalOdds}</span>
          </div>
          <div className={styles.stakeInput}>
            <span>Stake (₹)</span>
            <input 
              type="number" 
              value={(stakeCents / 100)} 
              onChange={(e) => setStake(parseFloat(e.target.value) * 100 || 0)}
              disabled={loading}
            />
          </div>
          <div className={styles.summaryRow}>
            <span>To Return</span>
            <span className={styles.potentialReturn}>₹{potentialPayout}</span>
          </div>
          <Button 
            variant="primary" 
            fullWidth 
            size="lg" 
            className={styles.placeBetBtn}
            onClick={handlePlaceBet}
            disabled={loading}
          >
            {loading ? <Loader2 className={styles.spinner} /> : 'PLACE BET'}
          </Button>
        </div>
      )}
    </aside>
  );
};

export default BetSlip;
