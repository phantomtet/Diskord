import { Dialog, IconButton } from "@mui/material"
import { useState } from "react"
import CloseIcon from '@mui/icons-material/Close';

const sidebarConfig = {
    'USER SETTINGS': ['My Account', 'User Profile', 'Privacy & Safety', 'Authorized Apps', 'Connections'],
    'APP SETTINGS': ['Appearance', 'Voice & Video', 'Language', 'Advanced'],
}
const UserSettingDialog = ({open, onClose}) => {
    const [activeState, setActiveState] = useState('My Account')
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
                <div style={{width: '100%', position: 'relative'}}>
                    <IconButton onClick={onClose} style={{position: 'absolute', right: 20, top: 20}}>
                        <CloseIcon fontSize="large"/>
                    </IconButton>
                </div>
            </div>
        </Dialog>
    )
}
export default UserSettingDialog