import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { AreaChart, Area } from 'recharts';
import './UnderstandingAddictionPage.css';
import { db } from './firebase-config';
import { collection, addDoc, getDocs, query, where, doc, setDoc, deleteDoc } from 'firebase/firestore';

const UnderstandingAddictionPage = () => {
    const [userData, setUserData] = useState({
        monthlyData: Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            Awareness: 0,
            Impact: 0,
            Recovery: 0
        })),
        dailyData: []
    });

    const [formInput, setFormInput] = useState({
        month: '',
        Awareness: '',
        Impact: '',
        Recovery: '',
        day: '',
        mood: '',
        activityLevel: '',
        username: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormInput(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const saveDataToFirebase = async () => {
        if (!formInput.username) {
            alert('Username is required to save data.');
            return;
        }

        try {
            const q = query(collection(db, "trackRecovery"), where("username", "==", formInput.username));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const docRef = doc(db, "trackRecovery", querySnapshot.docs[0].id);
                await setDoc(docRef, {
                    username: formInput.username,
                    monthlyData: userData.monthlyData,
                    dailyData: userData.dailyData
                }, { merge: true });
                console.log("Document updated with ID: ", docRef.id);
                alert('Data updated successfully.');
            } else {
                const newDocRef = await addDoc(collection(db, "trackRecovery"), {
                    username: formInput.username,
                    monthlyData: userData.monthlyData,
                    dailyData: userData.dailyData
                });
                console.log("Document written with ID: ", newDocRef.id);
                alert('Data saved successfully.');
            }
        } catch (e) {
            console.error("Error saving data: ", e);
            alert('Failed to save data.');
        }
    };

    const loadDataFromFirebase = async () => {
        if (!formInput.username) {
            alert('Username is required to load data.');
            return;
        }

        const q = query(collection(db, "trackRecovery"), where("username", "==", formInput.username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data();
            setUserData({
                monthlyData: docData.monthlyData || [],
                dailyData: docData.dailyData || []
            });
            alert('Data loaded successfully.');
        } else {
            setUserData({ monthlyData: [], dailyData: [] }); // Reset the data if not found
            alert('No data found for the user.');
        }
    };

    const deleteDataFromFirebase = async () => {
        if (!formInput.username) {
            alert('Username is required to delete data.');
            return;
        }

        const q = query(collection(db, "trackRecovery"), where("username", "==", formInput.username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id;
            await deleteDoc(doc(db, "trackRecovery", docId));
            console.log("Document deleted with ID: ", docId);
            alert('Data deleted successfully.');
        } else {
            alert('No data found to delete for the user.');
        }
    };
    const submitData = () => {
      if (formInput.month && (formInput.Awareness || formInput.Impact || formInput.Recovery)) {
        let newData = [...userData.monthlyData];
        const monthIndex = formInput.month - 1;
        if (newData[monthIndex]) {
          newData[monthIndex] = {
            ...newData[monthIndex],
            Awareness: parseFloat(formInput.Awareness || 0),
            Impact: parseFloat(formInput.Impact || 0),
            Recovery: parseFloat(formInput.Recovery || 0)
          };
          setUserData(prev => ({ ...prev, monthlyData: newData }));
        }
      }
      if (formInput.day && (formInput.mood || formInput.activityLevel)) {
        const newDailyData = [...userData.dailyData, {
          day: parseInt(formInput.day),
          mood: parseFloat(formInput.mood || 0),
          activityLevel: parseFloat(formInput.activityLevel || 0)
        }];
        setUserData(prev => ({ ...prev, dailyData: newDailyData }));
      }
      clearForm();
    };
  
    const clearForm = () => {
      setFormInput({
        month: '',
        Awareness: '',
        Impact: '',
        Recovery: '',
        day: '',
        mood: '',
        activityLevel: ''
      });
    };
    return (
        <div className="understanding-addiction-page">
          <h1>Advanced Understanding of Addiction</h1>
          <p>This interactive platform is designed to empower individuals grappling with addiction by providing a visual reflection of their journey. By tracking changes in awareness, impact, and recovery, users can gain insightful feedback that highlights the effectiveness of their ongoing efforts and strategies.</p>
          <div className="data-entry-form">
            <h2>Enter Your Monthly Data</h2>
            <p>Engage actively with this tool by inputting monthly metrics on your awareness of addictive behaviors, the impact it has on your life, and your steps towards recovery. This engagement is crucial as it fosters a routine self-assessment, which is a cornerstone of effective addiction management.</p>
            <form onSubmit={e => { e.preventDefault(); submitData(); }}>
              <div className="form-group">
                <label>Month:</label>
                <input type="number" name="month" min="1" max="12" value={formInput.month} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Awareness Level:</label>
                <input type="number" name="Awareness" value={formInput.Awareness} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Impact Level:</label>
                <input type="number" name="Impact" value={formInput.Impact} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Recovery Level:</label>
                <input type="number" name="Recovery" value={formInput.Recovery} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Day of the Month:</label>
            <input type="number" name="day" min="1" max="31" value={formInput.day} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Mood Level (1-10):</label>
            <input type="number" name="mood" min="1" max="10" value={formInput.mood} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Activity Level (Hours):</label>
            <input type="number" name="activityLevel" min="0" value={formInput.activityLevel} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input type="text" name="username" value={formInput.username} onChange={handleInputChange} required />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Submit Data</button>
           
          </div>
        </form>
      </div>

      <div className="charts-container">
        <h2>Interactive Monthly Impact Analysis</h2>
        <p>Visualize how your awareness and recovery efforts are making a difference. Are there months where your awareness leads to a tangible decrease in impact? Identifying such patterns can help tailor your future strategies.</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userData.monthlyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Awareness" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Impact" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Recovery" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
        <button type="button" onClick={saveDataToFirebase}>Save Data</button>
        <button type="button" onClick={loadDataFromFirebase}>Load Data</button>
        <button type="button" onClick={deleteDataFromFirebase}>Delete Data</button>

        <h2>Distribution of Recovery Efforts</h2>
        <p>Each segment of this radial bar chart illustrates the fluctuations in your awareness levels each month, providing a colorful and immediate representation of your mental engagement over time.</p>
        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart innerRadius="10%" outerRadius="80%" data={userData.monthlyData} startAngle={180} endAngle={0}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background dataKey="Awareness">
              {userData.monthlyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'][index % 7]} />
              ))}
            </RadialBar>
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>

        <h2>Detailed Breakdown of Recovery Phases</h2>
        <p>This area chart provides a detailed view of your recovery over time, showing how sustained efforts can lead to gradual improvements in managing addiction.</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={userData.monthlyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRecovery" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="Recovery" stroke="#8884d8" fillOpacity={1} fill="url(#colorRecovery)" />
          </AreaChart>
        </ResponsiveContainer>
        <h2>Daily Mood and Activity Tracker</h2>
        <p>Track your daily mood and activity levels to see how they correlate with your recovery process. This visualization helps in identifying days with high activity and mood levels which may influence recovery positively.</p>
        <ResponsiveContainer width="100%" height={300}>
    <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid />
      <XAxis type="number" dataKey="day" name="Day" domain={[1, 31]} allowDataOverflow={true} tickCount={31} />
      <YAxis type="number" dataKey="mood" name="Mood Level" />
      <ZAxis type="number" dataKey="activityLevel" range={[60]} name="Activity Level (Hours)" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Scatter name="Daily Data" data={userData.dailyData} fill="#8884d8" />
    </ScatterChart>
  </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UnderstandingAddictionPage;
