import React from 'react';
import Slider from 'react-slick';
import './FeaturesSlideshow.css'; 

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
};

const FeaturesSlideshow = ({ sections }) => {
  return (
    <div className="feature-slideshow">
      <Slider {...settings}>
        {sections.map((section, idx) => (
          <div key={idx}>
            <h2>{section.league}</h2>
            <div className="matches-container">
              {section.matches.map((match, index) => (
                <div key={index} className="match-card">
                  <div className="team-info">
                    <span className="team-name">{match.homeTeam}</span>
                    <span className="versus">vs</span>
                    <span className="team-name">{match.awayTeam}</span>
                  </div>
                  <div className="match-details">
                    <span className="match-date">{match.date}</span>
                    <div className="odds-container">
                      <span className="odds">{match.oddsHome}</span>
                      <span className="odds">{match.oddsDraw}</span>
                      <span className="odds">{match.oddsAway}</span>
                    </div>
                  </div>
                  <button className="bet-button">Bet Now</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturesSlideshow;
