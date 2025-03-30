import React, { useEffect, useState } from 'react'
import "./home.css"
import Header from "../../components/Header.jsx"
import Sidebar from '../../components/Sidebar.jsx'
import ChatArea from "../../components/ChatArea.jsx"
import { useSelector } from 'react-redux'
import io from "socket.io-client"

////////////////// home /////////////////////////////////////////////////

//make it global
const socket = io.connect("http://localhost:3001")//backend server address

const index = () => {
  const { selectedChat, user } = useSelector(state => state.userReducer)
  const [ onlineUser, setOnlineUser ] = useState([])

  useEffect(() => {
    if (user) {
      socket.emit("join-room", user?._id)

      // online users
      socket.emit("user-login", user?._id)

      socket.on("online-users", onlineusers => {
        setOnlineUser(onlineusers)
      })
    }
  }, [user])
  return (
    <div style={{background:"#C0C0C0"}} className="home-page">

      <Header />

      {/* flex */}
      <div className="main-content">
        <Sidebar onlineUser={onlineUser} socket={socket} />
        {selectedChat && <ChatArea socket={socket} />}
      </div>

    </div>
  )
}

export default index