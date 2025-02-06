import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';

const Leaderboard = ({}, ref) => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get('https://script.googleusercontent.com/macros/echo?user_content_key=V7klmfPn7gv44-eqPFg_IHg0gvDP0EwbPmdeiLPfT-mQYiExCTWArT4ZWDh090w4gXNTVckDWVovXFo3vZegD1ah1ABrcsxHm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnJAijG8b6opCXNZwIk_Tqi15mqIi28X9n96YzYkApW6niDGK7do12PVMbIqqFMbiFdIy5ocxsTPO2roF23zxq-dKoSOdad6tfw&lib=MtT1SYepJgWz2CdakqnTTjJ2JNqGx101o');
        const filteredData = response.data.filter(entry => entry.every(field => field !== "")).slice(0, 5);
        setLeaderboardData(filteredData);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div ref={el => ref.current = { ...ref.current, leaderboard: el }}>
      <div className='Page Leaderboard'>
        <h1>Top Workshop Attendees</h1>
        <div style={styles.leaderboard}>
          <div style={styles.labels}>
            <h2 className="disclaimer">Name</h2>
            <h2 className="disclaimer">Number of Workshops Attended</h2>
          </div>
          {leaderboardData.map((entry, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                backgroundColor: index % 2 === 0 ? '#4da99e' : '#F07167',
              }}
            >
              <div style={styles.name}>{entry[0]} {entry[1]}</div>
              <div style={styles.attendance}>{entry[2]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  leaderboard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  labels: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '80%',
    padding: '0.5rem 2rem',
    fontWeight: 'bold',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    margin: '0.5rem 0',
    borderRadius: '15px',
    width: '80%',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px',
  },
  name: {
    fontSize: '1.2rem',
  },
  attendance: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
};

export default forwardRef(Leaderboard);