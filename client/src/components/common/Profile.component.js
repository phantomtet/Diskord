import { ClickAwayListener, Divider, Popper } from "@mui/material"
import { Fragment, useState, useRef, useEffect } from "react"
import { getUser } from "../../api/api"
import { black1, white1, black } from '../../misc/config';

const Profile = ({children, id}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [profileData, setProfileData] = useState('loading')
    const onClick = (e) => {
        setAnchorEl(e.target)
        setIsOpen(prev => !prev)
    }
    const style = {
        cursor: 'pointer'
    }
    useEffect(() => {
        if (!isOpen) return
        getUser(id).then(res => {
            if (res.status === 200) {
                setProfileData(res.data)
            }
        })
    }, [isOpen])
    return (
        <Fragment>
            {children({onClick, style})}
            {
                isOpen &&
                <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                    <Popper
                    open={isOpen}
                    anchorEl={anchorEl}
                    >
                        <div
                        style={{
                            width: 300,
                        }}
                        >
                            <div
                            name="header"
                            style={{
                                borderRadius: '10px 10px 0 0',
                                height: 60,
                                backgroundColor: profileData.bannerColor || 'gray',
                                position: 'relative'
                            }}
                            >
                                <img
                                style={{
                                    position: 'absolute',
                                    backgroundColor: '#18191c',
                                    height: 80,
                                    width: 80,
                                    borderRadius: '100%',
                                    bottom: -40,
                                    left: 20,
                                    border: '5px solid #18191c'
                                }}
                                src={profileData.avatar || '/discord_icon.ico'}
                                />
                            </div>
                            <div
                            style={{
                                padding: '55px 20px 20px 20px',
                                borderRadius: '0 0 10px 10px',
                                backgroundColor: '#18191c',
                            }}
                            >
                                <div style={{fontSize: 20, fontWeight: "bolder", color: "white", marginBottom: 20}}>
                                    {profileData.username}
                                    <span style={{ color: white1}}>&nbsp;#{profileData.tag}</span>
                                </div>
                                <Divider sx={{backgroundColor: '#33353b'}}/>
                                {
                                    profileData.bio &&
                                    <div name='bio' style={{padding: '10px 0', color: white1, fontSize: 12}}>
                                        <div style={{fontWeight: 'bold', marginBottom: 5}}>ABOUT ME</div>
                                        <div>{profileData.bio}</div>
                                    </div>
                                }
                            </div>
                        </div>
                    </Popper>
                </ClickAwayListener>
            }
        </Fragment>
    )
}
export default Profile