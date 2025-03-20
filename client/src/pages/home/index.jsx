import React, { useEffect } from 'react'
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
  const { selectedChat,user } = useSelector(state => state.userReducer)
  useEffect(() => {
    if(user){
      socket.emit("join-room",user?._id)
    }
  }, [user])
  return (
    <div className="home-page">

      <Header />
      
      {/* flex */}
      <div className="main-content">
        <Sidebar socket={socket}/>
        {selectedChat && <ChatArea socket={socket}/>}
      </div>

    </div>
  )
}

export default index