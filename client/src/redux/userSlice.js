import { createSlice } from "@reduxjs/toolkit"

//slice is a collection of action and reducers
const userSlice = createSlice({
    name: "user",
    initialState: { user: null, allUsers: [], allChats: [], selectedChat: null },
    reducers: {
        setUser: (state, action) => { state.user = action.payload },
        setAllUsers: (state, action) => { state.allUsers = action.payload },//except logged user
        setAllChats: (state, action) => { state.allChats = action.payload },
        setSelectedChat: (state, action) => { state.selectedChat = action.payload },
    }
})

export const { setUser, setAllUsers, setAllChats, setSelectedChat } = userSlice.actions
export default userSlice.reducer