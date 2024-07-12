import React, { useState, useEffect } from 'react';
import './SlotMachine.css';
import { collection, getDocs, addDoc, doc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { db } from '../firebase-config';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const symbols = ['🍒', '🍋', '🔔'];

function SlotMachine() {
    const [reels, setReels] = useState([0, 0, 0]);
    const [spinning, setSpinning] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [showNotification, setShowNotification] = useState(false); // State to control notification visibility
    const [stats, setStats] = useState({ spins: 0, wins: 0, dataPoints: [] });
    const [spinCount, setSpinCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [antiAddictionMessages, setAntiAddictionMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const querySnapshot = await getDocs(collection(db, "antiAddictionMessages"));
            setAntiAddictionMessages(querySnapshot.docs.map(doc => doc.data().message));
        };
        fetchMessages();
    }, []);

    const statsRef = doc(db, "slotMachineStats", "slotMachineStats");

    useEffect(() => {
        const unsubscribe = onSnapshot(statsRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setStats({
                    spins: data.totalSpins,
                    wins: data.totalWins,
                    dataPoints: data.dataPoints || []
                });
            }
        });
        return () => unsubscribe();
    }, []);

    const spin = () => {
        setSpinning(true);
        setShowResult(false);
        const newReels = reels.map(() => Math.floor(Math.random() * symbols.length));
        setReels(newReels);

        setTimeout(() => {
            setSpinning(false);
            const win = checkWin(newReels);
            updateStats(win);
            setShowResult(true);

            setSpinCount(prev => prev + 1);
            if ((spinCount + 1) % 5 === 0 && antiAddictionMessages.length > 0) {
                const messageIndex = Math.floor(Math.random() * antiAddictionMessages.length);
                setModalMessage(antiAddictionMessages[messageIndex]);
                setShowModal(true);
            }
        }, 1500);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const checkWin = (newReels) => {
        const allEqual = newReels.every(val => val === newReels[0]);
        setResultMessage(allEqual ? 'You win!' : 'Try again!');
        return allEqual;
    };

    const updateStats = (win) => {
        const newDataPoints = [...stats.dataPoints, win ? 1 : 0];
        updateDoc(statsRef, {
            totalSpins: increment(1),
            totalWins: win ? increment(1) : increment(0),
            dataPoints: newDataPoints
        });
    };

    const data = {
        labels: stats.dataPoints.map((_, index) => index + 1),
        datasets: [
            {
                label: 'Wins',
                data: stats.dataPoints,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="slot-machine-container">
            <h1>Slot Machine</h1>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p className="modal-message">{modalMessage}</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
            <div className="reels">
                {reels.map((index, i) => (
                    <div key={i} className="reel">{symbols[index]}</div>
                ))}
            </div>
            <button className="slot-button" onClick={spin} disabled={spinning}>
                {spinning ? 'Spinning...' : 'Spin'}
            </button>
            {showResult && <div className="result-message">{resultMessage}</div>}
            <div className="statistics">
                <h2>Statistics</h2>
                <p>Total Spins: {stats.spins}</p>
                <p>Total Wins: {stats.wins}</p>
                <p>Win Percentage: {(stats.spins > 0 ? (stats.wins / stats.spins * 100).toFixed(2) : 0)}%</p>
                <Bar data={data} options={options} />
            </div>
            <div className="information-section">
    <h2>The Reality of Slot Machines</h2>
    <p>Slot machines are a popular form of gambling, known for their bright lights, enticing sounds, and the promise of big payouts. However, the reality is that they are among the least favorable games for players in terms of winning odds.</p>
    <p>Here are some crucial points to consider:</p>
    <ul>
        <li><strong>The House Edge:</strong> Slot machines are designed with a built-in advantage for the casino, known as the 'house edge'. This means that, on average, the machine is programmed to return less money to players than the amount of money played. The typical house edge on slot machines can vary from 5% to 15%, significantly higher than many other casino games.</li>
        <li><strong>Near Misses:</strong> Slot machines often show "near misses" – instances where the symbols on the reels align almost perfectly to a winning combination. Studies have shown that these near misses activate the same reward centers in the brain that wins do, encouraging players to continue playing in the belief that they are close to a big win.</li>
        <li><strong>Lack of Skill:</strong> Unlike some other casino games, there is no skill involved in playing slot machines. The outcome of each spin is completely random, determined by a computer algorithm known as the Random Number Generator (RNG). No amount of strategy can influence the outcome of the game.</li>
        <li><strong>Rapid Play:</strong> Slot machines allow for very rapid play – you can complete a game in mere seconds. This fast pace can lead to significant losses in a short amount of time, with the player having little control over the money spent.</li>
        <li><strong>Psychological Effects:</strong> The design of slot machines is often specifically targeted to entice players. From the bright lights and vibrant colors to the sound effects, every element is crafted to keep the player engaged and spending money, regardless of the odds stacked against them.</li>
    </ul>
    <p>Understanding these factors is crucial, especially for those who are struggling with gambling addiction. It’s important to approach slot machines with the awareness that they are not a reliable way to make money. Gambling should always be done responsibly, with limits set and adhered to. If gambling is no longer enjoyable or is causing issues, it is advised to seek help from professionals who can provide support and resources.</p>
</div>

        </div>
        
    );
}

export default SlotMachine;
