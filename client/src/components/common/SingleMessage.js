import React, { useEffect, useState } from 'react'
import CallIcon from '@mui/icons-material/Call';
import moment from 'moment'
import { getDownloadURL, ref, getStorage, getBlob } from 'firebase/storage'
import app from "../../secretFolder/firebase";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import { toFileSize } from "../../misc/libService";
import Profile from './Profile.component';

const SingleMessage = React.memo( ({data, nextData}) => {
    const isSub = nextData?.author.username === data.author.username
    const isNewDay = !nextData || moment(nextData?.createdAt).format('YYYY-MM-DD') !== moment(data.createdAt).format('YYYY-MM-DD')

    const [isHover, setIsHover] = useState()
    return (
        <div
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
                <div style={{display: data.type === 0 ? 'flex' : 'none'}}>
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
                            src={data.author?.avatar || '/discord_icon.ico'}/>
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
                            <span style={{color: 'lightgray', wordBreak: 'break-word'}}>{data.content}</span>
                            {/* file view */}
                            <div>
                                {
                                    data.attachments.map(file => 
                                        <FileView key={file._id} data={file}/>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{display: data.type === 3 ? 'flex' : 'none', alignItems: 'center', padding: 3}}>
                    <CallIcon style={{fill: '#3ba55c', margin: '0 20px 0 0px'}}/> <span style={{color: 'white'}}>{data.author.username}</span>&nbsp;<span style={{color: '#96989D'}}>made a called</span>
                </div>
            </div>
        </div>
    )
}
)
const FileView = ({data}) => {
    const downloadFile = () => {
        const storageRef = ref(getStorage(app), data.url)
        getBlob(storageRef).then(blob => {
            console.log(blob)
            var url = window.URL.createObjectURL(blob)
            var el = document.createElement('a')
            el.setAttribute('href', url)
            el.setAttribute('download', data.filename)
            el.click()
            el.remove()
        })
        
        
    }
    if (data.contentType.includes('image/')) return (
        <img src={data.url} width='100%' style={{maxWidth: 800}}/>
    )
    return (
        <div style={{display: 'flex'}}>
            <div style={{ backgroundColor: '#2f3136', borderColor: '#292b2f', padding: '15px 10px', alignItems: 'center', display: 'flex', borderRadius: 6,}} >
                <InsertDriveFileIcon style={{fontSize: 40, marginRight: 10, width: 40}}/>
                <div style={{display: 'flex', flexDirection: 'column', }}>
                    <div className="canclick threedottext" onClick={downloadFile} style={{color: '#18afe8', maxWidth: '30vw'}}>
                        {data.filename}
                    </div>
                    <div style={{color: '#72767D', fontSize: 12}}>{toFileSize(data.size)}</div>
                </div>
                <DownloadIcon onClick={downloadFile} className="canclick"/>
            </div>
        </div>
    )
}

export default SingleMessage