import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { loginUser } from "../../apiCalls/auth"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux"
import { hideLoader, showLoader } from '../../redux/loaderSlice';
import { CopyToClipboard } from 'react-copy-to-clipboard';

/////////////////// login /////////////////////////
const index = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [user, setUser] = useState({ email: "", password: "" })

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
      console.log(response)
      if (response.success) {
        localStorage.setItem("token", response.token)

        dispatch(hideLoader())
        toast.success(response.message)
        navigate("/")
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
      <div className="card">

        <div>
          <p style={{ fontWeight: "bold", textAlign: "center", color: "green" }}>Chat Fast!</p>
        </div>
        <div className="card_title">
          <h1>Login Here</h1>
        </div>

        <div className="form">
          <form onSubmit={submit}>
            <p style={{ fontSize: 14, color: "red", display: "flex", alignItems: "center", gap: 2 }}>Test Email :
              <CopyToClipboard text="rajtech645@gmail.com">
                <span style={{ cursor: "pointer", color: "grey", display: "flex", alignItems: "center" }}> Copy 🗍</span>
              </CopyToClipboard>
            </p>
            <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Email" />

            <p style={{ fontSize: 14, color: "red", display: "flex", alignItems: "center", gap: 2 }}>Test Password :
              <CopyToClipboard text="123">
                <span style={{ cursor: "pointer", color: "grey", display: "flex", alignItems: "center" }}> Copy 🗍</span>
              </CopyToClipboard>
            </p>

            <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Password" />
            <button>Login</button>
          </form>
        </div>

        <div className="card_terms">
          <span>Don't have an account yet?
            <Link to={"/signup"}>Signup Here</Link>
          </span>
        </div>

      </div>
      {/* card ends */}

    </div>
  )
}

export default index