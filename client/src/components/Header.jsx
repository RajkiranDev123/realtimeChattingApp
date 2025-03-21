import React from 'react'
import "./header.css"
import {  useSelector } from 'react-redux'
import {formatName} from "../utils/formatName.js"

const Header = () => {
  const { user } = useSelector(state => state.userReducer)
  // console.log(user)
  return (

    <div className="app-header">

      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        Fast Chat
      </div>

      <div className="app-user-profile">
        <div className="logged-user-name">hi, {formatName(user)}</div>

        <div className="logged-user-profile-pic">{user?.firstName[0] + " " + user?.lastName[0]}</div>
      </div>

    </div>
  )
}

export default Header