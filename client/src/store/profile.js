import { createSlice } from '@reduxjs/toolkit'

const initialState = null
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        initializeProfile: (state, action) => {
            if (!action.payload) {
                localStorage.removeItem('diskordToken')
                return null
            }
            return action.payload
        },
        addRelationship: (state, action) => {
            state?.relationship.push(action.payload)
        },
        setProfile: (state, action) => {
            return action.payload(state)
        }
    },
})

export const { initializeProfile, setProfile} = profileSlice.actions
export default profileSlice.reducer