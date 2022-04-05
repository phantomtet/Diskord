import React, { useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { sendMessage, getMessage, seenChannel } from './../api/api';
import Profile from '../components/common/Profile.component';
import MessageInput from './../components/common/MessageInput.component';
import { white1, grey } from "../misc/config";
import { socket } from './../socket';
import { useSelector, useDispatch } from 'react-redux';
import { LeftBar } from "./@me/@me";
import { setProfile } from "../store/profile";

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
        getMessage(channelId, {params: {limit: 20, beforeId: !fromStart && chat[chat.length - 1]?._id || undefined}})
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
            data={chat}
            onSubmit={handleSubmit}
            fetchNextData={() => !loading && handleFetchNextData()}
            />
        </div>
    )
}
const ChatList = ({onSubmit, data, fetchNextData = () => true}) => {

    const handleScroll = (e) => {
        console.log(Math.abs(e.target.scrollTop), e.target.offsetHeight, e.target.scrollHeight )
        if (Math.abs(e.target.scrollTop) + e.target.offsetHeight >= e.target.scrollHeight - 1) {
            console.log(data[data.length - 1])
            fetchNextData()
        }
    }
    return (
        <div style={{width: '100%', height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <div style={{height: 50, backgroundColor: '#36393F', borderBottom: '1px solid #2b2e33', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px'}}>
                <div>
                    {/* @ {} */}
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
                {/* <div
                style={{
                    // overflow: 'hidden scroll',
                    marginBottom: 20,
                    flexDirection: 'column-reverse',
                    display: 'flex',
                }}
            > */}
                    <br/>
                    {
                        data.map((item, index) =>
                        <div key={index}>
                                <SingleMessage
                                data={item}
                                />
                            </div>
                        )
                    }
                {/* </div> */}
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


const SingleMessage = ({data}) => {
    const [isHover, setIsHover] = useState()
    return (
        <div
        style={{
            marginTop: 17,
            display: 'flex',
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        >
            <div
            style={{
                minWidth: 48, minHeight: 48,
                width: 48, height: 48,
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
                <div>
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
    )
}
export default Channel