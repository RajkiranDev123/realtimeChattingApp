import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from "../../apiCalls/auth"
import { toast } from "react-hot-toast"




/////////////////// otp /////////////////////////
const index = () => {
    const navigate = useNavigate()
    const [otp, setOtp] = useState("")



    const submit = async (e) => {
        navigate("/changePassword")
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

                <div className="card_title">
                    <h1 style={{color:"blue"}}>Check you Email , OTP is sent !</h1>
                </div>

                <div className="card_title">
                    <h1>Type your OTP!</h1>
                </div>

                {/* form starts */}
                <div className="form">
                    <form onSubmit={submit}>




                        <input type="text"
                            onChange={(e) => { }} placeholder="otp" />
                        <button>Verify OTP</button>

                    </form>
                </div>
                {/* form ends */}
                <div className="card_terms">
                    <span>
                        <Link to={"/login"}>Go Back to Login!</Link>
                    </span>
                </div>


            </div>
            {/* card ends */}

        </div>
    )
}

export default index