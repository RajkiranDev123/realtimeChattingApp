import { useState } from 'react'
// import "./sidebar.css"
import Search from './Search'
import UserList from './UserList'

//////////////////////////////////// sidebar : search and userlist ///////////////////////////////////////////

const Sidebar = ({ socket, onlineUser,handleClose }) => {
  const [searchKey, setSearchKey] = useState("")
  return (
    <div className="app-sidebar">
      <Search searchKey={searchKey} setSearchKey={setSearchKey} />
      <UserList onlineUser={onlineUser} socket={socket} searchKey={searchKey}  handleClose={handleClose}/>
    </div>

  )
}

export default Sidebar


