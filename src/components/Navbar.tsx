import React from 'react';
import styles from './Navbar.module.css';
import { Search, User, Wallet, Bell } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useWalletStore } from '../stores/useWalletStore';

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { wallet } = useWalletStore();
  
  const balance = wallet?.balance_cents ?? 0;
  const userName = user?.full_name ?? 'Guest';

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>BET365<span>CLONE</span></div>
      </div>
      
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Search size={18} />
          <input type="text" placeholder="Search for matches, teams or players..." />
        </div>
      </div>
      
      <div className={styles.userSection}>
        {isAuthenticated ? (
          <>
            <div className={styles.balanceInfo}>
              <Wallet size={18} className={styles.icon} />
              <span className={styles.balance}>₹{(balance / 100).toFixed(2)}</span>
            </div>
            <div className={styles.notifications}>
              <Bell size={20} />
              <span className={styles.badge}>2</span>
            </div>
            <div className={styles.profile}>
              <span className={styles.userName}>{userName}</span>
              <div className={styles.avatar}>
                <User size={20} />
              </div>
            </div>
          </>
        ) : (
          <div className={styles.authButtons}>
            <button className={styles.loginBtn}>Log In</button>
            <button className={styles.joinBtn}>Join</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
