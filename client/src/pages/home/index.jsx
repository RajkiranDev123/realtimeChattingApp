import { useEffect, useState } from 'react'
import "./home.css"
import Header from "../../components/Header.jsx"
import Sidebar from '../../components/Sidebar.jsx'
import ChatArea from "../../components/ChatArea.jsx"
import { useSelector } from 'react-redux'
import io from "socket.io-client"


//
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';


import Slide from '@mui/material/Slide';
//
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
//
////////////////// home /////////////////////////////////////////////////

//make it global
const socket = io.connect(import.meta.env.VITE_BASE_URL)//backend server address

const index = () => {
  const { selectedChat, user } = useSelector(state => state.userReducer) //dont show ChatArea when selectedChat is  null
  const [onlineUser, setOnlineUser] = useState([])

  //
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //

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
  }, [user,onlineUser])
  return (
    <div style={{ background: "#C0C0C0" }} className="home-page">

      <Header socket={socket}  />

      {/* flex */}
      <div className="main-content">
        {/*  */}

        <React.Fragment>
          <button 
          style={{padding:2,border:"none",outline:"none",borderRadius:4,cursor:"pointer"}}
           onClick={handleClickOpen}>
            👥 Contacts
          </button>
          <Dialog
            sx={{
              "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                  width: "100%",
                  maxWidth: "400px",  // Set your width here
                  height: 500
                },
              },
            }}
            open={open}
            slots={{
              transition: Transition,

            }}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >

            <div>
              <div style={{display:"flex",justifyContent:"flex-end"}}> <Button onClick={handleClose}>X</Button></div>
             
              <Sidebar onlineUser={onlineUser} socket={socket} handleClose={handleClose}/>
            </div>


          </Dialog>
        </React.Fragment>




        {/*  */}
        {selectedChat && <ChatArea socket={socket} />}
      </div>

    </div>
  )
}

export default index







