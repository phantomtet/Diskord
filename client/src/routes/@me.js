import { TextField, Button, IconButton } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { color1, color2 } from './../misc/config';
import PeopleIcon from '@mui/icons-material/People';
import CastleIcon from '@mui/icons-material/Castle';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MyStatus from './../components/MyStatus.component';
import { useParams } from 'react-router-dom';
import useHover from './../hooks/useHover';

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
            <div>
                a
            </div>
        </div>
    )
}

const LeftBar = () => {
    const { channelId } = useParams()
    return (
        <div className='leftbar' style={{backgroundColor: color1}}>
            <div style={{height: 48, padding: '10px', backgroundColor: color1}}>
                <div className='canclick' style={{fontSize: 13, height: '100%', display: 'flex', alignItems: 'center', padding: '0 6px', color: 'lightgray', backgroundColor: color2}}>
                    Find or start a conversation
                </div>
            </div>
            <div className='scrollbox' style={{width: '100%', height: 'calc(100% - 100px)', padding: '5px 0 5px 5px'}}>
                <div className='scrollbox-content'>
                    <Button fullWidth style={{backgroundColor: color1, color: 'lightgray', margin: '1px 0', justifyContent: 'left', textTransform: 'capitalize'}}>
                        <PeopleIcon style={{margin: '0 10px'}}/>
                        Friends
                    </Button>
                    <Button fullWidth style={{backgroundColor: color1, color: 'lightgray', margin: '1px 0', justifyContent: 'left', textTransform: 'capitalize'}}>
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
        <Button onClick={handleClick} ref={ref} fullWidth style={{backgroundColor: color1, margin: '1px 0', justifyContent: 'space-between', textTransform: 'capitalize'}}>
            <div style={{alignItems: 'center', display: 'flex', color: isActive ? 'white' : 'lightgray'}}>
                <img className='avatar-32' style={{margin: '0 10px'}}/>
                Friends
            </div>
            {hover && <IconButton onClick={onClose} size='small' style={{margin: '-2px'}}><CloseIcon/></IconButton>}
        </Button>
    )
}