import React, { useState, useEffect } from 'react';
import './DynamicContentSection.css';

const DynamicContentSection = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from API
    setTimeout(() => {
      setEvents([
        { id: 1, title: 'Champions League', description: 'Bet on the biggest European football clubs competing for the title.', details: 'Final match on June 1st' },
        { id: 2, title: 'NBA Finals', description: 'Place your stakes on the thrilling basketball finale of the year.', details: 'Series starts on May 30th' },
        { id: 3, title: 'Grand Slam Tennis', description: 'Predict the winners of the most prestigious tennis tournaments.', details: 'Next tournament: Wimbledon, starting July 1st' },
        { id: 4, title: 'Esports Championship', description: 'Join the excitement of esports and bet on your favorite teams and players.', details: 'International finals in August' },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="dynamic-content">
      <h2>Upcoming Betting Events</h2>
      {isLoading ? (
        <p>Loading upcoming events...</p>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-card-inner">
                <div className="event-card-front">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
                <div className="event-card-back">
                  <h4>Details</h4>
                  <p>{event.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DynamicContentSection;
