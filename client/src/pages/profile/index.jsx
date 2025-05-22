

import React, { useEffect, useState } from 'react'
import "./profile.css"
import { useSelector } from 'react-redux'
import { useDispatch } from "react-redux"
import { hideLoader, showLoader } from '../../redux/loaderSlice';
import { setUser } from '../../redux/userSlice.js';

import { uploadProfilePic } from "../../apiCalls/user.js"
import { toast } from "react-hot-toast"

const index = () => {
    const { user } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()
    const [image, setImage] = useState("")

    function onFileSelect(e) {
        const file = e.target.files[0]
        const reader = new FileReader(file)
        reader.readAsDataURL(file)
        reader.onloadend = async () => {
            setImage(reader.result)
        }
    }

    async function uploadProfilePicture() {

        try {
            dispatch(showLoader())
            console.log("image upload from profile base64 ==>",image)
            const response = await uploadProfilePic(image)
            dispatch(hideLoader())
            if (response?.success) {
                toast.success(response.message)
                dispatch(setUser(response.data))
            } else {
                toast.error(response?.message)
            }
        } catch (error) {
            toast.error(response?.message)
            dispatch(hideLoader())
        }
 }

    useEffect(() => {
        if (user?.profilePic) {
            setImage(user?.profilePic)
        }
    }, [])

    return (
        <div className="profile-page-container">
            <div className="profile-pic-container">
                {image && <img src={image}
                    alt="Profile Pic"
                    className="user-profile-pic-upload"
                />}
                {!image && <div className="user-default-profile-avatar">
                    {user?.firstName[0] + " " + user?.lastName[0]}


                </div>}
            </div>

            <div className="profile-info-container">

                <div className="user-profile-name">
                    <h1>{user?.firstName.at(0).toUpperCase() + user?.firstName?.slice(1) + " " + user?.lastName.at(0).toUpperCase() + user?.lastName?.slice(1)} </h1>
                </div>
                <div>
                    <b>Email: </b>{user?.email}
                </div>
                <div>
                    <b>Account Created: </b>{user?.createdAt?.split("T")[0]}
                </div>
                <div className="select-profile-pic-container">
                    <input type="file" onChange={onFileSelect} />
                   { image&&<button style={{background:"blue",border:"none",borderRadius:3,padding:3,color:"white",cursor:"pointer"}} 
                    onClick={uploadProfilePicture}>Upload </button>}
                </div>
            </div>
        </div>
    )
}

export default index