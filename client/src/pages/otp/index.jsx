import { useState, useRef, useEffect } from 'react'
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
    // const [otp, setOtp] = useState("")

    // otp starts
    const OTP_DIGITS_COUNT = 4
    const [inputArr, setInputArr] = useState(new Array(OTP_DIGITS_COUNT).fill(""))//["","","",""]
    console.log(inputArr)

    const refArr = useRef([])

    const handleOnChange = (value, index) => {
        if (isNaN(value)) return

        const newArr = [...inputArr]
        newArr[index] = value?.trim()?.slice(-1) // 67 take 7
        setInputArr(newArr)
        value && refArr.current[index + 1]?.focus()
    }

    const handleOnKeyDown = (e, index) => {
        if (e.key == "Backspace") {
            !e.target.value && refArr.current[index - 1]?.focus()
        }
    }

    useEffect(() => {
        refArr.current[0]?.focus()
    }, [])

    // otp ends

    const submit = async () => {
       
        // e.preventDefault()
        if (!inputArr?.every(e => e)) {
            toast.error("Otp is empty!")
            return
        }

        let response = null //to access in catch block
        try {
            dispatch(showLoader())
            response = await verifyOtp(params?.email, inputArr?.join(""))

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

                    {inputArr?.map(e => <span>{e}</span>)}

                </div>





                {/* form starts */}
                <div style={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    {
                        inputArr?.map((input, index) => {
                            return (
                                <input
                                    style={{ width: 30, textAlign: "center", outline: "none",padding:4 }}
                                    key={index}
                                    type='text'
                                    value={inputArr[index]}
                                    ref={(el) => { refArr.current[index] = el }}
                                    onChange={(e) => handleOnChange(e.target.value, index)}
                                    onKeyDown={(e) => handleOnKeyDown(e, index)}
                                />
                            )
                        })
                    }
                </div>
                <div style={{ display: "flex", justifyContent: "center",marginTop:5 }}>

                    <button onClick={submit} style={{padding:5,borderRadius:3,border:"none",cursor:inputArr?.every(e=>e)?"pointer":"not-allowed"}} >Submit</button>

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