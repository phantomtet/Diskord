import { createSlice } from '@reduxjs/toolkit'

const initialState = null
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action) => action.payload
    },
})

export const { setProfile } = profileSlice.actions
export default profileSlice.reducer