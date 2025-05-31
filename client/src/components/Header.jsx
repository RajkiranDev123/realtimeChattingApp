
import "./header.css"
import { useSelector } from 'react-redux'
import { formatName } from "../utils/formatName.js"
import { useNavigate } from 'react-router-dom'


const Header = ({socket}) => {
  const { user } = useSelector(state => state.userReducer)
  const navigate = useNavigate()
  // console.log(user)
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")

    socket.emit("user-offline", user?._id)
    navigate("/login")

  }
  return (

    <div className="app-header">

      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        Fast Chat
      </div>

      <div style={{ alignItems: "center" }} className="app-user-profile">

        <div className="logged-user-name">hi, {formatName(user)}</div>

        {/* image */}
        {user?.profilePic && <img onClick={() => navigate("/profile")}
          style={{ width: 25, height: 25, borderRadius: "50%", cursor: "pointer", marginTop: 5 }} src={user?.profilePic} alt='pp' />}

        {!user?.profilePic && <div style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}
          className="logged-user-profile-pic">{user?.firstName[0] + " " + user?.lastName[0]}
        </div>}

        <i style={{ cursor: "pointer", color: "red", marginTop: 10 }} onClick={()=>logout()} className='fa fa-power-off'></i>


      </div>



    </div>
  )
}

export default Header