import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { sendMessage, getMessage, seenChannel } from './../api/api';
import MessageInput from './../components/common/MessageInput.component';
import { socket } from './../socket';
import { useSelector, useDispatch } from 'react-redux';
import { LeftBar } from "./@me/Dashboard";
import { setProfile } from "../store/profile";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SingleMessage from "../components/common/SingleMessage";

const DmContext = React.createContext()

const Channel = () => {
    // boiler plate
    const history = useHistory()
    const { channelId } = useParams()
    const dispatch = useDispatch()

    // redux state
    const selfId = useSelector(state => state.profile?._id)
    const dm = useSelector(state => state.profile?.dms?.find(item => item._id === channelId))
    // state
    const [chat, setChat] = useState([])
    const [loading, setLoading] = useState(false)
    // methods
    const handleSubmit = useCallback((data) => {
        socket.emit('client send message', {
            ...data,

        })
        const form = new FormData()
        data.files?.forEach((file, index) => {
            form.append(`files`, file)
        })
        form.append('content', data.content)
        sendMessage(channelId, form)
    }, [channelId])
    const handleFetchNextData = useCallback((fromStart) => {
        if (loading) return
        setLoading(true)
        getMessage(channelId, { params: { limit: 50, beforeId: !fromStart && chat[chat.length - 1]?._id || undefined } })
            .then(res => {
                setLoading(false)
                if (res.status === 200) {
                    setChat(prev => [...prev, ...res.data])
                }
            })
    }, [channelId, chat, loading])
    // effect
    useLayoutEffect(() => {
        if (!dm) return history.push('/')
    }, [dm])
    useEffect(() => {
        setChat([])
        if (!dm) return
        channelId && handleFetchNextData(true)
        // console.log(dm, dm.recipients?.find(item => item.user._id === selfId)?.seen)
        channelId && !dm.recipients?.find(item => item.user._id === selfId)?.seen && seenChannel(channelId).then(res => res.status === 200 && dispatch(setProfile(prev => ({ ...prev, dms: prev.dms.map(item => item._id === channelId ? { ...item, recipients: item.recipients.map(rec => rec.user._id === selfId ? { ...rec, seen: true } : rec) } : item) }))))
        socket?.emit('channel focus', channelId)
        socket?.off('client send message')
        socket?.on('client send message', msg => {
            msg.channelId === channelId && setChat(prev => [msg, ...prev])
        })

        return () => {
            socket?.emit('channel focus', null)
        }
    }, [channelId])

    return (
        <DmContext.Provider value={dm}>
            <div style={{ display: 'flex', width: '100%' }}>
                <LeftBar />
                <div style={{ width: '100%' }}>
                    <div style={{ minHeight: 48, backgroundColor: '#36393F', borderBottom: '1px solid #2b2e33', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
                        <div>
                            {
                                !dm?.isInbox ?
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <PeopleAltIcon style={{ marginRight: 10 }} />
                                        <span style={{ color: 'white' }}>
                                            {dm?.name}
                                        </span>
                                    </div>
                                    :
                                    <div>
                                        @ &nbsp;
                                        <span style={{ color: 'white' }}>
                                            {dm?.recipients.find(item => item.user?._id !== selfId)?.user?.username}
                                        </span>
                                    </div>
                            }
                        </div>
                        <div>

                        </div>
                    </div>
                    <div style={{ display: 'flex', height: 'calc(100vh - 48px)' }}>
                        <ChatList
                            selfId={selfId}
                            data={chat}
                            onSubmit={handleSubmit}
                            fetchNextData={handleFetchNextData}
                        />
                        <RightBar />
                    </div>
                </div>
            </div>
        </DmContext.Provider>
    )
}
const ChatList = ({ onSubmit, data, fetchNextData = () => true }) => {
    const handleScroll = (e) => {
        // console.log(Math.abs(e.target.scrollTop), e.target.offsetHeight, e.target.scrollHeight )
        if (Math.abs(e.target.scrollTop) + e.target.offsetHeight >= e.target.scrollHeight - 1) {
            // console.log(data[data.length - 1])
            fetchNextData()
        }
    }
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="flex fullwidth "
                style={{
                    padding: '0 16px 0px 16px',
                    height: '100%',
                    overflow: 'auto',
                    backgroundColor: '#36393f',
                    flexDirection: 'column-reverse'
                }}
                onScroll={handleScroll}
            >
                <br />
                {
                    data.map((item, index) =>
                        <div key={item._id}>
                            <SingleMessage
                                nextData={data[index + 1]}
                                data={item}
                            />
                        </div>
                    )
                }
            </div>
            <div style={{ backgroundColor: '#36393F', padding: '0 16px 20px 16px' }}>
                <MessageInput
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    )
}
const HeaderBar = ({ channelName }) => {
    const anchorRef = useRef()
    const [open, setOpen] = useState(false)

    return (
        <div
            ref={anchorRef}
            style={{
                height: 48
            }}
        >

        </div>
    )
}

const RightBar = () => {
    const dm = useContext(DmContext)
    if (dm && !dm.isInbox) return (
        <div style={{ minWidth: 240, backgroundColor: '#2f3136', }}>
            <div style={{ padding: '24px 8px 0 16px', fontWeight: 'bold', fontSize: 14 }}>
                Members - {dm.recipients.length}

            </div>
            <div style={{padding: 8}}>
                {
                    dm.recipients.map(item =>
                        <MemberList key={item._id} data={item.user} />
                    )
                }
            </div>
        </div>
    )
    return ''
}
const MemberList = ({ data }) => {

    return (
        <div className="canclick2" style={{ height: 42, display: 'flex', padding: '0 8px', alignItems: 'center' }}>
            <img className="avatar-32" src={data.avatar || '/discord_icon.ico'} />
            <div style={{fontSize: 15, marginLeft: 10}}>{data.username}</div>
        </div>
    )
}

export default Channel