import React, { useState } from 'react'
import "./sidebar.css"
import Search from './Search'
import UserList from './UserList'

const Sidebar = ({socket}) => {
  const [searchKey, setSearchKey] = useState("")
  return (
    <div className="app-sidebar">
      <Search searchKey={searchKey} setSearchKey={setSearchKey} />
      <UserList socket={socket} searchKey={searchKey} />
    </div>

  )
}

export default Sidebar