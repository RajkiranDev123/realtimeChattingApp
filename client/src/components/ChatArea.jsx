import { useEffect, useState } from 'react'
import { createNewMessage, getAllMessages, deleteSelectedMessage } from '../apiCalls/message'
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
import ImgModal from './ImgModal.jsx'

const ChatArea = ({ socket }) => {

  const dispatch = useDispatch()
  const { selectedChat, user, allChats } = useSelector(state => state.userReducer)

  const selectedUser = selectedChat?.members.find(u => u?._id !== user?._id)

  const [message, setNewMessage] = useState("")
  const [selectedMsg, setSelectedMsg] = useState("")

  const [data, setData] = useState(null)

  const [uploadedImage, setUploadedImage] = useState("")


  const [allMessages, setAllMessages] = useState([])

  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  //scroll down
  const scrollDown = () => {
    document.getElementById('mca').scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  //delete msg

  const deleteMsg = async () => {
    let response = null
    try {
      dispatch(showLoader())
      response = await deleteSelectedMessage(selectedMsg)
      dispatch(hideLoader())
      if (response?.success) {
        // setAllMessages([])
        getMessagesAll()

        scrollDown()
        setSelectedMsg("")

        toast.success(response?.message)

      }
    } catch (error) {
      dispatch(hideLoader())
      toast.error(error?.message)
    }
  }

  // send message
  const sendMessage = async () => {
    if (message == "") {
      toast.error("Message can't be empty!")
      return
    }
    let response = null
    try {
      const newMessage = {
        chatId: selectedChat?._id,
        sender: user?._id,
        text: message,
        image: uploadedImage
      }

      socket.emit("send-message", {//  .emit("receive-message", message) also  .emit("set-message-count", message)
        ...newMessage,
        members: selectedChat?.members?.map(m => m?._id),
        read: false,//here...not in db because receiver can be offline!
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss")
      })

      // dispatch(showLoader())
      response = await createNewMessage(newMessage)
      // dispatch(hideLoader())

      if (response.success) {
        toast.success(response.message)
        scrollDown()
        setNewMessage("")
        setUploadedImage("")
        setShowEmojiPicker(false)
      }
    } catch (error) {
      // dispatch(hideLoader())
      toast.error(error.message)
    }
  }

  // sendImage
  const upldImg = async (e) => {
    const file = e.target.files[0]

    const reader = new FileReader(file)
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      setUploadedImage(reader?.result)
      scrollDown()

    }

  }


  const getMessagesAll = async (e) => {
    let response = null
    try {
      dispatch(showLoader())
      response = await getAllMessages(selectedChat?._id)
      dispatch(hideLoader())
      if (response?.success) {
        scrollDown()

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
      socket.emit("clear-unread-messages", {//    io.to(data.members[0]).to(data.members[1]).emit("message-count-cleared", data)
        chatId: selectedChat?._id,
        members: selectedChat?.members.map(m => m._id)
      })
      response = await clearUnreadMessageCountAndMessageReadTrue(selectedChat?._id)
      //  message : chatId sender text read image ,  chat : members lastMessage unreadMessageCount
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

      toast.error(error?.message)
    }
  }


  //first useEffect
  useEffect(() => {
    getMessagesAll()
    // for receiver : set count to 0 and read to true in db
    if (selectedChat?.lastMessage?.sender !== user?._id) {
      clearUnreadCountAndTrue()//only for receiver
    }
    //dont call getAllmessages api after sending msg instead listen to an event and update the redux : api call reduced!
    socket?.off("receive-message")?.on("receive-message", message => {

      const selectedChat = store.getState().userReducer.selectedChat
      if (selectedChat?._id == message?.chatId) {//otherwise other selected chat will receive message too

       // setAllMessages(prevMsg => [...prevMsg, message]) //update on state! but you wont get _id of new msg
       getMessagesAll()

      }

      ////////////////////////////////////////////////   when receiver is online
      if (selectedChat?._id == message?.chatId && message?.sender !== user?._id) {
        scrollDown()
        clearUnreadCountAndTrue() //from db
      }
    })


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //update on redux withou making api call /////////////// message-count-cleared when : selectedChat?.lastMessage?.sender !== user?._id //////////////////////
    socket?.on("message-count-cleared", data => {
      const selectedChat = store.getState().userReducer.selectedChat
      const allChats = store.getState().userReducer.allChats

      if (selectedChat?._id == data?.chatId) {

        const updatedChats = allChats.map(chat => {
          if (chat?._id == data?.chatId) {
            return { ...chat, unreadMessageCount: 0 }
          }
          return chat
        })

        dispatch(setAllChats(updatedChats))//allChats will render on UserList Component too!

      }
      //update read to true in all Messages
      setAllMessages(prevMsgs => {
        return prevMsgs.map(msg => {
          return { ...msg, read: true }
        })
      })


    })//message count cleared ends!


    //listen to started-typing
    socket?.on("started-typing", data => {
      setData(data)//otherwise non related receiver will see user typing.. too
      if (selectedChat?._id == data?.chatId && data?.sender !== user?._id) {
        ///////////////////////////////////////// for receiver
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }
    })

  }, [selectedChat])//when selectedchat changes 



  //second useEffect
  // useEffect(() => {
  //   const msgContainer = document.getElementById("main-chat-area")
  //   msgContainer.scrollTop = msgContainer.scrollHeight
  // }, [allMessages, isTyping, showEmojiPicker])

  return (
    <>
      {selectedChat && <div className="app-chat-area" >

        {/* header */}
        <div className="app-chat-area-header">
          {formatName(selectedUser)}
        </div>
        {/* header ends */}



        {/* chat area */}
        <div className="main-chat-area" style={{background:"white"}} >
          {/* chatId:chat sender:user text read image */}
          {allMessages?.map(msg => {
            const isCurrentUserSender = msg?.sender === user?._id //user is from looged guy

            return <div className="message-container" key={msg?._id} onClick={() => setSelectedMsg(msg?._id)}
              style={{ justifyContent: isCurrentUserSender ? "end" : "start", cursor: "pointer", border: selectedMsg == msg?._id ? "1px dashed grey" : "", padding: 1 }}>
              {/* 3rd div starts */}
              <div>
                {/* text */}
                {msg?.text && <div className={isCurrentUserSender ? "send-message" : "received-message"}>{msg?.text}</div>}
                {/* image */}
                <div >{msg?.image && <img style={{ borderRadius: 3, margin: 1 }} src={msg?.image} alt='img' height={120} width={120} />}</div>

                {/* time and tick */}
                <div className='message-timestamp' style={isCurrentUserSender ? { float: "right" } : { float: "left" }}>
                  {formatTime(msg?.createdAt)}
                  {isCurrentUserSender && msg?.read && <i style={{ color: "green" }} className='fa fa-check-circle'></i>}
                </div>
                {/* time and tick */}

              </div>
              {/* 3rd div ends*/}

            </div>//message-container ends
          })}

          {/* typing indicator */}
          <div>{isTyping && selectedChat?.members?.map(m => m?._id).includes(data?.sender) && <i style={{ color: "grey", fontSize: 10 }}>typing...</i>}</div>

         

        </div>
        {/* chat area ends */}



        {/* emoji picker starts */}
        <div>
          {showEmojiPicker && <EmojiPicker style={{ height: 350, width: 300 }} onEmojiClick={(e) => setNewMessage(message + e.emoji)}></EmojiPicker>}
        </div>
        {/* emoji picker ends */}




        {/* input,image,emoji and send button */}
        <div className="send-message-div"  >

         {/* ai models */}
          <div style={{ display: "flex", gap: 2 }}>
            {/* talk */}
            <div>
              <AIModel />
            </div>
            {/* gen image */}
            <div>
              <ImgModal />
            </div>
            {selectedMsg && <div>
              <button onClick={() => deleteMsg(selectedMsg)}
                style={{ padding: 2, borderRadius: 3, background: "red", outline: "none", border: "none", color: "white", marginRight: 3, cursor: "pointer" }}>Delete</button>
              <button onClick={() => { setSelectedMsg("") }}
                style={{ padding: 2, borderRadius: 3, background: "green", outline: "none", border: "none", color: "white", cursor: "pointer" }}>Cancel</button>

            </div>}
          </div>
          {/* ai ends */}
          {uploadedImage && <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <img style={{ borderRadius: 3, margin: 1 }} width={150} height={150} src={uploadedImage} alt='uploadedImg' />
            <button onClick={() => setUploadedImage("")}
              style={{ color: "red", cursor: "pointer", background: "white", outline: "none", border: "none", borderRadius: 2, padding: 4 }}>
              X</button>
          </div>
          }
          {/* input text */}
          <input style={{ outline: "none" }} value={message} onChange={(e) => {
            setNewMessage(e.target.value)
            socket.emit("user-typing", { //  io.to(data.members[0]).to(data.members[1]).emit("started-typing", data)
              chatId: selectedChat?._id,
              members: selectedChat?.members.map(m => m._id),
              sender: user?._id
            })

          }
          }
            type="text" className="send-message-input"
            placeholder="Type..." />
          {/* input text ends */}

          {/* select image */}

          <label for="file">     {/* for="file" ==> id='file' */}
            <i className='fa fa-picture-o send-image-btn'></i>
            {/* visibility : hidden consumes space */}
            <input type='file' id='file' style={{ display: "none" }} accept='image/jpg,image/png,image/jpeg' onChange={upldImg} />
          </label>
          {/* select image ends */}

          {/* emoji button opener */}
          <button className='fa fa-smile-o send-emoji-btn' onClick={() => { scrollDown(); setShowEmojiPicker(!showEmojiPicker) }}></button>
          {/* emoji button opener ends*/}


          {/* send button */}
          <button onClick={() => sendMessage()} className="fa fa-paper-plane send-message-btn" aria-hidden="true"></button>
          {/* send button ends */}
        </div>

        <div id='mca' style={{ color: "#F9F6EE" }}>.</div>

      </div>}



    </>
  )
}

export default ChatArea