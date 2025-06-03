import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { verifyOtp } from "../../apiCalls/otp"
import { toast } from "react-hot-toast"

import { useDispatch } from "react-redux"

import { hideLoader, showLoader } from '../../redux/loaderSlice';


///////////////////verify otp /////////////////////////
const index = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams()
    const [otp, setOtp] = useState("")

    const submit = async (e) => {

        e.preventDefault()
        if (otp == "") {
            toast.error("Otp is empty!")
            return
        }
        if (otp.length > 4 || otp.length < 4) {
            toast.error("Otp must be 4 digits!")
            return
        }
        let response = null //to access in catch block
        try {
            dispatch(showLoader())
            response = await verifyOtp(params?.email, otp)

            if (response.success) {

                dispatch(hideLoader())
                toast.success(response.message)
                navigate(`/changePassword/${params?.email}`)
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
                    <h1 style={{ color: "blue" }}>Check you Email , OTP is sent !</h1>
                </div>

                <div className="card_title">
                    <h1>Type your OTP!</h1>
                    <h3>{otp}</h3>
                </div>

                {/* form starts */}
                <div className="form">
                    <form onSubmit={submit}>
                        <input type="text"
                            onChange={(e) => { setOtp(e.target.value) }} placeholder="otp" />
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