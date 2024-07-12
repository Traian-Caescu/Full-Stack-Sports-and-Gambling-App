import React, { useState, useEffect } from 'react';
import './Roulette.css';
import { db } from '../firebase-config';
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const wheelNumbers = ["0", "32", "15", "19", "4", "21", "2", "25", "17", "34", "6", "27", "13", "36", "11", "30", "8", "23", "10", "5", "24", "16", "33", "1", "20", "14", "31", "9", "22", "18", "29", "7", "28", "12", "35", "3", "26"];

const colors = {
    "0": "green", "32": "red", "15": "black", "19": "red", "4": "black", "21": "red",
    "2": "black", "25": "red", "17": "black", "34": "red", "6": "black", "27": "red",
    "13": "black", "36": "red", "11": "black", "30": "red", "8": "black", "23": "red",
    "10": "black", "5": "red", "24": "black", "16": "red", "33": "black", "1": "red",
    "20": "black", "14": "red", "31": "black", "9": "red", "22": "black", "18": "red",
    "29": "black", "7": "red", "28": "black", "12": "red", "35": "black", "3": "red",
    "26": "black"
};


function Roulette() {
    const [bets, setBets] = useState([]);
    const [betAmount, setBetAmount] = useState('');
    const [spinning, setSpinning] = useState(false);
    const [winningNumber, setWinningNumber] = useState({ number: null, color: 'grey' });
    const [totals, setTotals] = useState({ wins: 0, losses: 0 });
    const [globalTotals, setGlobalTotals] = useState({ wins: 0, losses: 0 });
    const [results, setResults] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [maxWin, setMaxWin] = useState(0);
    const [maxLoss, setMaxLoss] = useState(0);
    const [spinCount, setSpinCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [antiAddictionMessages, setAntiAddictionMessages] = useState([]);

    useEffect(() => {
        const fetchAntiAddictionMessages = async () => {
            const querySnapshot = await getDocs(collection(db, "antiAddictionMessages"));
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push(doc.data().message); 
            });
            setAntiAddictionMessages(messages);
        };

        fetchAntiAddictionMessages();
    }, []);
    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        const q = query(collection(db, "rouletteData"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        let wins = 0, losses = 0, resultsData = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            wins += data.wins;
            losses += data.losses;
            resultsData.push({ ...data, timestamp: data.timestamp.toDate() });
        });
        setGlobalTotals({ wins, losses });
        setResults(resultsData);
        updateChartData(resultsData);
        updateMaxData(wins, losses);
    };

    const updateChartData = (resultsData) => {
        const totalSpins = resultsData.length;
        const labels = resultsData.map((_, i) => `Spin ${totalSpins - i}`);
        const winsData = resultsData.map(result => result.wins);
        const lossesData = resultsData.map(result => result.losses);
    
        setChartData({
            labels: labels,
            datasets: [
                { label: 'Wins', data: winsData, borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)' },
                { label: 'Losses', data: lossesData, borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)' }
            ]
        });
    };
    

    const updateMaxData = (wins, losses) => {
        setMaxWin(wins);
        setMaxLoss(losses);
    };

    const placeBet = (betType, value) => {
        if (betAmount <= 0) {
            alert('Please enter a valid bet amount.');
            return;
        }
        setBets([...bets, { betType, value, amount: parseFloat(betAmount) }]);
    };
    const closeModal = () => {
        setShowModal(false);
    };
    const spinWheel = async () => {
        setSpinning(true);
        const randomIndex = Math.floor(Math.random() * wheelNumbers.length);
        const resultNumber = wheelNumbers[randomIndex];
        const resultColor = colors[resultNumber];

        setTimeout(() => {
            setWinningNumber({ number: resultNumber, color: resultColor });
            evaluateBets(resultNumber, resultColor);
            setSpinning(false);
        }, 3000);

        setSpinCount(prev => prev + 1); // Increment the spin count
        if ((spinCount + 1) % 3 === 0 && antiAddictionMessages.length > 0) { // Check if it's time to show the modal and messages are loaded
            const messageIndex = Math.floor(Math.random() * antiAddictionMessages.length);
            setModalMessage(antiAddictionMessages[messageIndex]); // Set a random message
            setShowModal(true); // Show the modal
        }
    };

   

    const evaluateBets = async (number, color) => {
        let sessionWins = 0;
        let sessionLosses = 0;
        bets.forEach(bet => {
            let winMultiplier = 0; // Determines the multiplier for the payout
            const winCondition = (bet.betType === 'number' && bet.value === number) ||
                                 (bet.betType === 'color' && bet.value === color);
    
            //Straight (a single number): Pays 35 to 1.
            //Split (two adjacent numbers): Pays 17 to 1.
            //Street (three consecutive numbers, e.g., 1-2-3): Pays 11 to 1.
            //Square (four numbers in a block, e.g., 1-2-4-5): Pays 8 to 1.
            //Six Line (six consecutive numbers, e.g., 1-6): Pays 5 to 1.
            //Colors (red or black): Pays 1 to 1.
            //Even/Odd: Pays 1 to 1.
            //Low/High (1-18 or 19-36): Pays 1 to 1. 

            if (winCondition) {
                switch (bet.betType) {
                    case 'number':
                        winMultiplier = 35;
                        break;
                    case 'split':
                        winMultiplier = 17;
                        break;
                    case 'street':
                        winMultiplier = 11;
                        break;
                    case 'square':
                        winMultiplier = 8;
                        break;
                    case 'sixline':
                        winMultiplier = 5;
                        break;
                    case 'color':
                    case 'evenodd':
                    case 'lowhigh':
                        winMultiplier = 1;
                        break;
                    default:
                        winMultiplier = 0; // No win
                }
                sessionWins += bet.amount * winMultiplier;
            } else {
                sessionLosses += bet.amount;
            }
        });
    
        await addDoc(collection(db, "rouletteData"), {
            sessionId: new Date().toISOString(),
            wins: sessionWins,
            losses: sessionLosses,
            timestamp: new Date()
        });
    
        setTotals(totals => ({ wins: totals.wins + sessionWins, losses: totals.losses + sessionLosses }));
        setBets([]);
        fetchResults();
    };
    
    

    const resetGame = () => {
        setBets([]);
        setWinningNumber({ number: null, color: 'grey' });
    };

    return (
        <div className="advanced-roulette-container">
            <h1>Roulette</h1>
            <div className="roulette-wheel" style={{ backgroundColor: winningNumber.color }}>
                {spinning ? "Spinning..." : winningNumber.number ? `Number ${winningNumber.number}` : "Place your bet and spin"}
            </div>
            <div className="current-bets-display">
                <h2>Current Bets:</h2>
                {bets.map((bet, index) => (
                    <div key={index} className="bet-item">
                        ${bet.amount} on {bet.betType} {bet.value}
                    </div>
                ))}
            </div>
            <div className="roulette-betting-table">
                <h2>Place Your Bets</h2>
                <input type="number" className="bet-amount-input" value={betAmount} onChange={e => setBetAmount(e.target.value)} placeholder="Enter bet amount" />
                <div className="number-buttons">
                    {wheelNumbers.map(num => (
                        <button key={num} onClick={() => placeBet('number', num)} style={{ backgroundColor: colors[num] }} className="roulette-bet-button">
                            {num}
                        </button>
                    ))}
                </div>
                <div className="color-buttons">
                    <button onClick={() => placeBet('color', 'red')} className="roulette-bet-button" style={{ backgroundColor: 'red' }}>Red</button>
                    <button onClick={() => placeBet('color', 'black')} className="roulette-bet-button" style={{ backgroundColor: 'black' }}>Black</button>
                </div>
            </div>
            
            <button onClick={spinWheel} className="roulette-spin-button" disabled={spinning || bets.length === 0}>Spin Wheel</button>
            <button onClick={resetGame} className="roulette-reset-button">Reset</button>
            <div className="roulette-results">
                <h3>Session Results</h3>
                <p>Total Wins: ${totals.wins}</p>
                <p>Total Losses: ${totals.losses}</p>
            </div>
            <div className="global-results">
                <h3>Global Totals</h3>
                <p>Wins: ${globalTotals.wins}</p>
                <p>Losses: ${globalTotals.losses}</p>
                <h2>Latest Spins</h2>
                <div className="results-graph">
                    <Line data={chartData} />
                </div>
            </div>
            <div className="max-results">
                <div className="results-max">
                    <Bar data={{
                        labels: ['Wins', 'Losses'],
                        datasets: [{
                            label: 'Amount',
                            data: [maxWin, maxLoss],
                            backgroundColor: ['rgb(50, 205, 50)', 'rgb(255, 69, 0)'],
                        }]
                    }} />
                </div>
            </div>
            <div className="gambling-info-section">
    <h3 className="gambling-info-header">Understanding the Risks of Gambling</h3>
    <p className="gambling-info-text">
        Gambling should be fun and entertaining, but it can also become problematic and lead to significant financial and personal issues. Here are some statistics and tips to gamble responsibly:
    </p>
    <ul className="gambling-info-list">
        <li>Statistically, the odds are always in favor of the house. It's important to view gambling as a form of entertainment, not a source of income.</li>
        <li>Set a budget and stick to it. Never gamble more than you can afford to lose.</li>
        <li>Limit your gambling time. Don't let gambling interfere with your daily responsibilities.</li>
        <li>Be aware of the signs of gambling addiction and seek help if you find yourself or someone you know may be at risk.</li>
    </ul>
</div>

 {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p className="modal-message">{modalMessage}</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}    

export default Roulette;
