import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FixtureStatisticsWidget.css';

const FixtureStatisticsWidget = ({ teamId, season }) => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [betData, setBetData] = useState({});
  const [showBet, setShowBet] = useState({});

  useEffect(() => {
    const fetchFixtures = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { team: teamId, season };
        const headers = {
          'X-RapidAPI-Key': '9267743386msh92e5f024d603044p153caajsn907045c73b07',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        };
        const fixtureResponse = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', { params, headers });
        const statsPromises = fixtureResponse.data.response.map(fixture =>
          axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics`, { params: { fixture: fixture.fixture.id }, headers })
        );

        const statsResponses = await Promise.all(statsPromises);
        const enrichedFixtures = fixtureResponse.data.response.map((fixture, index) => ({
          ...fixture,
          stats: statsResponses[index].data.response
        }));

        if (enrichedFixtures.length > 0) {
          setFixtures(enrichedFixtures);
        } else {
          setError('No fixtures found for this team in the selected season.');
          setFixtures([]);
        }
      } catch (error) {
        console.error('Error fetching fixtures:', error);
        setError('Failed to fetch fixtures');
      } finally {
        setLoading(false);
      }
    };

    if (teamId && season) {
      fetchFixtures();
    }
  }, [teamId, season]);

  const fetchBettingOdds = async (fixtureId) => {
    if (showBet[fixtureId]) {
      setShowBet(prev => ({ ...prev, [fixtureId]: false }));
      return;
    }

    setLoading(true);
    try {
      const params = { fixture: fixtureId };
      const headers = {
        'X-RapidAPI-Key': '9267743386msh92e5f024d603044p153caajsn907045c73b07',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      };
      const { data } = await axios.get('https://api-football-v1.p.rapidapi.com/v3/odds', { params, headers });

      if (data.response && data.response.length > 0) {
        setBetData(prev => ({ ...prev, [fixtureId]: data.response[0].bookmakers[0].bets }));
        setShowBet(prev => ({ ...prev, [fixtureId]: true }));
      } else {
        setBetData(prev => ({ ...prev, [fixtureId]: [] }));
        setShowBet(prev => ({ ...prev, [fixtureId]: true }));  // Show empty data message
      }
    } catch (error) {
      console.error('Error fetching betting odds:', error);
      setBetData(prev => ({ ...prev, [fixtureId]: [] }));
      setShowBet(prev => ({ ...prev, [fixtureId]: false }));
    } finally {
      setLoading(false);
    }
  };
  // Group fixtures by date
  const groupedFixtures = fixtures.reduce((group, fixture) => {
    const date = new Date(fixture.fixture.date).toLocaleDateString();
    if (!group[date]) {
      group[date] = [];
    }
    group[date].push(fixture);
    return group;
  }, {});
  return (
    <div className="FixtureStatisticsWidget">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {Object.entries(groupedFixtures).map(([date, fixtures]) => (
        <div key={date} className="date-section">
          <h2 className="date-heading">{date}</h2>
          <div className="fixtures-container">
            {fixtures.map((fixture, index) => (
              <div key={index} className="fixture-card">
                <div className="fixture-date">{fixture.fixture.date}</div>
                <div className="fixture-match">
                  <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} />
                  <span>{fixture.teams.home.name} vs {fixture.teams.away.name}</span>
                  <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} />
                </div>
                <div className="fixture-status">{fixture.fixture.status.long}</div>
                <div className="fixture-goals">{`Goals Home: ${fixture.goals.home} - Away: ${fixture.goals.away}`}</div>
                <button onClick={() => fetchBettingOdds(fixture.fixture.id)}>Show Bets</button>
                {showBet[fixture.fixture.id] && betData[fixture.fixture.id] && (
                  <div className='bet-cards-container'> 
                <h2>Understanding Betting and Its Risks</h2>
                <p>Betting can be an engaging pastime, but it's crucial to understand the financial and emotional risks involved. Unlike investments, the odds in betting are often skewed in favor of the 'house', meaning the chance of long-term profit is low.</p>
                <p>Consider the sheer number of betting options presented here. While they provide the illusion of choice and control, every option is carefully calculated to ensure the house has the edge. It's a business, and like all businesses, it aims to make a profit.</p>
                <p>The attractive odds you see? They're designed to tempt you into playing. The lower the odds, the less likely the outcome—but the bigger the promise of a reward, which often leads to riskier bets and potential losses.</p>
                <p>Financially, regular betting can be akin to chasing losses with more losses. It's important to only bet what you can afford to lose and to view betting as a form of entertainment rather than a genuine way to make money.</p>
                <p>Think about why you're tempted to bet. Is it for the thrill? The chance of winning big? These are powerful motivators, but they can also cloud judgment and lead to decisions that one might not make under different circumstances.</p>
                <p>Let's talk about 'gambler’s fallacy'—the belief that past events can influence future outcomes in random processes. No matter how many times you flip a coin, the chances of it landing on heads are always 50/50. Similarly, past wins or losses do not change your odds of winning in the future.</p>
                <p>Remember that the responsibility of betting lies with you. The most important bet is deciding when to play and when to walk away. It's essential to have a strategy and a budget in place before engaging in any betting activity.</p>
                <p>Be mindful of the signs of problem gambling: spending more than you can afford, borrowing money to bet, and betting impacting your daily life and relationships. There are resources available to help, and it's important to seek support if needed.</p>
                <p>Knowledge is power. The more you understand how betting works, the better you can manage the risks. Always approach betting with caution, and never let it get out of control.</p>
                <p>If you do choose to bet, do so wisely. Set limits, stick to them, and never let betting become a compulsion. It's not just about the money—it's about making sure that a pastime doesn't become a problem.</p>
                {betData[fixture.fixture.id].length > 0 ? betData[fixture.fixture.id].map((betCategory) => (
                      <div key={betCategory.id} className='bet-card'>
                        <div className='bet-category'>{betCategory.name}</div>
                        <div className='bet-values'>
                          {betCategory.values.map((bet, index) => (
                            <div key={index} className='bet-value'>
                              <span>{bet.value}</span> <span className='odds'>{bet.odd}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )) : <div>No betting data available.</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FixtureStatisticsWidget;