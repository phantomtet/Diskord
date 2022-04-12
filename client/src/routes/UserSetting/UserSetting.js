import { Button, Dialog, IconButton } from "@mui/material"
import React, { useMemo, useRef, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import useHover from "../../hooks/useHover";
import { updateAvatar } from "../../api/api";
import { setProfile } from "../../store/profile";

const sidebarConfig = {
    'USER SETTINGS': ['My Account', 'User Profile', 'Privacy & Safety', 'Authorized Apps', 'Connections'],
    'APP SETTINGS': ['Appearance', 'Voice & Video', 'Language', 'Advanced'],
}
const UserSettingDialog = ({open, onClose}) => {
    const [activeState, setActiveState] = useState('My Account')
    const renderMainSetting = useMemo(() => {
        switch (activeState) {
            case 'My Account': return <MyAccount/>
        }
    }, [activeState])
    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <div style={{height: '100vh', backgroundColor: '#36393f', display: 'flex'}}>
                {/* sidebar */}
                <div style={{ padding: '60px 6px 60px 20px', overflowY: 'scroll', backgroundColor: '#2f3136', minWidth: 230}}>
                {
                        Object.keys(sidebarConfig).map(key =>
                            <div key={key}>
                                <div style={{padding: '6px 10px', fontSize: 14, fontWeight: 600}}>{key}</div>
                                {
                                    sidebarConfig[key].map(item =>
                                        <div onClick={() => setActiveState(item)} className={`${activeState === item ? 'activated': 'canclick2'}`} style={{ width: 192, padding: '6px 10px', borderRadius: 5, marginBottom: 2, fontSize: 15}}>{item}</div>
                                    )
                                }
                                <hr color='#373a3f' style={{margin: '8px 10px'}}/>
                            </div>
                        )
                    }
                </div>

                {/* Main */}
                <div style={{width: '100%', position: 'relative', padding: '66px 80px 60px 40px'}}>
                    <IconButton onClick={onClose} style={{position: 'absolute', right: 20, top: 20}}>
                        <CloseIcon fontSize="large"/>
                    </IconButton>
                    {renderMainSetting}
                </div>
            </div>
        </Dialog>
    )
}
export default UserSettingDialog


const MyAccount = () => {
    const [hover, ref] = useHover()
    const profile = useSelector(state => state.profile)
    return (
        <div style={{width: '100%'}}>
            <div style={{fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 20}}>My Account</div>

            <div style={{backgroundColor: '#202225', borderRadius: 8}}>
                {/* background */}
                <div ref={ref} style={{height: 100, backgroundColor: 'greenyellow', borderRadius: '8px 8px 0 0', opacity: hover ? 0.5 : 1, transition: 'all 0.25s'}}></div>
                <div style={{borderRadius: '0 0 8px 8px', padding: '0 15px 15px 15px', marginTop: -20}}>
                    <div style={{display: 'flex', alignItems: 'center', top: -20, marginBottom: 15 }}>
                        <Avatar src={profile?.avatar}/>
                        <div>
                            <span style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>{profile?.username}</span><span style={{fontSize: 19, fontWeight: 'bold'}}>#1234</span>
                        </div>
                    </div>
                    <div style={{borderRadius: 8, padding: '20px 20px 0 20px', backgroundColor: '#2F3136'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20}}>
                            <div>
                                <div style={{fontSize: 12, marginBottom: 8}}>USERNAME</div>
                                <div><span style={{fontSize: 14, color: 'white'}}>{profile?.username}</span><span style={{fontSize: 14}}>#1234</span></div>
                            </div>
                            <div>
                                <Button style={{backgroundColor: '#4F545C', color: 'white', textTransform: 'capitalize'}}>Edit</Button>
                            </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20}}>
                            <div>
                                <div style={{fontSize: 12, marginBottom: 8}}>EMAIL</div>
                                <div><span style={{fontSize: 14, color: 'white'}}>{profile?.email}</span></div>
                            </div>
                            <div>
                                <Button style={{backgroundColor: '#4F545C', color: 'white', textTransform: 'capitalize'}}>Edit</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr color='#42464d' style={{margin: '40px 0px'}}/>
            <div>
                <div style={{color: 'white', fontWeight: 'bold', fontSize: 18, marginBottom: 20}}>Password and Authentication</div>
                <Button style={{color: 'white', backgroundColor: '#5865f2', textTransform: 'capitalize', padding: '5px 15px'}}>Change Password</Button>
            </div>
        </div>
    )
}
const Avatar = ({src}) => {
    const dispatch = useDispatch()
    const [hover, ref] = useHover(null)
    const inputRef = useRef()
    const handleChangeAvatar = () => {
        inputRef.current?.click()
    }
    const handleSelectFile = (e) => {
        if (!e.target.files[0]) return
        console.log(e.target.files[0])
        const form = new FormData()
        form.append('avatar', e.target.files[0])
        updateAvatar(form).then(res => {
            dispatch(setProfile(prev => ({...prev, avatar: res.data.url})))
        })
    }
    return (
        <div style={{position: 'relative', display: 'flex', borderRadius: '100%', margin: '0 20px 0 5px'}} ref={ref} className="canclick"
        onClick={handleChangeAvatar}
        >
            <img src={src || '/discord_icon.ico'}
            style={{
                minWidth: 94, minHeight: 94, maxWidth: 94, maxHeight: 94, borderRadius: '100%', border: '5px solid #202225', backgroundColor: '#202225',
                opacity: hover ? 0.5 : 1, transition: 'all 0.25s'
            }}/>
            <div hidden={!hover} style={{position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', color: 'white', left: '50%', textAlign: 'center'}}>Change avatar</div>
            <input ref={inputRef} hidden type='file' onChange={handleSelectFile} accept='image/*' value=''/>
        </div>
    )
}