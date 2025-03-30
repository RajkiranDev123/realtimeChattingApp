

import React, { useEffect, useState } from 'react'
import "./profile.css"
import { useSelector } from 'react-redux'

const index = () => {
    const { user } = useSelector(state => state.userReducer)

    const [image, setImage] = useState("")

    function onFileSelect(e) {

        const file = e.target.files[0]
        const reader = new FileReader(file)
        reader.readAsDataURL(file)
        reader.onloadend = async () => {
            setImage(reader.result)
        }


    }

    useEffect(() => {
        setImage(user?.profilePic)
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
                    <b>Email: </b>johnsmith@gmail.com
                </div>
                <div>
                    <b>Account Created: </b>{user?.createdAt?.split("T")[0]}
                </div>
                <div className="select-profile-pic-container">
                    <input type="file" onChange={onFileSelect} />
                </div>
            </div>
        </div>
    )
}

export default index