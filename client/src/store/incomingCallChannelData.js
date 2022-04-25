import { createSlice } from '@reduxjs/toolkit'

const initialState = null
const incomingCallChannelSlice = createSlice({
    name: 'incoming call',
    initialState,
    reducers: {
        setIncomingCall: (state, action) => {
            return action.payload !== undefined ? action.payload : action.payload(state)
        }
    },
})

export const { setIncomingCall} = incomingCallChannelSlice.actions
export default incomingCallChannelSlice.reducer