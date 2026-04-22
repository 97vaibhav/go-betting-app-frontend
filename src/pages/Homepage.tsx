import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import MatchCard from '../components/MatchCard';
import styles from './Homepage.module.css';
import { usePolling } from '../hooks/usePolling';

interface Event {
  event_id: string;
  home_team: string;
  away_team: string;
  competition: string;
  kick_off_time: string;
  status: string;
  home_score?: number;
  away_score?: number;
}

import { useAuthStore } from '../stores/useAuthStore';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Homepage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await apiClient('/odds/events', { params: { status: 'EVENT_STATUS_UPCOMING' } });
      setEvents(data.events || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  usePolling(fetchEvents, 30000);

  if (!isAuthenticated) {
    return (
      <div className={styles.welcomeContainer}>
        <div className={styles.welcomeCard}>
          <h1>Welcome to Bet365</h1>
          <p>Experience the world's most popular online sports betting platform.</p>
          <div className={styles.welcomeSubtext}>
            Please sign in or create an account to view live odds and start betting.
          </div>
          <div className={styles.welcomeActions}>
            <Link to="/login">
              <Button variant="primary" size="lg">SIGN IN</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg">JOIN NOW</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading && events.length === 0) {
    return <div className={styles.loading}>Loading matches...</div>;
  }

  if (error && events.length === 0) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1>Sports Betting</h1>
        <p>Featured Football Matches for {user?.full_name}</p>
      </header>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Upcoming Matches</h2>
        <div className={styles.matchGrid}>
          {events.map((event) => (
            <MatchCard
              key={event.event_id}
              eventId={event.event_id}
              homeTeam={event.home_team}
              awayTeam={event.away_team}
              competition={event.competition}
              time={new Date(event.kick_off_time).toLocaleString()}
              isLive={event.status === 'EVENT_STATUS_LIVE'}
              score={event.status === 'EVENT_STATUS_LIVE' ? { home: event.home_score || 0, away: event.away_score || 0 } : undefined}
              markets={[
                {
                  type: 'Full Time Result',
                  selections: [
                    { selectionId: `${event.event_id}-1`, name: '1', odds: '2.10' },
                    { selectionId: `${event.event_id}-x`, name: 'X', odds: '3.40' },
                    { selectionId: `${event.event_id}-2`, name: '2', odds: '3.25' }
                  ]
                }
              ]}
            />
          ))}
          {events.length === 0 && <p className={styles.noMatches}>No upcoming matches found.</p>}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
