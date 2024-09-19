import React from 'react';
import './FeatureSection.css';
const FeatureSection = () => (
    <section className="features">
      <h2>Our Top Betting Features</h2>
      <div className="feature-grid">
        <div className="feature">   
          <h3>Live Betting</h3>
          <p>Engage in the excitement with real-time betting as the action unfolds during the game.</p>
        </div>
        <div className="feature">
          <h3>Fantasy Leagues</h3> 
          <p>Create your dream team and compete in various fantasy leagues to win big.</p>
        </div>
        <div className="feature">
          <h3>Player Performance Bets</h3>
          <p>Place your bets on player performances. Predict who will be the top scorer, assist leader, and more.</p>
        </div>
        <div className="feature">
          <h3>Accumulator Bets</h3>
          <p>Boost your winnings by placing accumulator bets on multiple games and events.</p>
        </div>
        <div className="feature">
          <h3>Virtual Sports Betting</h3>
          <p>Try your luck betting on virtual sports with fast-paced action and quick outcomes.</p>
        </div>
        <div className="feature">
          <h3>Expert Tips & Analysis</h3>
          <p>Gain insights from experts with our in-depth analysis and betting tips for upcoming games.</p>
        </div>
        <div className="feature">
          <h3>Secure Transactions</h3>
          <p>Experience safe and secure financial transactions with our encrypted payment system.</p>
        </div>
        <div className="feature">
          <h3>24/7 Support</h3>
          <p>Our dedicated customer service team is available around the clock to assist you with any inquiries.</p>
        </div>
      </div>
    </section>
  );
  
  export default FeatureSection;
