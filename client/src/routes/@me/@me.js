import { Button, IconButton, Divider } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { black } from '../../misc/config';
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
import FriendList from './FriendList/FriendList';
import IncomingRequestList from './IncomingFriendRequestList/IncomingRequestList';
import OutgoingRequestList from './OutgoingRequest.js/OutgoingRequestList';
import AddFriendContainer from './AddFriend/AddFriendContainer';
import { deleteDM } from './../../api/api';

const Dashboard = () => {
    // state
    const [tab, setTab] = useState('All')
    const List = useMemo(() => {
        switch (tab) {
            case 'All':
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
                            <Button style={{color: tab === 'All' ? 'white' : '#a4bbbe', textTransform: 'capitalize', marginRight: 20, fontWeight: 'bold'}}
                            onClick={e => setTab('All')}
                            >
                                All
                            </Button>
                            <IncomingRequestButton
                            active={tab === 'Incoming Requests'}
                            onClick={e => setTab('Incoming Requests')}
                            />
                            <Button style={{color: tab === 'Outgoing Requests' ? 'white' : '#a4bbbe', textTransform: 'capitalize', marginRight: 20, fontWeight: 'bold'}}
                            onClick={e => setTab('Outgoing Requests')}
                            >
                                Outgoing Requests
                            </Button>
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

const IncomingRequestButton = ({active, onClick}) => {
    const count = useSelector(state => state.profile?.relationship?.filter(item => item.status === 2).length)
    return (
        <Button style={{color: active ? 'white' : '#a4bbbe', textTransform: 'capitalize', marginRight: 20, fontWeight: 'bold'}}
        onClick={onClick}
        >
            Incoming Requests {count > 0 && <span className='noti-icon'>{count}</span>}
        </Button>

    )
}
const LeftBar = React.memo(() => {
    // hook
    const { channelId } = useParams()

    // redux state
    const dms = useSelector(state => state.profile?.dms)
    
    // state
    const [select, setSelect] = useState(null)

    // method
    const handleDeleteDM = useCallback((id) => {
        deleteDM(id)
    })
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
                        dms?.map((item, index) =>
                            <FriendButton
                            key={index}
                            index={index}
                            data={item}
                            onClick={setSelect}
                            onClose={handleDeleteDM}
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

const FriendButton = ({ onClose, onClick, isActive, index, data}) => {
    const dispatch = useDispatch()
    const [hover, ref] = useHover()

    const handleClick = e => {
        onClick(index)
    }
    return (
        <Button ref={ref} fullWidth style={{backgroundColor: black, margin: '1px 0', justifyContent: 'space-between', textTransform: 'capitalize', padding: '0 5px 0 0'}}>
            <div onClick={onClick} style={{alignItems: 'center', display: 'flex', color: isActive ? 'white' : 'lightgray', width: '100%', padding: 5}}>
                <img className='avatar-32' style={{margin: '0 10px'}}/>
                Friends
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{hover && <CloseIcon  style={{marginRight: 10}} onClick={() => onClose(data._id)}/>}</div>
        </Button>
    )
}


export default Dashboard