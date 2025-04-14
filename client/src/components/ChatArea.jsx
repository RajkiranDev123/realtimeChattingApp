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
import EmojiPicker from "emoji-picker-react"
import AIModel from "../components/AIModal.jsx"
const ChatArea = ({ socket }) => {
  const dispatch = useDispatch()
  const { selectedChat, user, allChats } = useSelector(state => state.userReducer)

  const selectedUser = selectedChat?.members.find(u => u?._id !== user?._id)

  const [message, setNewMessage] = useState("")
  const [allMessages, setAllMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)





  const sendMessage = async (image) => {
    console.log(77)
    let response = null
    try {
      const newMessage = {
        chatId: selectedChat?._id,
        sender: user?._id,
        text: message,
        image: image
      }
      // if (message == "") { return }
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
        setShowEmojiPicker(false)
      }
    } catch (error) {
      // dispatch(hideLoader())
      toast.error(error.message)
    }
  }

  // sendImage
  const sendImage = async (e) => {
    console.log(9)
    const file = e.target.files[0]
    console.log(file)
    const reader = new FileReader(file)
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      sendMessage(reader.result)
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
        setAllMessages(response?.data)//in state not redux
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
      ///check : message-count-cleared
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
    // for receiver : set count to 0 and read to true in db
    if (selectedChat?.lastMessage?.sender !== user?._id) {
      clearUnreadCountAndTrue()//only for receiver
    }
    //dont call getAllmessages api after sending msg instead listen to an event and update the redux : api call reduced!
    socket.off("receive-message").on("receive-message", message => {
      const selectedChat = store.getState().userReducer.selectedChat
      if (selectedChat?._id == message?.chatId) {
        //otherwise other selected chat will receive message too
        setAllMessages(prevMsg => [...prevMsg, message]) //update on state
      }

      ////////////////////////////////////////////////     receiver
      if (selectedChat?._id == message?.chatId && message?.sender !== user?._id) {
        clearUnreadCountAndTrue() //from db
      }
    })
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //update on redux withou making api call
    socket.on("message-count-cleared", data => {
      const selectedChat = store.getState().userReducer.selectedChat
      const allChats = store.getState().userReducer.allChats

      if (selectedChat?._id == data?.chatId) {//only if chat area of receiver is open 
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
    })//message count cleared

    //listen to started-typing
    socket.on("started-typing", data => {
      if (selectedChat?._id == data?.chatId && data?.sender !== user?._id) {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }
    })

  }, [selectedChat])

  useEffect(() => {
    const msgContainer = document.getElementById("main-chat-area")
    msgContainer.scrollTop = msgContainer.scrollHeight
  }, [allMessages, isTyping, showEmojiPicker])
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
              {/* 3rd div starts */}
              <div>
                {/* text */}
                {msg?.text && <div className={isCurrentUserSender ? "send-message" : "received-message"}>{msg?.text}</div>}
                <div >{msg?.image && <img src={msg?.image} alt='img' height={120} width={120} />}</div>



                {/* time and tick */}
                <div className='message-timestamp' style={isCurrentUserSender ? { float: "right" } : { float: "left" }}>
                  {formatTime(msg?.createdAt)}
                  {isCurrentUserSender && msg?.read && <i style={{ color: "green" }} className='fa fa-check-circle'></i>}
                </div>
                {/* time and tick */}


              </div>
              {/* 3rd div ends*/}

            </div>
          })}

          <div>{isTyping && <i style={{ color: "grey", fontSize: 10 }}>typing...</i>}</div>

          <div>
            <AIModel />
          </div>
        </div>
        {/* chat area ends */}



        {/* emoji starts */}
        <div>
          {showEmojiPicker && <EmojiPicker style={{ height: 350, width: 300 }} onEmojiClick={(e) => setNewMessage(message + e.emoji)}></EmojiPicker>}
        </div>
        {/* emoji starts */}




        {/* input,emoji and send button */}
        <div className="send-message-div">
          <input value={message} onChange={(e) => {
            setNewMessage(e.target.value)
            socket.emit("user-typing", {
              chatId: selectedChat?._id,
              members: selectedChat?.members.map(m => m._id),
              sender: user?._id
            })

          }
          }
            type="text" className="send-message-input"
            placeholder="Type a message" />

          {/* select image */}
          <label for="file">
            <i className='fa fa-picture-o send-image-btn'></i>
            <input type='file' id='file' style={{ display: "none" }} accept='image/jpg,image/png,image/jpeg' onChange={sendImage} />
          </label>


          {/* select imgage ends */}

          {/* emoji button opener */}
          <button className='fa fa-smile-o send-emoji-btn' onClick={() => setShowEmojiPicker(!showEmojiPicker)}></button>
          {/* emoji button  */}


          {/* send button */}
          <button onClick={() => sendMessage("")} className="fa fa-paper-plane send-message-btn" aria-hidden="true"></button>
        </div>

      </div>}

    </>
  )
}

export default ChatArea