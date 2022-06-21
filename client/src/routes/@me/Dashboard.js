import { Button, IconButton, Divider } from '@mui/material'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import PeopleIcon from '@mui/icons-material/People';
import CastleIcon from '@mui/icons-material/Castle';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MyStatus from '../../components/common/MyStatus.component';
import { useParams, useHistory } from 'react-router-dom';
import useHover from '../../hooks/useHover';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HelpIcon from '@mui/icons-material/Help';
import InboxIcon from '@mui/icons-material/Inbox';
import { useSelector, useDispatch } from 'react-redux';
import FriendList from './FriendList/FriendList';
import IncomingRequestList from './IncomingFriendRequestList/IncomingRequestList';
import OutgoingRequestList from './OutgoingRequest.js/OutgoingRequestList';
import AddFriendContainer from './AddFriend/AddFriendContainer';
import { deleteDM } from '../../api/api';
import CreateGroupDMPopper from '../../components/common/CreateGroupDMPopper';
import LeaveChannelConfirmDialog from '../../components/common/LeaveChannelConfirmDialog';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const Dashboard = () => {
    // state
    const [tab, setTab] = useState('All')
    const List = useMemo(() => {
        switch (tab) {
            case 'All':
                return <FriendList />
            case 'Incoming Requests':
                return <IncomingRequestList />
            case 'Outgoing Requests':
                return <OutgoingRequestList />
            case null:
                return <AddFriendContainer />
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
                style={{ backgroundColor: '#36393f', width: '100%' }}
            >
                <div style={{ height: 48, display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2b2e33' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ margin: '0 15px', alignItems: 'center', display: 'flex' }}><PeopleIcon style={{ marginRight: '5px' }} /> Friends</div>
                        <Divider variant='middle' orientation='vertical' flexItem style={{ color: '#42454a', backgroundColor: '#42454a', width: '2px' }} />
                        <Button style={{ color: tab === 'All' ? 'white' : '#a4bbbe', textTransform: 'capitalize', marginRight: 20, fontWeight: 'bold' }}
                            onClick={e => setTab('All')}
                        >
                            All
                        </Button>
                        <IncomingRequestButton
                            active={tab === 'Incoming Requests'}
                            onClick={e => setTab('Incoming Requests')}
                        />
                        <Button style={{ color: tab === 'Outgoing Requests' ? 'white' : '#a4bbbe', textTransform: 'capitalize', marginRight: 20, fontWeight: 'bold' }}
                            onClick={e => setTab('Outgoing Requests')}
                        >
                            Outgoing Requests
                        </Button>
                        <div>
                            <Button size='small' style={{ color: tab === null ? '#3BA55D' : 'white', backgroundColor: tab === null ? '#36393F' : '#3ca55d', textTransform: 'capitalize', margin: '0 5px', fontWeight: 'bold' }}
                                onClick={e => setTab(null)}
                            >
                                Add Friend
                            </Button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            <IconButton style={{ margin: '0 3px' }}><ChatBubbleIcon fontSize='small' /></IconButton>
                        </div>
                        <Divider variant='middle' orientation='vertical' flexItem style={{ color: '#42454a', backgroundColor: '#42454a', width: '2px' }} />
                        <div>
                            <IconButton style={{ margin: '0 3px' }}><InboxIcon fontSize='small' /></IconButton>
                        </div>
                        <div>
                            <IconButton style={{ margin: '0 3px' }}><HelpIcon fontSize='small' /></IconButton>
                        </div>
                    </div>
                </div>
                <div style={{ height: 'calc(100% - 48px)', display: 'flex' }}>
                    {List}
                    <div style={{ minWidth: 360, padding: '30px 8px 16px 16px', borderLeft: '1px solid #42454a' }}>
                        <h3 style={{ color: 'white' }}>Active Now</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

const IncomingRequestButton = ({ active, onClick }) => {
    const count = useSelector(state => state.profile?.relationship?.filter(item => item.status === 2).length)
    return (
        <Button style={{ color: active ? 'white' : '#a4bbbe', textTransform: 'capitalize', marginRight: 20, fontWeight: 'bold' }}
            onClick={onClick}
        >
            Incoming Requests {count > 0 && <span className='noti-icon'>{count}</span>}
        </Button>

    )
}
export const LeftBar = React.memo(() => {
    // hook
    const ref = useRef()
    const history = useHistory()
    // redux state
    const dms = useSelector(state => state.profile?.dms)
    const sortedDms = useMemo(() => dms && [...dms].sort((a, b) => b.lastMessage?.createdAt - a.lastMessage?.createdAt), [dms])
    // state
    const [open, setOpen] = useState(false)
    // method
    const handleLeaveDM = useCallback(dm => {
        setOpen(dm)
    }, [])
    return (
        <div className='leftbar' style={{ backgroundColor: '#2f3136' }}>
            <div style={{ height: 48, padding: '10px', backgroundColor: '#2f3136', borderBottom: '2px solid #2b2e33' }}>
                <div className='canclick' style={{ fontSize: 13, height: '100%', display: 'flex', alignItems: 'center', padding: '0 6px', color: 'lightgray', backgroundColor: '#202225' }}>
                    Find or start a conversation
                </div>
            </div>
            <div className='scrollbox' style={{ width: '100%', height: 'calc(100% - 100px)', padding: 8 }}>
                <div className='scrollbox-content' >
                    <Button fullWidth style={{ backgroundColor: '', color: 'lightgray', margin: '1px 0', justifyContent: 'left', textTransform: 'capitalize' }}>
                        <PeopleIcon style={{ margin: '0 10px' }} />
                        Friends
                    </Button>
                    <Button fullWidth style={{ backgroundColor: '', color: 'lightgray', margin: '1px 0', justifyContent: 'left', textTransform: 'capitalize' }} onClick={() => history.push('/about')}>
                        <CastleIcon style={{ margin: '0 10px' }} />
                        About
                    </Button>
                    <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 5px 0 15px' }}>
                        <div>DIRECT MESSAGES</div>
                        <IconButton ref={ref} size='small' onClick={() => setOpen(0)}><AddIcon /></IconButton>
                    </div>
                    {
                        sortedDms?.map((item, index) =>
                            <SingleDmButton
                                key={item._id}
                                data={item}
                                onLeave={handleLeaveDM}
                            />
                        )
                    }
                </div>
            </div>
            <MyStatus />
            <CreateGroupDMPopper open={open === 0} onClose={() => setOpen(null)} anchorEl={ref.current} />
            <LeaveChannelConfirmDialog dm={open} onClose={() => setOpen(null)} />
        </div>
    )
})

const SingleDmButton = React.memo(({ data, onLeave }) => {
    const selfId = useSelector(state => state.profile?._id)
    const bool = Boolean(!data?.recipients?.find(item => item.user?._id === selfId)?.seen)
    const history = useHistory()
    const { channelId } = useParams()
    const [hover, ref] = useHover()
    const handleDeleteDM = () => {
        if (!data.isInbox) {
            onLeave && onLeave(data)
        }
        else deleteDM(data._id)
    }
    if (data) return (
        <div className={`canclick2 ${channelId === data._id && 'activated'}`} ref={ref} style={{ backgroundColor: '', margin: '1px 0', justifyContent: 'space-between', textTransform: 'capitalize', paddingLeft: 0, display: 'flex', fontSize: 14 }}>
            <div onClick={() => history.push(`/channel/${data._id}`)} style={{ alignItems: 'center', height: 42, display: 'flex', width: '100%', }}>
                <img className='avatar-32' style={{ margin: '0 10px' }} src={data?.isInbox && data?.recipients.find(item => item.user?._id !== selfId)?.user.avatar || data.avatar || '/groupicon.png'} />
                <div style={{ width: hover || bool ? 120 : 160 }}>
                    {
                        !data?.isInbox ?
                            <React.Fragment>
                                <div className='threedottext'>{data?.name}</div>
                                <div align='left'>{data?.recipients?.length} Members</div>
                            </React.Fragment>
                            :
                            <div>{data?.recipients.find(item => item.user?._id !== selfId)?.user?.username}</div>
                    }
                </div>
            </div>
            <div onClick={handleDeleteDM} style={{ display: hover || bool ? 'flex' : 'none', width: 40, justifyContent: 'center', alignItems: 'center', }}>{bool && !hover ? <FiberManualRecordIcon style={{fill: '#D83C3E', fontSize: 12}}/> : <CloseIcon fontSize='small' />}</div>
        </div>
    )
    return ''
}
)

export default Dashboard