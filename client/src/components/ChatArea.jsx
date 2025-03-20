import React, { useEffect, useState } from 'react'
import { createNewMessage, getAllMessages } from '../apiCalls/message'
import { clearUnreadMessageCountAndMessageReadTrue } from '../apiCalls/chat'

import "./chatarea.css"
import { useDispatch, useSelector } from 'react-redux'
import { showLoader, hideLoader } from '../redux/loaderSlice'
import { toast } from "react-hot-toast"
import { formatName } from "../utils/formatName.js"

import store from "../redux/store.js"

import moment from "moment"
import { formatTime } from '../utils/formatTime'
import { setAllChats } from '../redux/userSlice.js'
const ChatArea = ({ socket }) => {
  const dispatch = useDispatch()
  const { selectedChat, user, allChats } = useSelector(state => state.userReducer)
  const selectedUser = selectedChat?.members.find(u => u?._id !== user?._id)
  const [message, setNewMessage] = useState("")
  const [allMessages, setAllMessages] = useState([])

  const sendMessage = async (e) => {
    let response = null
    try {
      const newMessage = {
        chatId: selectedChat?._id,
        sender: user?._id,
        text: message
      }
      if (message == "") { return }


      socket.emit("send-message", {
        ...newMessage,
        members: selectedChat?.members?.map(m => m?._id),
        read: false,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss")

      })

      // dispatch(showLoader())
      response = await createNewMessage(newMessage)
      // dispatch(hideLoader())

      if (response.success) {
        toast.success(response.message)
        setNewMessage("")

      }
    } catch (error) {
      // dispatch(hideLoader())
      toast.error(error.message)
    }
  }

  const getMessagesAll = async (e) => {
    let response = null
    try {
      dispatch(showLoader())
      response = await getAllMessages(selectedChat?._id)
      dispatch(hideLoader())
      if (response?.success) {
        toast.success(response?.message)
        setAllMessages(response?.data)
      }
    } catch (error) {
      dispatch(hideLoader())
      toast.error(error?.message)
    }
  }

  // clearUnreadMessageCountAndMessageReadTrue

  const clearUnreadCountAndTrue = async (e) => {
    let response = null
    try {
      // dispatch(showLoader())
      socket.emit("clear-unread-messages", {
        chatId: selectedChat?._id,
        members: selectedChat?.members.map(m => m._id)
      })
      response = await clearUnreadMessageCountAndMessageReadTrue(selectedChat?._id)
      // dispatch(hideLoader())
      if (response?.success) {
        // allChats.map(chat => {
        //   if (chat?._id === selectedChat?._id) {
        //     return response.data
        //   }
        //   return chat

        // }
        // )
      }
    } catch (error) {
      dispatch(hideLoader())
      toast.error(error?.message)
    }
  }



  useEffect(() => {
    getMessagesAll()
    if (selectedChat?.lastMessage?.sender !== user?._id) {
      clearUnreadCountAndTrue()
    }

    //
    socket.off("receive-message").on("receive-message", message => {
      const selectedChat = store.getState().userReducer.selectedChat
      if (selectedChat?._id == message?.chatId) {
        //otherwise other selected chat will receive message too
        setAllMessages(prevMsg => [...prevMsg, message])
      }

      if (selectedChat?._id == message?.chatId && message?.sender !== user?._id) {
        //unread message count to 0 and read true for all messages of that chat id while receiving message on selected chat only
        clearUnreadCountAndTrue() //from db
      }
    })

    //update on redux
    socket.on("message-count-cleared", data => {
      const selectedChat = store.getState().userReducer.selectedChat
      const allChats = store.getState().userReducer.allChats

      //update allChats
      if (selectedChat?._id == data?.chatId) {
        const updatedChats = allChats.map(chat => {
          if (chat?._id == data?.chatId) {
            return { ...chat, unreadMessageCount: 0 }
          }
          return chat
        })
        dispatch(setAllChats(updatedChats))
      }

      //update read to true in all Messages

      setAllMessages(prevMsgs => {
        return prevMsgs.map(msg => {
          return { ...msg, read: true }
        })
      })




    })
  }, [selectedChat])

  useEffect(() => {
    const msgContainer = document.getElementById("main-chat-area")
    msgContainer.scrollTop = msgContainer.scrollHeight
  }, [allMessages])
  return (
    <>
      {selectedChat && <div className="app-chat-area">

        {/* header */}
        <div className="app-chat-area-header">
          {formatName(selectedUser)}
        </div>

        {/* chat area */}
        <div className="main-chat-area" id="main-chat-area">
          {allMessages?.map(msg => {
            const isCurrentUserSender = msg?.sender === user?._id
            return <div className="message-container" style={isCurrentUserSender ? { justifyContent: "end" } : { justifyContent: "start" }}>
              <div>
                <div className={isCurrentUserSender ? "send-message" : "received-message"}>{msg?.text}</div>
                <div className='message-timestamp' style={isCurrentUserSender ? { float: "right" } : { float: "left" }}>
                  {formatTime(msg?.createdAt)}
                  {isCurrentUserSender && msg?.read && <i style={{ color: "green" }} className='fa fa-check-circle'></i>}
                </div>
              </div>
            </div>
          })}
        </div>

        {/* input and send button */}
        <div className="send-message-div">
          <input value={message} onChange={(e) => setNewMessage(e.target.value)} type="text" className="send-message-input"
            placeholder="Type a message" />
          <button onClick={() => sendMessage()} className="fa fa-paper-plane send-message-btn" aria-hidden="true"></button>
        </div>

      </div>}

    </>
  )
}

export default ChatArea