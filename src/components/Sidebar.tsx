import React from 'react';
import styles from './Sidebar.module.css';
import { Home, Trophy, Calendar, Clock, History, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <Home size={20} />, label: 'Homepage', path: '/' },
    { icon: <Trophy size={20} />, label: 'Competitions', path: '/competitions' },
    { icon: <Clock size={20} />, label: 'Live Events', path: '/live' },
    { icon: <Calendar size={20} />, label: 'Upcoming', path: '/upcoming' },
    { icon: <History size={20} />, label: 'My Bets', path: '/history' },
  ];

  const bottomItems = [
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    { icon: <LogOut size={20} />, label: 'Logout', path: '/logout' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.navGroup}>
        <div className={styles.groupTitle}>NAVIGATION</div>
        {menuItems.map((item) => (
          <NavLink 
            key={item.label} 
            to={item.path} 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className={styles.navGroup}>
        <div className={styles.groupTitle}>POPULAR LEAGUES</div>
        <div className={styles.navItem}><span>Premier League</span></div>
        <div className={styles.navItem}><span>La Liga</span></div>
        <div className={styles.navItem}><span>Champions League</span></div>
        <div className={styles.navItem}><span>Serie A</span></div>
      </div>

      <div className={styles.sidebarFooter}>
        {bottomItems.map((item) => (
          <NavLink 
            key={item.label} 
            to={item.path} 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
