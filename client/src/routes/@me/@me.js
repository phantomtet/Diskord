import { TextField, Button, IconButton, Divider } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { black, black1 } from '../../misc/config';
import PeopleIcon from '@mui/icons-material/People';
import CastleIcon from '@mui/icons-material/Castle';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MyStatus from '../../components/common/MyStatus.component';
import { useParams } from 'react-router-dom';
import useHover from '../../hooks/useHover';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HelpIcon from '@mui/icons-material/Help';
import InboxIcon from '@mui/icons-material/Inbox';
import { useSelector, useDispatch } from 'react-redux';
import { sendFriendRequestTo } from '../../api/api';
import FriendList from './FriendList/FriendList';
import IncomingRequestList from './IncomingFriendRequestList/IncomingRequestList';
import OutgoingRequestList from './OutgoingRequest.js/OutgoingRequestList';

const Dashboard = () => {
    // redux state
    const socket = useSelector(state => state.socket)

    // state
    const [tab, setTab] = useState('All')
    const List = useMemo(() => {
        switch (tab) {
            case 'All':
                return <FriendList/>
            case 'Online':
                return <FriendList/>
            case 'Incoming Requests':
                return <IncomingRequestList/>
            case 'Outgoing Requests':
                return <OutgoingRequestList/>
            case null:
                return <AddFriendContainer/>
            default:
                return
        }
    }, [tab])
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
                        {
                            ['All', 'Online', 'Incoming Requests', 'Outgoing Requests'].map(item =>
                                <Button style={{color: tab === item ? 'white' : '#a4bbbe', textTransform: 'capitalize', marginRight: 20, fontWeight: 'bold'}}
                                key={item}
                                onClick={e => setTab(item)}
                                >
                                    {item}
                                </Button>
                            )

                        }
                        <div>
                            <Button size='small' style={{color: tab === null ? '#3BA55D' : 'white', backgroundColor: tab === null ? '#36393F' : '#3ca55d', textTransform: 'capitalize', margin: '0 5px', fontWeight: 'bold'}}
                            onClick={e => setTab(null)}
                            >
                                Add Friend
                            </Button>
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
                    {List}
                    <div style={{minWidth: 360, padding: '30px 8px 16px 16px', borderLeft: '1px solid #42454a'}}>
                        <h3 style={{color: 'white'}}>Active Now</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

const LeftBar = React.memo(() => {
    const [select, setSelect] = useState(null)
    const { channelId } = useParams()

    return (
        <div className='leftbar' style={{backgroundColor: '#2f3136'}}>
            <div style={{height: 48, padding: '10px', backgroundColor: '#2f3136', borderBottom: '2px solid #2b2e33'}}>
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
                            onClick={() => setSelect(index)}
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
})

const FriendButton = ({ onClose, onClick, isActive}) => {
    const dispatch = useDispatch()
    const [hover, ref] = useHover()
    return (
        <Button ref={ref} fullWidth style={{backgroundColor: black, margin: '1px 0', justifyContent: 'space-between', textTransform: 'capitalize', padding: '0 5px 0 0'}}>
            <div onClick={onClick} style={{alignItems: 'center', display: 'flex', color: isActive ? 'white' : 'lightgray', width: '100%', padding: 5}}>
                <img className='avatar-32' style={{margin: '0 10px'}}/>
                Friends
            </div>
            <div>{hover && <IconButton onClick={onClose} size='small' style={{margin: '-2px'}}><CloseIcon/></IconButton>}</div>
        </Button>
    )
}

const AddFriendContainer = () => {
    const [search, setSearch] = useState('')
    const initialResponse = useMemo(() => ({ status: null, message: ''}), [])
    const [response, setResponse] = useState({...initialResponse})
    const handleChange = e => {
        setSearch(e.target.value)
        setResponse(initialResponse)
    }
    const handleSearch = () => {
        if (!search) return
        sendFriendRequestTo(search).then((res) => {
            setResponse({
                status: res.status,
                message: res.message
            })
        })
    }
    return (
        <div style={{padding: '15px 20px 20px 30px', width: '100%'}}>
            <h4 style={{margin: '10px 0', color: 'white'}}>ADD FRIEND</h4>
            <div style={{color: '#B9BBBE', fontSize: 14}}>You can add a friend with their Diskord tag. It's cAsE sEnSiTiVe!</div>
            <TextField placeholder='Search'size='small' fullWidth autoComplete='new-password'
            style={{margin: '20px 0 10px 0'}}
            value={search}
            onChange={handleChange}
            InputProps={{
                endAdornment: 
                    <Button size='small' className='test'
                    style={{backgroundColor: '#5865F2', color: 'white', textTransform: 'capitalize', fontWeight: 'bold', margin: '10px 0', cursor: search ? 'pointer' : 'not-allowed', width: 200}}
                    onClick={handleSearch} 
                    >
                        Send Friend Request
                    </Button>,
                style: {backgroundColor: '#202225'}
            }}
            inputProps={{
                style: {color: '#cbcccd', backgroundColor: '#202225'}
            }}
            />
            <div style={{ color: response.status === 200 ? '#4FDC7C' : '#ED4245'}}>{response.message}</div>
        </div>
    )
}

export default Dashboard