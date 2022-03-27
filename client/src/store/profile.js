import { createSlice } from '@reduxjs/toolkit'

const initialState = null
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            if (!action.payload) {
                localStorage.removeItem('diskordToken')
                return null
            }
            return action.payload
        }
    },
})

export const { setProfile } = profileSlice.actions
export default profileSlice.reducer