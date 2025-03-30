import React from 'react'
import "./header.css"
import {  useSelector } from 'react-redux'
import {formatName} from "../utils/formatName.js"
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { user } = useSelector(state => state.userReducer)
  const navigate=useNavigate()
  // console.log(user)
  return (

    <div className="app-header">

      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        Fast Chat
      </div>

      <div className="app-user-profile">
        <div className="logged-user-name">hi, {formatName(user)}</div>

        <div style={{cursor:"pointer"}} onClick={()=>navigate("/profile")}  className="logged-user-profile-pic">{user?.firstName[0] + " " + user?.lastName[0]}</div>
      </div>

    </div>
  )
}

export default Header