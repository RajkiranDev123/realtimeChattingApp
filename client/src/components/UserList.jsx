import React from 'react'
import "./userlist.css"
import { useDispatch, useSelector } from "react-redux"
import { createNewChat } from "../apiCalls/chat"
import { setAllChats, setSelectedChat } from "../redux/userSlice"
import { showLoader, hideLoader } from "../redux/loaderSlice"
import { toast } from "react-hot-toast"

const UserList = ({ searchKey }) => {
    const { allUsers, allChats, user: currentUser, selectedChat } = useSelector(state => state.userReducer)
    console.log(allChats)
    const dispatch = useDispatch()
    
    const openChat = (selectedUserId) => {
        const chat = allChats.find(chat =>
            chat.members.map(m => m._id).includes(currentUser._id) && chat.members.map(m => m._id).includes(selectedUserId)
        )
        if (chat) {
            dispatch(setSelectedChat(chat))
        }
    }

    const isSelectedChat = (user) => {
        if (selectedChat) {
            return selectedChat.members.map(m => m._id).includes(user._id)
        }
        return false
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
                //Components connected to Redux via useSelector will only re-render when the relevant slice of state they're subscribed to changes
            }
        } catch (error) {
            toast.error(response.message)
            dispatch(hideLoader())


        }
    }
    return (
        allUsers.filter(user => {
            return (
                (
                    user?.firstName.toLowerCase().includes(searchKey.toLowerCase()) ||
                    user?.lastName.toLowerCase().includes(searchKey.toLowerCase())
                ) && searchKey
                || (allChats.some(chat => chat.members.map(m => m._id).includes(user._id)))

            )
            //( 0 || 0 ) && 0
            //( (2 || 0 ) && 5 || (7)  )
        }).map(user => {
            return <div className="user-search-filter" onClick={() => openChat(user._id)}>

                <div className={isSelectedChat(user) ? "selected-user" : "filtered-user"}>
                    <div className="filter-user-display">

                        {user?.profilePic && <img src={""} alt="Profile Pic" className="user-profile-image" />}

                        {!user?.profilePic &&
                            <div className={isSelectedChat(user) ? "user-selected-avatar" : "user-default-avatar"}>
                                {user?.firstName[0].toUpperCase() + " " + user?.lastName[0].toUpperCase()}
                            </div>}

                        <div className="filter-user-details">
                            <div className="user-display-name">  {user?.firstName}</div>
                            <div className="user-display-email">{user?.email}</div>
                        </div>

                        {!allChats.find(chat => chat.members.map(m => m._id).includes(user._id)) && <div className="user-start-chat">
                            <button onClick={() => createChat(user._id)}
                                className="user-start-chat-btn">Start Chat</button>
                        </div>}

                    </div>
                </div>

            </div>
        })


    )
}

export default UserList