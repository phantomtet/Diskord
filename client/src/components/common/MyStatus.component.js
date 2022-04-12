import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import MicIcon from '@mui/icons-material/Mic';
import HeadsetIcon from '@mui/icons-material/Headset';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSelector } from 'react-redux';
import UserSettingDialog from '../../routes/UserSetting/UserSetting';

const MyStatus = () => {
    const profile = useSelector(state => state.profile)
    const [settingOpen, setSettingOpen] = useState(false)
    return (
        <div style={{display: 'flex', alignItems: 'center', height: 52, padding: '8px', fontSize: 13, backgroundColor: '#292b2f'}}>
            <img className='avatar-32 canclick' style={{marginRight: 8}} src={profile?.avatar || '/discord_icon.ico'}/>
            <div>
                <div className='threedottext' style={{color: 'white', fontWeight: 'bold', width: 85 }}>{profile?.username}</div>
                <div>#1234</div>
            </div>
            <div style={{display: 'flex'}}>
                <IconButton size='small'>
                    <MicIcon/>
                </IconButton>
                <IconButton size='small'>
                    <HeadsetIcon/>
                </IconButton>
                <IconButton size='small' onClick={() => setSettingOpen(true)}>
                    <SettingsIcon/>
                </IconButton>
            </div>
            <UserSettingDialog open={settingOpen} onClose={() => setSettingOpen(false)}/>
        </div>
    )
}

export default MyStatus