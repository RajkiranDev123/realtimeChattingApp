import React from 'react'
import "./home.css"
import Header from "../../components/Header.jsx"
import Sidebar from '../../components/Sidebar.jsx'
import ChatArea from "../../components/ChatArea.jsx"
import { useSelector } from 'react-redux'

////////////////// home /////////////////////////////////////////////////
const index = () => {
  const {selectedChat}=useSelector(state=>state.userReducer)
  return (
    <div className="home-page">
      <Header />

      <div className="main-content">
        <Sidebar />
       {selectedChat&& <ChatArea/>}
      </div>
      
    </div>
  )
}

export default index