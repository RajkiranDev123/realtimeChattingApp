import React from 'react'
import "./userlist.css"
import { useDispatch, useSelector, Provider } from "react-redux"
import { createNewChat } from "../apiCalls/chat"
import { setAllChats, setSelectedChat } from "../redux/userSlice"
import { showLoader, hideLoader } from "../redux/loaderSlice"
import { toast } from "react-hot-toast"
import moment from "moment"
import { formatName } from "../utils/formatName.js"

const UserList = ({ searchKey }) => {
    const { allUsers, allChats, user: currentUser, selectedChat } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()
    const openChat = (selectedUserId) => {
        //find : true then return first element
        const chat = allChats.find(chat =>
            chat.members.map(m => m._id).includes(currentUser._id) && chat.members.map(m => m._id).includes(selectedUserId)
        )
        if (chat) {
            dispatch(setSelectedChat(chat))
        }
    }

    const isSelectedChat = (user) => {
        if (selectedChat) {
            return selectedChat?.members.map(m => m._id).includes(user._id)
        }
        return false
    }
    const getLastMessage = (selectedUserId) => {
        const chat = allChats?.find(chat => chat?.members?.map(m => m?._id).includes(selectedUserId))
        console.log("9", chat)
        if (!chat || !chat?.lastMessage) {
            return ""
        } else {
            const msgPrefix = chat?.lastMessage?.sender === currentUser?._id ? "You : " : ""
            return msgPrefix + chat?.lastMessage?.text?.substring(0, 13)
        }
    }

    const getUnreadMessageCount = (selectedUserId) => {
        const chat = allChats?.find(chat => chat?.members?.map(m => m?._id).includes(selectedUserId))
        if (chat && chat?.unreadMessageCount && chat?.lastMessage?.sender !== currentUser?._id) {
            return chat?.unreadMessageCount
        } else {
            return ""
        }
    }
    const getLastMessageTimeStamp = (selectedUserId) => {
        const chat = allChats?.find(chat => chat?.members?.map(m => m?._id).includes(selectedUserId))
        if (!chat || !chat?.lastMessage) {
            return ""
        } else {
            return moment(chat?.lastMessage?.createdAt).format("hh:mm A")
        }
    }

    const createChat = async (searchedUserId) => {
        let response = null
        try {
            dispatch(showLoader())
            response = await createNewChat([searchedUserId, currentUser._id])
            dispatch(hideLoader())
            if (response.success) {
                toast.success(response.message)
                const newChat = response.data
                const updatedChat = [...allChats, newChat]
                dispatch(setAllChats(updatedChat))
                dispatch(setSelectedChat(newChat))
                //Components connected to Redux via useSelector will only re-render when
                //the relevant slice of state they're subscribed to changes
            }
        } catch (error) {
            toast.error(response.message)
            dispatch(hideLoader())
        }
    }

    const getData = () => {
        if (searchKey == "") {
            // chats that have logged user in members :[{_id:logged-user,},{}],lastMessage,unreadMessageCount
            return allChats
        } else {
            //////// allUsers except logged user
            return allUsers?.filter(user => {
                return (
                    user?.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
                    user?.lastName.toLowerCase().includes(searchKey.toLowerCase())
                )
            })
        }
    }
    return (
        getData().map(obj => {
            let user = obj
            if (obj.members) {
                user = obj?.members?.find(mem => mem?._id !== currentUser?._id)
            }
            return <div className="user-search-filter" onClick={() => openChat(user._id)}>

                <div className={isSelectedChat(user) ? "selected-user" : "filtered-user"}>

                    <div className="filter-user-display">
                        {/* profile pic */}
                        {user?.profilePic && <img src={""} alt="Profile Pic" className="user-profile-image" />}
                        {/* short name */}
                        {!user?.profilePic &&
                            <div className={isSelectedChat(user) ? "user-selected-avatar" : "user-default-avatar"}>
                                {user?.firstName[0]?.toUpperCase() + " " + user?.lastName[0]?.toUpperCase()}
                            </div>}
                        {/* firstname and email */}
                        <div className="filter-user-details">
                            <div className="user-display-name">  {formatName(user)}</div>
                            <div className="user-display-email">{getLastMessage(user?._id) || user?.email}</div>
                        </div>
                        {/* time and count*/}
                        <div>
                            <div style={{ color: "white", }}>{getUnreadMessageCount(user?._id)}</div>
                            <div style={{ color: "white" }}>{getLastMessageTimeStamp(user?._id)}</div>

                        </div>


                        {/* start chat button ,       collect _id's */}
                        {!allChats.find(chat => chat?.members.map(m => m?._id).includes(user?._id)) && <div className="user-start-chat">
                            <button onClick={() => createChat(user._id)} className="user-start-chat-btn">Start Chat</button>
                        </div>}

                    </div>

                </div>

            </div>
        })


    )
}

export default UserList