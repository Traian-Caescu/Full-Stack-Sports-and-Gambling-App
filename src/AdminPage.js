import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase-config';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com'; 
import './AdminPage.css';

const AdminPage = () => {
    const [user, setUser] = useState(null); 
    const [contactEntries, setContactEntries] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', message: '' });
    const [sendEmailForm, setSendEmailForm] = useState({ to_name: '', to_email: '', message: '' });
    const [error, setError] = useState('');
    const [antiAddictionMessages, setAntiAddictionMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingMessageText, setEditingMessageText] = useState('');



    useEffect(() => {
        const fetchAntiAddictionMessages = async () => {
            const querySnapshot = await getDocs(collection(db, "antiAddictionMessages"));
            setAntiAddictionMessages(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchAntiAddictionMessages();
    }, []);

    const createAntiAddictionMessage = async () => {
        await addDoc(collection(db, "antiAddictionMessages"), { message: newMessage });
        setNewMessage('');
        // Re-fetch messages to update UI
    };

    const startEditingMessage = (message) => {
        setEditingMessageId(message.id);
        setEditingMessageText(message.message);
    };
    const saveEditedMessage = async () => {
        await updateDoc(doc(db, "antiAddictionMessages", editingMessageId), { message: editingMessageText });
        setEditingMessageId(null);
        setEditingMessageText('');
    };

    const deleteAntiAddictionMessage = async (id) => {
        await deleteDoc(doc(db, "antiAddictionMessages", id));
    };

    useEffect(() => {
        emailjs.init('bM_7D8Ju3vG8tbLL7'); 
    }, []);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user && user.email === "traian0345@gmail.com") {
                setUser(user);
                fetchContactEntries();
            } else {
                setUser(null);
            }
        });
    }, []);

    const [selectedRoom, setSelectedRoom] = useState('all');
    const [chatMessages, setChatMessages] = useState([]);

    // Fetch chat messages
    const fetchChatMessages = async () => {
        const q = query(collection(db, "messages"), orderBy("createdAt"));
        const querySnapshot = await getDocs(q);
        const messages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            room: doc.data().room,
            text: doc.data().text,
            user: doc.data().user,
            createdAt: doc.data().createdAt 
        }));
        setChatMessages(messages);
    };
    useEffect(() => {
        fetchChatMessages();
    }, []);


    // Function to delete chat messages
    const handleDeleteChatMessage = async (id) => {
    try {
        await deleteDoc(doc(db, "messages", id));
        fetchChatMessages();
    } catch {
        setError('Failed to delete chat message.');
    }
    };
    const fetchContactEntries = async () => {
        const q = query(collection(db, "contactUs"), orderBy("timestamp"));
        const querySnapshot = await getDocs(q);
        const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContactEntries(entries);
    };

     // State for editing
     const [isEditing, setIsEditing] = useState(null);
     const [editMessage, setEditMessage] = useState('');
    // Handle edit click
     const handleEditClick = (message) => {
    setIsEditing(message.id);
    setEditMessage(message.text);
    };

    // Handle save after editing
    const handleSave = async (id) => {
    try {
        const messageRef = doc(db, "messages", id);
        await updateDoc(messageRef, {
            text: editMessage,
            // Update other fields if necessary
        });
        setIsEditing(null);
        fetchChatMessages(); // Fetch messages again to update the list
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};

// Function to get a unique list of rooms for the dropdown
const getUniqueRooms = (messages) => {
    const rooms = new Set();
    messages.forEach((msg) => rooms.add(msg.room));
    return ['all', ...Array.from(rooms)];
};

// Function to handle room selection change
const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
};

// Filter messages by selected room
const filteredMessages = selectedRoom === 'all'
    ? chatMessages
    : chatMessages.filter((message) => message.room === selectedRoom);

    const handleEdit = (entry) => {
        setEditId(entry.id);
        setEditForm({ name: entry.name, email: entry.email, message: entry.message });
        setError('');
    };

    const handleUpdate = async () => {
        if (!editForm.name || !editForm.email.includes('@') || !editForm.message) {
            setError('Please fill all fields correctly.');
            return;
        }
        try {
            const entryRef = doc(db, "contactUs", editId);
            await updateDoc(entryRef, {
                name: editForm.name,
                email: editForm.email,
                message: editForm.message
            });
            fetchContactEntries();
            setEditId(null);
            setError('');
        } catch (error) {
            setError('Failed to update entry.');
        }
    };

    const handleDelete = async (id) => {
        try {
            const entryRef = doc(db, "contactUs", id);
            await deleteDoc(entryRef);
            fetchContactEntries();
        } catch {
            setError('Failed to delete entry.');
        }
    };
    const sendEmail = (e) => {
        e.preventDefault(); // Prevents the default form submit action
    
        const templateParams = {
            to_name: sendEmailForm.to_name, // Recipient's name
            to_email: sendEmailForm.to_email, // Recipient's email
            message: sendEmailForm.message, // Your message
        };
    
        emailjs.send('service_c7c8rkl', 'template_zq0oqcm', templateParams, 'bM_7D8Ju3vG8tbLL7')
            .then((result) => {
                console.log(result.text);
                alert('Email sent successfully');
                setSendEmailForm({ to_name: '', to_email: '', message: '' }); // Reset form after sending
            }, (error) => {
                console.log(error.text);
                alert('Failed to send email. Check console for errors.');
            });
    };
    
    return (
        <div className="admin-page-container">
            <h1>Admin Panel</h1>
            {user ? (
                <>
                <section>
                <h2>Anti-Addiction Messages</h2>
                <div>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Enter new message"
                    />
                    <button onClick={createAntiAddictionMessage}>Add New Message</button>
                </div>
                {antiAddictionMessages.map((message) => (
                    <div key={message.id}>
                        {editingMessageId === message.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingMessageText}
                                    onChange={(e) => setEditingMessageText(e.target.value)}
                                />
                                <button onClick={saveEditedMessage}>Save</button>
                                <button onClick={() => setEditingMessageId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <p>{message.message}</p>
                                <button onClick={() => startEditingMessage(message)}>Edit</button>
                                <button onClick={() => deleteAntiAddictionMessage(message.id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </section>
                <h2>Send an Email</h2>
                    <form className="send-email-form" onSubmit={sendEmail}>
                        <input type="text" value={sendEmailForm.to_name} onChange={e => setSendEmailForm({ ...sendEmailForm, to_name: e.target.value })} placeholder="Recipient Name" required />
                        <input type="email" value={sendEmailForm.to_email} onChange={e => setSendEmailForm({ ...sendEmailForm, to_email: e.target.value })} placeholder="Recipient Email" required />
                        <textarea value={sendEmailForm.message} onChange={e => setSendEmailForm({ ...sendEmailForm, message: e.target.value })} placeholder="Your Message" required />
                        <button type="submit">Send Email</button>
                </form>
                    <h2>Messages Received from Contact Us</h2>
                    {error && <p className="error">{error}</p>}
                    
                    <table className="admin-contact-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Message</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactEntries.map(entry => (
                                editId === entry.id ? (
                                    <tr key={entry.id}>
                                        <td><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></td>
                                        <td><input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /></td>
                                        <td><input type="text" value={editForm.message} onChange={e => setEditForm({ ...editForm, message: e.target.value })} /></td>
                                        <td>
                                            <button onClick={handleUpdate}>Save</button>
                                            <button onClick={() => setEditId(null)}>Cancel</button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={entry.id}>
                                        <td>{entry.name}</td>
                                        <td>{entry.email}</td>
                                        <td>{entry.message}</td>
                                        <td>
                                            <button onClick={() => handleEdit(entry)}>Edit</button>
                                            <button onClick={() => handleDelete(entry.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                    <section className="admin-chat-section">
                <h2>Chat Messages</h2>
                <div>
                    <label htmlFor="room-select">Choose a room:</label>
                    <select id="room-select" value={selectedRoom} onChange={handleRoomChange}>
                        {getUniqueRooms(chatMessages).map((room) => (
                            <option key={room} value={room}>
                                {room === 'all' ? 'All Rooms' : `Room: ${room}`}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <p className="error">{error}</p>}
                <div className="admin-chat-messages">
                {filteredMessages.map((message) => (
                      <div key={message.id} className="admin-chat-message">
                         {isEditing === message.id ? (
                          <>
                           <input
                            type="text"
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                        />
                        <button onClick={() => handleSave(message.id)}>Save</button>
                        <button onClick={() => setIsEditing(null)}>Cancel</button>
                          </>
                         ) : (
                           <>
                        <p><strong>Room:</strong> {message.room}</p>
                        <p><strong>User:</strong> {message.user}</p>
                        <p><strong>Message:</strong> {message.text}</p>
                        <div className="admin-chat-actions">
                            <button onClick={() => handleEditClick(message)}>Edit</button>
                            <button onClick={() => handleDeleteChatMessage(message.id)}>Delete</button>
                        </div>
                            </>
                         )}
                </div>
        ))}
    </div>
</section>

                </>
            ) : (
                <p>You must be signed in as the admin to view this content. 😊</p>
            )}
        </div>
    );
};

export default AdminPage;
