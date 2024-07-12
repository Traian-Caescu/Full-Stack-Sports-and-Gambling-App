import React, { useState } from 'react';
import axios from 'axios';
import './StandingsWidget.css';
const StandingsWidget = ({ onTeamSelect }) => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [season, setSeason] = useState('');

  const fetchStandings = async () => {
    if (!season) {
      setError('Please enter a valid season.');
      setStandings([]);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get('https://api-football-v1.p.rapidapi.com/v3/standings', {
        params: { league: '39', season },
        headers: {
            'X-RapidAPI-Key': '',
            'X-RapidAPI-Host': ''
          }
        });

      if (data && data.results > 0) {
        setStandings(data.response[0].league.standings[0]);
      } else {
        setError(`No data found for the ${season} season.`);
        setStandings([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response ? err.response.data.message : 'Failed to fetch data');
      setStandings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="containerStandings">
      <h1>Premier League Standings</h1>
      <input
        type="text"
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        placeholder="Enter Season Year (e.g., 2023)"
      />
      <button onClick={fetchStandings}>Load Standings</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Club</th>
            <th>Played</th>
            <th>Won</th>
            <th>Drawn</th>
            <th>Lost</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={index} onClick={() => onTeamSelect(team.team.id, season)}>
              <td>{team.rank}</td>
              <td><img src={team.team.logo} alt={team.team.name} />{team.team.name}</td>
              <td>{team.all.played}</td>
              <td>{team.all.win}</td>
              <td>{team.all.draw}</td>
              <td>{team.all.lose}</td>
              <td>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsWidget;
