import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { sendMessage, getMessage, seenChannel } from './../api/api';
import Profile from '../components/common/Profile.component';
import MessageInput from './../components/common/MessageInput.component';
import { white1, grey } from "../misc/config";
import { socket } from './../socket';
import { useSelector, useDispatch } from 'react-redux';
import { LeftBar } from "./@me/@me";
import { setProfile } from "../store/profile";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const Channel = () => {
    // boiler plate
    const history = useHistory()
    const { channelId } = useParams()
    const dispatch = useDispatch()

    // redux state
    const selfId = useSelector(state => state.profile?._id)
    const dm = useSelector(state => state.profile?.dms?.find(item => item._id === channelId))
    // state
    const [guildData, setGuildData] = useState('loading')
    const [chat, setChat] = useState([])
    const [loading, setLoading] = useState(false)
    // methods
    const handleSubmit = (data) => {
        socket.emit('client send message', {
            ...data,

        })
        const form = new FormData()
        data.files?.forEach((file, index) => {
            form.append(`files`, file)
        })
        form.append('content', data.content)
        sendMessage(channelId, form)
    }
    const handleFetchNextData = (fromStart) => {
        setLoading(true)
        getMessage(channelId, {params: {limit: 50, beforeId: !fromStart && chat[chat.length - 1]?._id || undefined}})
        .then(res => {
            setLoading(false)
            if (res.status === 200) {
                setChat(prev => [...prev, ...res.data])
            }
        })
    }
    // effect
    useEffect(() => {
    },[])
    useEffect(() => {
        setChat([])
        channelId && handleFetchNextData(true)
        // console.log(dm, dm.recipients?.find(item => item.user._id === selfId)?.seen)
        channelId && !dm.recipients?.find(item => item.user._id === selfId)?.seen && seenChannel(channelId).then(res => res.status === 200 && dispatch(setProfile(prev => ({...prev, dms: prev.dms.map(item => item._id === channelId ? {...item, recipients: item.recipients.map(rec => rec.user._id === selfId ? {...rec, seen: true} : rec) } : item)}) )))
        socket?.emit('channel focus', channelId)
        socket?.off('client send message')
        socket?.on('client send message', msg => {
            msg.channelId === channelId && setChat(prev => [msg,...prev])
        })
        
        return () => {
            socket?.emit('channel focus', null)
        }
    }, [channelId])

    return (
        <div style={{display: 'flex', width: '100%'}}>
            <LeftBar/>
            {/* <RightBar/> */}
            <ChatList
            selfId={selfId}
            data={chat}
            dmData={dm}
            onSubmit={handleSubmit}
            fetchNextData={() => !loading && handleFetchNextData()}
            />
        </div>
    )
}
const ChatList = ({onSubmit, data, dmData, selfId, fetchNextData = () => true}) => {
    const handleScroll = (e) => {
        // console.log(Math.abs(e.target.scrollTop), e.target.offsetHeight, e.target.scrollHeight )
        if (Math.abs(e.target.scrollTop) + e.target.offsetHeight >= e.target.scrollHeight - 1) {
            // console.log(data[data.length - 1])
            fetchNextData()
        }
    }
    return (
        <div style={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <div style={{minHeight: 48, backgroundColor: '#36393F', borderBottom: '1px solid #2b2e33', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px'}}>
                <div>
                    {
                        !dmData?.isInbox ?
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <PeopleAltIcon style={{marginRight: 10}}/>
                            <span style={{color: 'white'}}>
                                {dmData?.recipients.filter(item => item.user?._id !== selfId).map(item => item.user.username).join(', ')}
                            </span>
                        </div>
                        :
                        <div>
                            @ &nbsp;
                            <span style={{color: 'white'}}>
                                {dmData?.recipients.find(item => item.user?._id !== selfId)?.user?.username}
                            </span>
                        </div>
                    }
                </div>
                <div>

                </div>
            </div>
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
                <br/>
                {
                    data.map((item, index) =>
                    <div key={index}>
                            <SingleMessage
                            data={item}
                            isSub={index !== data.length - 1 && data[index + 1].author.username === item.author.username}
                            />
                        </div>
                    )
                }
            </div>
            <div style={{backgroundColor: '#36393F', padding: '0 16px 20px 16px'}}>
                <MessageInput
                onSubmit={onSubmit}
                />
            </div>
        </div>
    )
}
const HeaderBar = ({channelName}) => {
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

// const RightBar = () => {

// }


const SingleMessage = ({data, isSub}) => {
    const [isHover, setIsHover] = useState()
    useLayoutEffect(() => {
        console.log(data)
    }, [isHover])
    return (
        <div
        // className="test"
        style={{
            marginBottom: 10,
        }}
        >
            <div style={{display: 'flex'}}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            >
                <div
                style={{
                    // minWidth: 48, minHeight: 48,
                    width: 48, height: isSub ? 0 : 48,
                    backgroundColor: 'red',
                    borderRadius: '100%',
                    marginRight: 15
                }}
                />
                <div 
                style={{
                    width: '100%'
                }}
                >
                    <div hidden={isSub} style={{marginBottom: 10}}>
                        <Profile id={data.author?._id}>
                            {
                                ({style,...props}) => <span {...props} style={{...style, color: 'white'}}>{data.author?.username}</span>
                            }
                        </Profile>
                    </div>
                    <div>
                        <span style={{color: white1, wordBreak: 'break-word'}}>{data.content}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Channel