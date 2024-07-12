import React, { useState, useEffect } from "react";
import { Chat } from "./components/Chat.js";
import { Auth } from "./components/Auth.js";
import { AppWrapper } from "./components/AppWrapper.js";
import Cookies from "universal-cookie";
import "./ChatRoom.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Footer from './Extras/Footer.js';
import NavigationBar from './Extras/NavigationBar.js';

const cookies = new Cookies();

function ChatApp() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isInChat, setIsInChat] = useState(null);
  const [room, setRoom] = useState("");

  if (!isAuth) {
    return (
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        setIsInChat={setIsInChat}
      >
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }

  return (
      <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
        {!isAuth ? (
          <Auth setIsAuth={setIsAuth} />
        ) : (
          !isInChat ? (
            <div className="room">
              <label>Type room name:</label>
              <input onChange={(e) => setRoom(e.target.value)} />
              <button onClick={() => setIsInChat(true)}>Enter Chat</button>
            </div>
          ) : (
            <Chat room={room} />
          )
        )}
      </AppWrapper>
      
      
  );
}
export default ChatApp;
