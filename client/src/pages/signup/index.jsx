import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { signupUser } from "../../apiCalls/auth"
import { toast } from "react-hot-toast"
import { useNavigate } from 'react-router-dom'

/////////////////// signup /////////////////////////////////
const index = () => {
  const navigate=useNavigate()
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  const submit = async (e) => {
    e.preventDefault()
    console.log(user)
    if(!user.firstName||!user.lastName||!user.email||!user.password){
      toast.error("All fields are required!")
      return

    }
    let response = null
    try {
      response = await signupUser(user)
      if (response.success) {
        toast.success(response.message)
        setUser({})
        navigate("/login")
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
          <h1>Create Account</h1>
        </div>

        <div className="form">
          <form onSubmit={submit}>
            
            <div className="column">
              <input type="text" value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} placeholder="First Name" />
              <input type="text" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} placeholder="Last Name" />
            </div>

            <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Email" />
            <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Password" />
            <button style={{cursor:"pointer"}}>Sign Up</button>
          </form>
        </div>

        <div className="card_terms">
          <span>Already have an account?
            <Link to={"/login"}>Login Here</Link>
          </span>
        </div>

      </div>

    </div>
  )
}

export default index