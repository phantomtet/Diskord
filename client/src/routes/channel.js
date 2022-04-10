import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
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
import moment from 'moment'
import { getDownloadURL, ref, getStorage, getBlob } from 'firebase/storage'
import app from "../secretFolder/firebase";
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
        getMessage(channelId, {params: {limit: 50, beforeId: !fromStart && chat[chat.length - 1]?._id || undefined}})
        .then(res => {
            setLoading(false)
            if (res.status === 200) {
                setChat(prev => [...prev, ...res.data])
            }
        })
    }, [channelId, chat, loading])
    // effect
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
            fetchNextData={handleFetchNextData}
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
                    <div key={item._id}>
                        <SingleMessage
                        nextData={data[index + 1]}
                        data={item}
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


const SingleMessage = React.memo( ({data, nextData}) => {
    const isSub = nextData?.author.username === data.author.username
    const isNewDay = !nextData || moment(nextData?.createdAt).format('YYYY-MM-DD') !== moment(data.createdAt).format('YYYY-MM-DD')

    const [isHover, setIsHover] = useState()
    return (
        <div
        // className="test"
        style={{
            marginBottom: 10,
            marginTop: Boolean(!isSub || isNewDay) && 10,
            
        }}
        >
            <div hidden={!isNewDay} style={{position: 'relative', border: '1px solid #41454a', margin: '20px 0'}}>
                <div style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: -6, backgroundColor: '#36393f', padding: '0 5px', fontSize: 12}}>{moment(data?.createdAt).format('MMMM DD, YYYY')}</div>
            </div>
            <div style={{display: 'flex', backgroundColor: isHover && '#32353b',
            padding: '3px', }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            >
                <div
                style={{
                    marginRight: 15,
                    minWidth: 40
                }}
                >
                    {
                        Boolean(!isSub || isNewDay) ?
                        <img
                        style={{
                            borderRadius: '100%',
                            minWidth: 40, minHeight: Boolean(!isSub || isNewDay) && 40, maxHeight: Boolean(!isNewDay && isSub) && 0, maxWidth: 40,
                            height: 40, width: '100%',                 
                        }}
                        src='https://cdn.iconscout.com/icon/free/png-256/discord-3691244-3073764.png'/>
                        :
                        <div style={{fontSize: 12, color: 'darkgray', textTransform: 'uppercase', maxWidth: 40, display: isHover ? 'flex' : 'none', justifyContent: 'center'}}>{moment(data?.createdAt).format('HH:mm')}</div>
                    }
                </div>
                <div 
                style={{
                    width: '100%'
                }}
                >
                    <div hidden={Boolean(!isNewDay && isSub)} style={{marginBottom: 10}}>
                        <Profile id={data.author?._id}>
                            {
                                ({style,...props}) => <span {...props} style={{...style, color: 'white'}}>{data.author?.username}</span>
                            }
                        </Profile>
                        <span style={{marginLeft: 10, fontSize: 12, fontWeight: 'light'}}>{moment(data?.createdAt).format('MM/DD/YYYY')}</span>
                    </div>
                    <div>
                        <span style={{color: white1, wordBreak: 'break-word'}}>{data.content}</span>
                        {/* file view */}
                        <div>
                            {
                                data.attachments.map(file => 
                                    <FileView data={file}/>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
// , (prev, next) => [next.prevData?._id, next.nextData?._id, next.data?._id].includes(prev.data._id)
)
const FileView = ({data}) => {
    const downloadFile = () => {
        const storageRef = ref(getStorage(app), data.url)
        getBlob(storageRef).then(url => console.log(url))
    }
    if (data.contentType.includes('image/')) return (
        <img src={data.url} width='100%' style={{maxWidth: 800}}/>
    )
    return (
        <div onClick={downloadFile}>{data.filename}</div>
    )
}
export default Channel