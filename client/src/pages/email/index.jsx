import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOtp } from "../../apiCalls/otp"
import { toast } from "react-hot-toast"
import {useDispatch} from "react-redux"

import { hideLoader, showLoader } from '../../redux/loaderSlice';



/////////////////// email /////////////////////////
const index = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [email, setEmail] = useState("")



    const submit = async (e) => {
        // navigate("/otp")
        e.preventDefault()
        if (!email) {
            toast.error("All fields are required!")
            return
        }
        let response = null //to access in catch block
        try {
            dispatch(showLoader())
            response = await getOtp(email)

            if (response.success) {

                dispatch(hideLoader())
                toast.success(response.message)
                // navigate("/")
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
                    <h1>Type your registered email to get OTP!</h1>
                </div>

                {/* form starts */}
                <div className="form">
                    <form onSubmit={submit}>




                        <input type="email"
                            onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" />
                        <button>Submit</button>

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