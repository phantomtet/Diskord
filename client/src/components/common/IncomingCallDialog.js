import { Dialog, IconButton } from '@mui/material'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIncomingCall } from '../../store/incomingCallChannelData'
import CloseIcon from '@mui/icons-material/Close'
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import { useHistory } from 'react-router-dom'

const IncomingCallDialog = () => {
    // hook
    const history = useHistory()
    const dispatch = useDispatch()
    // redux state
    const selfId = useSelector(state => state.profile?._id)
    const { incomingCall } = useSelector(state => state)

    // method
    const handleClose = useCallback((e) => {
        dispatch(setIncomingCall(null))
    }, [])
    const acceptCall = () => {
        history.push(`/channel/${incomingCall._id}`)
        dispatch(setIncomingCall(null))
    }
    return (
        <Dialog open={Boolean(incomingCall)} onClose={handleClose}>
            <div style={{ width: 220, backgroundColor: '#2370eb', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 10px' }}>
                <img src={incomingCall?.isInbox && incomingCall?.recipients.find(item => item.user?._id !== selfId)?.user.avatar || '/discord_icon.ico'} style={{ width: 96, height: 96, borderRadius: '100%', border: '3px solid white', marginBottom: 10 }} />
                {
                    !incomingCall?.isInbox ?
                        <React.Fragment>
                            <div style={{color: 'white'}}>{incomingCall?.name}</div>
                        </React.Fragment>
                        :
                        <div style={{color: 'white'}}>{incomingCall?.recipients.find(item => item.user?._id !== selfId)?.user?.username}</div>
                }
                <marquee style={{margin: '5px 0 20px'}}>Incoming Video Call...</marquee>
                {/* action */}
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 20}}>
                    <IconButton className='pressing' style={{borderRadius: '100%', width: 56, height: 56, backgroundColor: '#cc2121'}} onClick={handleClose}><CloseIcon/></IconButton>
                    <IconButton className='pressing' style={{borderRadius: '100%', width: 56, height: 56, backgroundColor: '#42b837'}} onClick={acceptCall}><VideocamIcon/></IconButton>
                    <IconButton className='pressing' style={{borderRadius: '100%', width: 56, height: 56, backgroundColor: '#42b837'}} onClick={acceptCall}><CallIcon/></IconButton>
                </div>
                <div style={{fontSize: 13, color: 'white'}} className='canclick'>Preview my camera</div>
            </div>
        </Dialog>
    )
}
export default IncomingCallDialog