import { TextField, Button, IconButton, Divider } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { black, black1 } from './../misc/config';
import PeopleIcon from '@mui/icons-material/People';
import CastleIcon from '@mui/icons-material/Castle';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MyStatus from './../components/MyStatus.component';
import { useParams } from 'react-router-dom';
import useHover from './../hooks/useHover';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HelpIcon from '@mui/icons-material/Help';
import InboxIcon from '@mui/icons-material/Inbox';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Dashboard = () => {
    return (
        <div 
        className='flex'
        style={{
            height: '100vh'
        }}
        >
            <LeftBar
            
            />
            <div
            style={{backgroundColor: '#36393f', width: '100%'}}
            >
                <div style={{height: 48, display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2b2e33'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{margin: '0 15px', alignItems:'center', display: 'flex'}}><PeopleIcon style={{marginRight: '5px'}}/> Friends</div>
                        <Divider variant='middle' orientation='vertical' flexItem style={{color: '#42454a', backgroundColor: '#42454a', width: '2px'}}/> 
                        <div>
                            <Button style={{color: '#a4bbbe', textTransform: 'capitalize', margin: '0 5px'}}>Online</Button>
                        </div>
                        <div>
                            <Button style={{color: '#a4bbbe', textTransform: 'capitalize', margin: '0 5px'}}>Online</Button>
                        </div>
                        <div>
                            <Button style={{color: '#a4bbbe', textTransform: 'capitalize', margin: '0 5px'}}>Online</Button>
                        </div>
                        <div>
                            <Button style={{color: '#a4bbbe', textTransform: 'capitalize', margin: '0 5px'}}>Online</Button>
                        </div>
                        <div>
                            <Button size='small' style={{color: 'white', backgroundColor: '#3ca55d', textTransform: 'capitalize', margin: '0 5px', fontWeight: 'bold'}}>Add Friend</Button>
                        </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div>
                            <IconButton style={{margin: '0 3px'}}><ChatBubbleIcon fontSize='small'/></IconButton>
                        </div>
                        <Divider variant='middle' orientation='vertical' flexItem style={{color: '#42454a', backgroundColor: '#42454a', width: '2px'}}/>
                        <div>
                            <IconButton style={{margin: '0 3px'}}><InboxIcon fontSize='small'/></IconButton>
                        </div>
                        <div>
                            <IconButton style={{margin: '0 3px'}}><HelpIcon fontSize='small'/></IconButton>
                        </div>
                    </div>
                </div>
                <div style={{height: 'calc(100% - 48px)', display: 'flex'}}>
                    <div style={{width: '100%'}}>
                        {/* Search */}
                        <div style={{padding: '15px 20px 20px 30px'}}>
                            <TextField placeholder='Search'size='small' fullWidth
                            InputProps={{
                                endAdornment: <IconButton disabled size='small'><SearchIcon/></IconButton>,
                                style: {backgroundColor: '#202225'}
                            }}
                            inputProps={{
                                style: {color: '#cbcccd', backgroundColor: '#202225'}
                            }}
                            />
                            {/* All friends */}
                            <div style={{marginTop: 20, fontWeight: 'bolder', fontSize: 15}}>
                                ALL FRIENDS - {0}
                            </div>
                        </div>
                        <div style={{ height: 'calc(100% - 114px)', overflow: 'hidden scroll', padding: '0px 20px 0px 30px'}}>
                            {
                                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map(item =>
                                    <FriendBiggerButton
                                    
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div style={{minWidth: 360, padding: '30px 8px 16px 16px', borderLeft: '1px solid #42454a'}}>
                        <h3 style={{color: 'white'}}>Active Now</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

const LeftBar = () => {
    const { channelId } = useParams()
    return (
        <div className='leftbar' style={{backgroundColor: '#2f3136'}}>
            <div style={{height: 48, padding: '10px', backgroundColor: '#2f3136'}}>
                <div className='canclick' style={{fontSize: 13, height: '100%', display: 'flex', alignItems: 'center', padding: '0 6px', color: 'lightgray', backgroundColor: '#202225'}}>
                    Find or start a conversation
                </div>
            </div>
            <div className='scrollbox' style={{width: '100%', height: 'calc(100% - 100px)', padding: '5px 0 5px 5px'}}>
                <div className='scrollbox-content'>
                    <Button fullWidth style={{backgroundColor: black, color: 'lightgray', margin: '1px 0', justifyContent: 'left', textTransform: 'capitalize'}}>
                        <PeopleIcon style={{margin: '0 10px'}}/>
                        Friends
                    </Button>
                    <Button fullWidth style={{backgroundColor: black, color: 'lightgray', margin: '1px 0', justifyContent: 'left', textTransform: 'capitalize'}}>
                        <CastleIcon style={{margin: '0 10px'}}/>
                        Nitro
                    </Button>
                    <div style={{fontSize: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 5px 0 15px'}}>
                        <div>DIRECT MESSAGES</div>
                        <IconButton size='small'><AddIcon/></IconButton>
                    </div>
                    {
                        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item, index) =>
                            <FriendButton
                            key={index}
                            onClick={() => console.log(item)}
                            onClose={() => console.log(2)}
                            isActive={channelId === item}
                            />
                        )
                    }

                </div>
            </div>
            <MyStatus/>
        </div>
    )
}
export default Dashboard

const FriendButton = ({ onClose, onClick, isActive}) => {
    const [hover, ref] = useHover()
    const handleClick = (e) => {
        if (e.target === ref.current) onClick(e)
    }
    return (
        <Button onClick={handleClick} ref={ref} fullWidth style={{backgroundColor: black, margin: '1px 0', justifyContent: 'space-between', textTransform: 'capitalize'}}>
            <div style={{alignItems: 'center', display: 'flex', color: isActive ? 'white' : 'lightgray'}}>
                <img className='avatar-32' style={{margin: '0 10px'}}/>
                Friends
            </div>
            {hover && <IconButton onClick={onClose} size='small' style={{margin: '-2px'}}><CloseIcon/></IconButton>}
        </Button>
    )
}

const FriendBiggerButton = () => {
    return (
        <div className='canclick' style={{ height: 60, padding: '15px 0', display: 'flex', borderTop: '1px solid #42454a', justifyContent: 'space-between'}}>
            <div style={{display: 'flex'}}>
                <img className='avatar-32' style={{marginRight: 10}}/>
                <div>
                    <div style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 15, marginBottom: 3}}>Nguyen Van A</div>
                    <div style={{color: 'B9BBBE', fontSize: 13}}>Offline</div>
                </div>
            </div>
            <div style={{display: 'flex'}}>
                <IconButton><ChatBubbleIcon fontSize='small'/></IconButton>
                <IconButton><MoreVertIcon fontSize='small'/></IconButton>
            </div>
        </div>
    )
}