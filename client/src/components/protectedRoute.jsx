import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser, getAllUsers } from "../apiCalls/user.js"
import { getAllChats } from "../apiCalls/chat.js"
import { useDispatch } from "react-redux";//Provider, useSelector
import { setUser, setAllUsers, setAllChats } from "../redux/userSlice.js";
function ProtectedRoute({ children }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    //get logged user : setUser
    const getLoggedUserDB = async (e) => {
        let response = null
        try {
            response = await getLoggedUser()
            if (response.success) {
                dispatch(setUser(response?.data))
                /////////////////action.payload//////
            } else {
                navigate("/login")
            }
        } catch (error) {
            navigate("/login")
        }
    }

    //all users except logged user
    const getAllUsersFromDB = async (e) => {
        let response = null
        try {
            response = await getAllUsers()
            if (response.success) {
                dispatch(setAllUsers(response?.data))
                //setAllUsers: (state, action) => { state.allUsers = action.payload }
            } else {
                navigate("/login")
            }
        } catch (error) {
            navigate("/login")
        }
    }

    // find({ members: { $in: req.body.userId } }).populate("members") // all chats that includes/contains logged-user
    const getAllChatsFromDB = async (e) => {
        let response = null
        try {
            response = await getAllChats()
            if (response.success) {
                dispatch(setAllChats(response?.data))
            } else {
                navigate("/login")
            }
        } catch (error) {
            navigate("/login")
        }
    }

    useEffect(() => {
        // if (localStorage.getItem("token")) {
        //     getLoggedUserDB()
        //     getAllUsersFromDB()
        //     getAllChatsFromDB()
        // } else {
        //     navigate("/login")
        // }
    }, [])
    // useEffect without a dependency array runs every render 

    return (
        <div>
            {children}
        </div>
    )
}

export default ProtectedRoute

   // const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "6d" })
    
    // const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    //      req.body.userId = decodedToken.userId
    //      next()