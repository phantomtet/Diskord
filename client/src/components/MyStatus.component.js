import { IconButton } from '@mui/material'
import React from 'react'
import MicIcon from '@mui/icons-material/Mic';
import HeadsetIcon from '@mui/icons-material/Headset';
import SettingsIcon from '@mui/icons-material/Settings';

const MyStatus = () => {
    return (
        <div style={{display: 'flex', alignItems: 'center', height: 52, padding: '8px', fontSize: 13, backgroundColor: '#292b2f'}}>
            <img className='avatar-32 canclick' style={{marginRight: 8}}/>
            <div>
                <div className='threedottext' style={{color: 'white', fontWeight: 'bold', width: 85 }}>Lorem Viosssssssssssssssssss</div>
                <div>#1234</div>
            </div>
            <div style={{display: 'flex'}}>
                <IconButton size='small'>
                    <MicIcon/>
                </IconButton>
                <IconButton size='small'>
                    <HeadsetIcon/>
                </IconButton>
                <IconButton size='small'>
                    <SettingsIcon/>
                </IconButton>
            </div>
        </div>
    )
}

export default MyStatus