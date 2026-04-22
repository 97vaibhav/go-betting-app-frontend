import React, { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BetSlip from '@/components/BetSlip';
import styles from './MainLayout.module.css';
import { useAuthStore } from '../stores/useAuthStore';
import { useWalletStore } from '../stores/useWalletStore';
import { apiClient } from '../api/apiClient';
import { usePolling } from '../hooks/usePolling';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { setWallet } = useWalletStore();

  const fetchWallet = async () => {
    if (isAuthenticated && user) {
      try {
        const data = await apiClient(`/wallet/balance/${user.user_id}`);
        setWallet(data.wallet);
      } catch (err) {
        console.error('Failed to sync wallet:', err);
      }
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [isAuthenticated, user?.user_id]);

  usePolling(fetchWallet, 10000, [isAuthenticated, user?.user_id]);

  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.mainContent}>
          {children}
        </main>
        {isAuthenticated && <BetSlip />}
      </div>
    </div>
  );
};

export default MainLayout;
