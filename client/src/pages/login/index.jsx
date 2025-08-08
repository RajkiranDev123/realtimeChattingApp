import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from "../../apiCalls/auth"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { hideLoader, showLoader } from '../../redux/loaderSlice';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaEye } from "react-icons/fa";
import { LuEyeOff } from "react-icons/lu";

/////////////////// login /////////////////////////

const index = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [user, setUser] = useState({ email: "", password: "" }) // setUser({ ...user, password: e.target.value })
  const [hide, setHide] = useState(true) // setUser({ ...user, password: e.target.value })


  const submit = async (e) => {
    e.preventDefault()
    if (!user.email || !user.password) {
      toast.error("All fields are required!")
      return
    }
    let response = null //to access in catch block
    try {
      dispatch(showLoader())
      response = await loginUser(user)

      if (response.success) {
        localStorage.setItem("token", response.token)
        localStorage.setItem("refreshToken", response.rToken)

        dispatch(hideLoader())
        toast.success(response.message)
        setUser({ email: "", password: "" })
        navigate("/") //go to home
      } else {
        toast.error(response.message)
        dispatch(hideLoader())
      }
    } catch (error) {
      dispatch(hideLoader())
      toast.error(response.message)
    }
  }
  return (
    <div className="container">

      <div className="container-back-img"></div>
      <div className="container-back-color"></div>

      {/* card */}
      <div  className="card">

        <div>
          <p style={{ fontWeight: "bold", textAlign: "center", color: "#818589" }}>Chat Fast 📲</p>
        </div>

        <div className="card_title">
          <h1 style={{ color: "#36454F" }}>Login Here...</h1>
        </div>

        {/* form starts */}
        <div className="form">
          <form onSubmit={submit}>

            <p style={{ fontSize: 14, color: "red", display: "flex", alignItems: "center", gap: 2 }}>Test Email :
              <CopyToClipboard text="rajtech645@gmail.com">
                <span style={{ cursor: "pointer", color: "grey", display: "flex", alignItems: "center" }}> Copy!</span>
              </CopyToClipboard>
            </p>

            <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Email" />

            <p style={{ fontSize: 14, color: "red", display: "flex", alignItems: "center", gap: 2 }}>Test Password :
              <CopyToClipboard text="12345678@A">
                <span style={{ cursor: "pointer", color: "grey", display: "flex", alignItems: "center" }}> Copy!</span>
              </CopyToClipboard>
            </p>
            <span style={{ position: "relative" }}>
              <input type={hide?"password":"text"} value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Password" />
              <span style={{ position: "absolute", right: 20, top: 3 }}>
                {hide?<span style={{cursor:"pointer"}} onClick={()=>setHide(false)}><LuEyeOff/></span>: <span onClick={()=>setHide(true)} style={{cursor:"pointer"}}><FaEye/></span>}</span>
            </span>

            <button>Login</button>

          </form>
        </div>
        {/* form ends */}

        <div className="card_terms">
          <span style={{ color: "#71797E" }}>Don't have an account yet?
            <Link to={"/signup"}>Signup Here</Link>
          </span>
        </div>

        <p style={{ textAlign: "center" }}>
          <Link style={{ color: "#8A9A5B" }} to={"/email"}>Forgot password?</Link>
        </p>

      </div>
      {/* card ends */}

    </div>
  )
}

export default index