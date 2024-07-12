import React, { useState } from 'react';

import StandingsWidget from '../components/StandingsWidget';
import FixtureStatisticsWidget from '../components/FixtureStatisticsWidget';

function StandingsPage() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [season, setSeason] = useState('');

  const handleTeamSelect = (teamId, seasonYear) => {
    setSelectedTeam(teamId);
    setSeason(seasonYear);
  };

  return (
    <>
      <main className="StandingsPage">
        <StandingsWidget onTeamSelect={handleTeamSelect} />
        {selectedTeam && <FixtureStatisticsWidget teamId={selectedTeam} season={season} />}
      </main>
    </>
  );
};

export default StandingsPage;
