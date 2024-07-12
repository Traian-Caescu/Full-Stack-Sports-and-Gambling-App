
import React, { useState, useEffect } from 'react';
import './ChatPage.css';


function ChatPage () {
    return (
        <>
          
          <main className="ChatPage">
          <div className="chat-introduction">
        <h2>Welcome to Our Supportive Community</h2>
        <p>Dealing with gambling addiction is a challenging journey, but you don't have to face it alone. Our chat platform offers a safe, anonymous space for sharing experiences, seeking advice, and finding solace among those who truly understand.</p>
        <p><strong>Here’s how we can help:</strong></p>
        <ul>
          <li><strong>Peer Support:</strong> Connect with individuals who have faced similar challenges. Share your story, lend an ear, and discover new perspectives and coping strategies.</li>
          <li><strong>Access to Experts:</strong> Occasionally, professionals specializing in addiction and recovery join the "Help" room to offer guidance, answer questions, and provide resources for further assistance.</li>
          <li><strong>Immediate Assistance:</strong> In moments of crisis or when you need someone to talk to immediately, the "Help" room is there. You're not alone, and there's always someone ready to listen.</li>
          <li><strong>Educational Resources:</strong> Learn about tools, techniques, and practices that can aid in managing gambling urges, financial recovery, and rebuilding trust in relationships.</li>
        </ul>
        <p>To start, sign in and simply enter a room. For specialized support or to speak with someone who can help, please join the "Help" room. Remember, taking the first step towards recovery is a sign of strength.</p>
      </div>
          </main>
          
        </>
      );
    };

export default ChatPage;
