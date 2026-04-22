import React, { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useWalletStore } from '../stores/useWalletStore';
import { apiClient } from '../api/apiClient';
import Button from '../components/Button';
import styles from './Wallet.module.css';
import { Wallet as WalletIcon, History } from 'lucide-react';

const WalletPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { wallet, updateBalance } = useWalletStore();
  const [amount, setAmount] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleDeposit = async () => {
    if (!isAuthenticated || !user) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const amountCents = parseFloat(amount) * 100;
      await apiClient('/wallet/credit', {
        method: 'POST',
        body: JSON.stringify({
          user_id: user.user_id,
          amount_cents: amountCents,
          reference_id: crypto.randomUUID(),
          reference_type: 'REFERENCE_TYPE_DEPOSIT',
          description: 'User Deposit'
        }),
      });

      const walletData = await apiClient(`/wallet/balance/${user.user_id}`);
      updateBalance(walletData.wallet.real_balance_cents);
      
      setMessage({ type: 'success', text: `Successfully deposited ₹${amount}` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Deposit failed' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return <div className={styles.container}>Please login to access your wallet.</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>My Wallet</h1>
        <p>Manage your funds and view transaction history</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.balanceCard}>
          <div className={styles.cardHeader}>
            <WalletIcon size={24} color="var(--brand-primary)" />
            <span>Available Balance</span>
          </div>
          <div className={styles.balanceValue}>
            ₹{((wallet?.balance_cents || 0) / 100).toFixed(2)}
          </div>
          <div className={styles.currency}>{wallet?.currency || 'INR'}</div>
        </div>

        <div className={styles.actionCard}>
          <h3>Quick Deposit</h3>
          <p>Add funds to your account instantly</p>
          
          <div className={styles.depositInput}>
            <span>₹</span>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="0.00"
            />
          </div>

          <div className={styles.presets}>
            {['500', '1000', '2000', '5000'].map(p => (
              <button key={p} onClick={() => setAmount(p)} className={amount === p ? styles.active : ''}>
                ₹{p}
              </button>
            ))}
          </div>

          <Button variant="primary" fullWidth size="lg" onClick={handleDeposit} disabled={loading}>
            {loading ? 'Processing...' : 'DEPOSIT NOW'}
          </Button>

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      <div className={styles.transactionsSection}>
        <div className={styles.sectionHeader}>
          <History size={20} />
          <h2>Recent Transactions</h2>
        </div>
        <div className={styles.emptyTransactions}>
          <p>No transactions found in the last 30 days.</p>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
