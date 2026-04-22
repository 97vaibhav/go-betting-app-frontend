import React from 'react';
import styles from './MatchCard.module.css';
import { Clock } from 'lucide-react';
import { useBetSlipStore } from '../stores/useBetSlipStore';

interface MatchCardProps {
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  time: string;
  isLive?: boolean;
  score?: { home: number; away: number };
  markets: {
    type: string;
    selections: { selectionId: string; name: string; odds: string }[];
  }[];
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  eventId,
  homeTeam, 
  awayTeam, 
  competition, 
  time, 
  isLive = false,
  score,
  markets 
}) => {
  const { addSelection, selections } = useBetSlipStore();

  const isSelected = (selectionId: string) => 
    selections.some(s => s.selection_id === selectionId);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.competition}>{competition}</span>
        <div className={`${styles.time} ${isLive ? styles.live : ''}`}>
          {isLive ? (
            <>
              <span className={styles.liveIndicator}>LIVE</span>
              <span className={styles.score}>{score?.home} - {score?.away}</span>
            </>
          ) : (
            <>
              <Clock size={14} />
              <span>{time}</span>
            </>
          )}
        </div>
      </div>

      <div className={styles.teams}>
        <div className={styles.team}>{homeTeam}</div>
        <div className={styles.team}>{awayTeam}</div>
      </div>

      <div className={styles.markets}>
        {markets.map((market, idx) => (
          <div key={idx} className={styles.market}>
            <div className={styles.marketTitle}>{market.type}</div>
            <div className={styles.selections}>
              {market.selections.map((sel, sIdx) => (
                <button 
                  key={sIdx} 
                  className={`${styles.selectionBtn} ${isSelected(sel.selectionId) ? styles.active : ''}`}
                  onClick={() => addSelection({
                    selection_id: sel.selectionId,
                    event_id: eventId,
                    market_type: market.type,
                    selection_name: sel.name,
                    odds_decimal: sel.odds,
                    event_name: `${homeTeam} vs ${awayTeam}`
                  })}
                >
                  <span className={styles.selectionName}>{sel.name}</span>
                  <span className={styles.odds}>{sel.odds}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchCard;
