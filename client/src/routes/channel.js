import React, { useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { sendMessage, getMessage } from './../api/api';
import Profile from './../components/Profile.component';
import { socket } from './../App';
import MessageInput from './../components/MessageInput.component';
import { white1, grey } from "../misc/config";

const Channel = () => {
    // boiler plate
    const history = useHistory()
    const { guildId } = useParams()
    const { channelId } = useParams()

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
    const handleFetchNextData = () => {
        setLoading(true)
        getMessage(channelId, {params: {limit: 20, beforeId: chat[chat.length - 1]?._id}})
        .then(res => {
            setLoading(false)
            if (res.status === 200) {
                setChat(prev => [...prev, ...res.data])
            }
        })
    }
    // effect
    useEffect(() => {
        // setGuildData('loading')
        // if (guildId) getChannelData(guildId).then((res) => {
        //     if (res.status === 200) {
        //         setGuildData(res.data)
        //     }
        //     else setGuildData(null)
        // })
    }, [guildId])
    useEffect(() => {
        handleFetchNextData()
    }, [channelId])
    useEffect(() => {
        socket.on('client send message', data => {
            setChat(prev => [data,...prev])
        })
    }, [])

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
        if (Math.abs(e.target.scrollTop) + e.target.offsetHeight >= e.target.scrollHeight) {
            console.log(data[data.length - 1])
            fetchNextData()
        }
    }
    return (
        <React.Fragment>

            <div className="flex fullwidth"
            style={{
                padding: '0 16px 20px 16px',
                height: '100vh',
                // width: '100%',
                backgroundColor: grey,
                // display: 'flex',
                flexDirection: 'column-reverse'
            }}
            >
                {/* <div flex='true' style={{flexDirection: 'column-reverse'}}> */}
                    <MessageInput
                    onSubmit={onSubmit}
                    />
                    <div
                    style={{
                        overflow: 'hidden scroll',
                        marginBottom: 20,
                        flexDirection: 'column-reverse',
                        display: 'flex',
                    }}
                    onScroll={handleScroll}
                    >
                        {
                            data.map((item, index) =>
                                <div key={index}>
                                    <SingleMessage
                                    data={item}
                                    />
                                </div>
                            )
                        }
                    </div>

                {/* </div> */}
            </div>
        </React.Fragment>
    )
}
const LeftBar = () => {
    return (
        <div className="leftbar">
            <HeaderBar
            // channelName={}
            />
            <div
            style={{
                overflow: 'hidden auto',
                height: 'calc(100% - 100px)'
            }}
            >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            Why do we use it?
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
            Where does it come from?
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
            Where can I get some?
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
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