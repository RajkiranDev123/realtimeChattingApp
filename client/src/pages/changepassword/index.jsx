import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { changePass } from "../../apiCalls/otp"
import { toast } from "react-hot-toast"

import { useDispatch } from "react-redux"

import { hideLoader, showLoader } from '../../redux/loaderSlice';


/////////////////// change password /////////////////////////
const index = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const params = useParams()

    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")





    const submit = async (e) => {
        e.preventDefault()
        if(newPassword==""||confirmNewPassword==""){
            toast.error("All fields are required!")
        }
        if (newPassword !== confirmNewPassword) {
            toast.error("New and Confirm password must be same!")
            return
        }
        let response = null //to access in catch block
        try {
            dispatch(showLoader())
            response = await changePass(params?.email, confirmNewPassword)

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
                    <h1 style={{ color: "blue" }}>Change your password!</h1>
                </div>



                {/* form starts */}
                <div className="form">
                    <form onSubmit={submit}>




                        <input type="text"
                            onChange={(e) => { setNewPassword(e.target.value) }} placeholder="New Password" />
                        <input type="text"
                            onChange={(e) => { setConfirmNewPassword(e.target.value) }} placeholder="Confirm New Password" />
                        <button>Change Password</button>

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