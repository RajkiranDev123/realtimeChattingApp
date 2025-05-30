import { useEffect, useState } from 'react'
import "./home.css"
import Header from "../../components/Header.jsx"
import Sidebar from '../../components/Sidebar.jsx'
import ChatArea from "../../components/ChatArea.jsx"
import { useSelector } from 'react-redux'
import io from "socket.io-client"

////////////////// home /////////////////////////////////////////////////

//make it global
const socket = io.connect(import.meta.env.VITE_BASE_URL)//backend server address

const index = () => {
  const { selectedChat, user } = useSelector(state => state.userReducer) //dont show ChatArea when selectedChat is  null
  const [onlineUser, setOnlineUser] = useState([])

  useEffect(() => {
    if (user) {
      socket.emit("join-room", user?._id)

      // online users
      socket.emit("user-login", user?._id)

      socket.on("online-users", onlineusers => {
        setOnlineUser(onlineusers)
      })

      socket.on("online-users-updated", onlineusers => {
        setOnlineUser(onlineusers)
      })
    }
  }, [user])
  return (
    <div style={{ background: "#C0C0C0" }} className="home-page">

      <Header socket={socket} />

      {/* flex */}
      <div className="main-content">
        <Sidebar onlineUser={onlineUser} socket={socket} />
        {selectedChat && <ChatArea socket={socket} />}
      </div>

    </div>
  )
}

export default index