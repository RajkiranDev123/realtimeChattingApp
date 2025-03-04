import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { loginUser } from "../../apiCalls/auth"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom";

/////////////////// login /////////////////////////
const index = () => {
  const navigate=useNavigate()

  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const submit = async (e) => {
    e.preventDefault()
    console.log(user)
    let response = null
    try {
      response = await loginUser(user)
      if (response.success) {
        localStorage.setItem("token",response.token)
        toast.success(response.message)
        navigate("/")
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error(response.message)
    }
  }
  return (
    <div className="container">
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>
      <div className="card">
        <div className="card_title">
          <h1>Login Here</h1>
        </div>
        <div className="form">
          <form onSubmit={submit}>
            <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Email" />
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
    </div>
  )
}

export default index