import React from 'react';
import { auth } from "../firebase-config.js";
import { signOut } from "firebase/auth";
import Footer from '../Extras/Footer';
import NavigationBar from '../Extras/NavigationBar';
import Cookies from "universal-cookie";
import './AppWrapper.css';
import Slideshow from '../Slideshow';
import FeatureSection from '../FeatureSection';
import DynamicContentSection from '../DynamicContentSection';
import ContactInfo from '../AboutUs/ContactInfo';
import FAQ from '../FAQ';
import FeaturesSlideshow from '../FeaturesSlideshow';
import StandingsPage from '../Football/StandingsPage.js'; 
import AboutUsPage from '../AboutUs/AboutUsPage';
import ChatPage from '../Chat/ChatPage';
import SlotMachine from '../Slots/SlotMachine';
import Roulette from '../Roulette/Roulette';
import AdminPage from '../AdminPage';
import StandingsWidget from './StandingsWidget'
import FixtureStatisticsWidget from './FixtureStatisticsWidget';
import UnderstandingAddictionPage from '../UnderstandingAddictionPage'; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
const cookies = new Cookies();
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const AppWrapper = ({ children, isAuth, setIsAuth, setIsInChat }) => {
  const signUserOut = async () => {
    await signOut(auth); // Sign out from Firebase authentication
    cookies.remove("auth-token"); // Remove the authentication token from cookies
    setIsAuth(false); // Update the authentication state to false
    setIsInChat(false); // Update the chat state to false
  };
  const slideImages = [
    'https://e0.365dm.com/19/01/2048x1152/skysports-rafael-nadal-novak-djokovic_4556818.jpg?20190125124546',
    'https://www.zetbet.com/media/Blog/2022/April-22/Football-Betting-tips.jpg',
    'https://media.newyorker.com/photos/5f52608d704116b9739db5c9/16:9/w_2559,h_1439,c_limit/Thomas-NBAMLBStrikes.jpg',
  ];
  
  const sections = [
    {
      league: 'Premier League',
      matches: [
        {
          date: 'Sat 10 Feb 15:00',
          homeTeam: 'Liverpool',
          awayTeam: 'Manchester United',
          oddsHome: '2/3',
          oddsDraw: '3/1',
          oddsAway: '4/1',
        },
        {
          date: 'Sun 11 Feb 17:30',
          homeTeam: 'Chelsea',
          awayTeam: 'Arsenal',
          oddsHome: '5/4',
          oddsDraw: '2/1',
          oddsAway: '3/2',
        },
        {
          date: 'Mon 12 Feb 20:00',
          homeTeam: 'Tottenham',
          awayTeam: 'Leicester City',
          oddsHome: '6/5',
          oddsDraw: '9/4',
          oddsAway: '1/1',
        },
      ],
    },
    {
      league: 'NBA',
      matches: [
        {
          date: 'Tue 13 Feb 19:00',
          homeTeam: 'LA Lakers',
          awayTeam: 'Boston Celtics',
          oddsHome: '1/3',
          oddsDraw: 'N/A', 
          oddsAway: '3/1',
        },
        {
          date: 'Wed 14 Feb 20:30',
          homeTeam: 'Golden State Warriors',
          awayTeam: 'Chicago Bulls',
          oddsHome: '9/7',
          oddsDraw: 'N/A',
          oddsAway: '5/4',
        },
        {
          date: 'Thu 15 Feb 18:00',
          homeTeam: 'Miami Heat',
          awayTeam: 'New York Knicks',
          oddsHome: '4/6',
          oddsDraw: 'N/A',
          oddsAway: '6/5',
        },
      ],
    },
    {
      league: 'eSports - League of Legends',
      matches: [
        {
          date: 'Fri 16 Feb 15:00',
          homeTeam: 'Cloud9',
          awayTeam: 'Team Liquid',
          oddsHome: '2/5',
          oddsDraw: '5/2',
          oddsAway: '7/2',
        },
        {
          date: 'Sat 17 Feb 16:00',
          homeTeam: 'Fnatic',
          awayTeam: 'G2 Esports',
          oddsHome: '1/1',
          oddsDraw: '11/4',
          oddsAway: '3/1',
        },
        {
          date: 'Sun 18 Feb 17:00',
          homeTeam: 'T1',
          awayTeam: 'DWG KIA',
          oddsHome: '13/8',
          oddsDraw: '2/1',
          oddsAway: '5/4',
        },
      ],
    },
    {
      league: 'Grand Slam Tennis',
      matches: [
        {
          date: 'Mon 19 Feb 13:00',
          homeTeam: 'Novak Djokovic',
          awayTeam: 'Rafael Nadal',
          oddsHome: '3/4',
          oddsDraw: 'N/A',
          oddsAway: '4/3',
        },
        {
          date: 'Tue 20 Feb 14:00',
          homeTeam: 'Serena Williams',
          awayTeam: 'Naomi Osaka',
          oddsHome: '1/1',
          oddsDraw: 'N/A',
          oddsAway: '4/5',
        },
        {
          date: 'Wed 21 Feb 15:30',
          homeTeam: 'Roger Federer',
          awayTeam: 'Andy Murray',
          oddsHome: '4/7',
          oddsDraw: 'N/A',
          oddsAway: '5/4',
        },
      ],
    },
  ];

  return (
    <Router>
      <NavigationBar />
      <Routes>
      <Route path="/" element={
          <>
            <Slideshow images={slideImages} />
            <FeaturesSlideshow sections={sections} />
            <FeatureSection />
            <DynamicContentSection />
            <ContactInfo />
            <FAQ />
          </>
        } />
      <Route path="/AdminPage" element={<AdminPage/>} />
      <Route path="/StandingsPage" element={<StandingsPage />} />
      <Route path="/AboutUsPage" element={<AboutUsPage />} />
      <Route path="/ChatPage" element={<ChatPage />} />
      <Route path="/SlotMachine" element={<SlotMachine />} />
      <Route path="/Roulette" element={<Roulette/>} />
      <Route path="/StandingsWidget" element={<StandingsWidget/>}/>
      <Route path="/FixtureStatisticsWidget" element={<FixtureStatisticsWidget/>}/>
      <Route path="/UnderstandingAddictionPage" element={<UnderstandingAddictionPage />} />

      </Routes>
      
      <div className="app-container">
        {children}
        {isAuth && (
          <div className="sign-out">
            <button onClick={signUserOut}>Sign Out</button>
          </div>
        )}

        <div className="additional-resources">
          <h3>Additional Resources</h3>
          <p>For more information, tools, or to contact a specialist, please explore the following resources:</p>
          <ul>
            <li><a href="https://www.recovery.org/">Recovery.org</a> - Comprehensive resources on addiction recovery</li>
            <li><a href="https://www.samhsa.gov/">SAMHSA</a> - Substance Abuse and Mental Health Services Administration</li>
            <li><a href="https://www.nami.org/">NAMI</a> - National Alliance on Mental Illness</li>
          </ul>
          <p>These resources are provided to help you understand more about your condition and find the appropriate support and assistance.</p>
        </div>
      </div>
      <Footer />
    </Router>
  );
};
