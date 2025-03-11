import { createSlice } from "@reduxjs/toolkit"

//slice is a collection of action and reducers
const loaderSlice = createSlice({
    name: "loader",
    initialState: {loader:false},
    reducers: {
        showLoader: (state,action) => { state.loader = true },
        hideLoader: (state) => { state.loader = false },

    }
})

export const { showLoader, hideLoader } = loaderSlice.actions
export default loaderSlice.reducer