import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { signupUser } from "../../apiCalls/auth"
import { toast } from "react-hot-toast"

/////////////////// signup /////////////////////////////////
const index = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  const submit = async (e) => {
    e.preventDefault()
    console.log(user)
    let response = null
    try {
      response = await signupUser(user)
      if (response.success) {
        toast.success(response.message)
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
            <button>Sign Up</button>
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