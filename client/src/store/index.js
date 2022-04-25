import { configureStore } from "@reduxjs/toolkit";
import profileSlice from "./profile";
import incomingCallChannelSlice from "./incomingCallChannelData";
const store = configureStore({
    reducer: {
        profile: profileSlice,
        incomingCall: incomingCallChannelSlice,
    }
})
export default store
