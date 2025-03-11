import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { createNewMessage, getAllMessages } from '../apiCalls/message'
import "./chatarea.css"
import { useDispatch } from 'react-redux'
import { showLoader, hideLoader } from '../redux/loaderSlice'
import { toast } from "react-hot-toast"
import moment from "moment"
const ChatArea = () => {
  const dispatch = useDispatch()
  const { selectedChat, user } = useSelector(state => state.userReducer)
  const selectedUser = selectedChat.members.find(u => u._id !== user._id)
  const [message, setNewMessage] = useState("")
  const [allMessages, setAllMessages] = useState([])

  const formatTime=(timestamp)=>{
    const now=moment()
    const diff=now.diff(moment(timestamp),"days")
    if(diff<1){
      return `Today ${moment(timestamp).format("hh:mm A")}`
    }else if(diff===1){
      return `Yesterday ${moment(timestamp).format("hh:mm A")}`

    }else{
      return moment(timestamp).format("MMM D, hh:mm A")

    }
  }


  const sendMessage = async (e) => {
    let response = null
    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message
      }
      dispatch(showLoader())
      response = await createNewMessage(newMessage)
      dispatch(hideLoader())

      if (response.success) {
        toast.success(response.message)
        setNewMessage("")
        // dispatch(setUser(response?.data))
      }
    } catch (error) {
      dispatch(hideLoader())

      toast.error(error.message)
    }
  }

  const getMessagesAll = async (e) => {
    let response = null
    try {

      dispatch(showLoader())
      response = await getAllMessages(selectedChat._id)
      dispatch(hideLoader())

      if (response.success) {
        toast.success(response.message)
        setAllMessages(response.data)
        // dispatch(setUser(response?.data))
      }
    } catch (error) {
      dispatch(hideLoader())

      toast.error(error.message)
    }
  }

  useEffect(() => {
    getMessagesAll()
  }, [selectedChat])
  return (
    <>
      {selectedChat && <div className="app-chat-area">
        <div className="app-chat-area-header">
          {selectedUser.firstName + " " + selectedUser.lastName}
        </div>

        <div className="main-chat-area">
          {allMessages?.map(msg => {
            const isCurrentUserSender = msg.sender === user._id
            return <div className="message-container" style={isCurrentUserSender ? { justifyContent: "end" } : { justifyContent: "start" }}>
              <div>
                <div className={isCurrentUserSender ? "send-message" : "received-message"}>{msg?.text}</div>
                <div className='message-timestamp' style={isCurrentUserSender?{float:"right"}:{float:"left"}}>
                  {formatTime(msg?.createdAt)}
                  </div>
              </div>
            </div>
          })}

        </div>

        <div className="send-message-div">
          <input value={message} onChange={(e) => setNewMessage(e.target.value)} type="text" className="send-message-input" placeholder="Type a message" />
          <button onClick={() => sendMessage()} className="fa fa-paper-plane send-message-btn" aria-hidden="true"></button>
        </div>
      </div>}

    </>
  )
}

export default ChatArea