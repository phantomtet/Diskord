import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

const FriendList = () => {
    const [search, setSearch] = useState('')
    const list = useSelector(state => state?.profile?.relationship.filter(item => item.status === 1))

    return (
        <div style={{width: '100%'}}>
            {/* Search */}
            <div style={{padding: '15px 20px 20px 30px'}}>
                <TextField placeholder='Search'size='small' fullWidth autoComplete='new-password'
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                    endAdornment: <IconButton onClick={() => setSearch('')} disabled={Boolean(!search)} size='small'>{!Boolean(search) ? <SearchIcon/> : <CloseIcon/>}</IconButton>,
                    style: {backgroundColor: '#202225'}
                }}
                inputProps={{
                    style: {color: '#cbcccd', backgroundColor: '#202225'}
                }}
                />
                <div style={{marginTop: 20, fontWeight: 'bolder', fontSize: 15}}>
                    <span style={{textTransform: 'uppercase'}}>All - {list?.length || 0}</span>
                </div>
            </div>
            <div style={{ height: 'calc(100% - 114px)', overflow: 'hidden scroll', padding: '0px 20px 0px 30px'}}>
                {
                    list?.map((item, index) =>
                        <FriendListItem
                        key={index}
                        data={item}
                        />
                    )
                }
            </div>
        </div>

    )
}
const FriendListItem = ({data}) => {
    return (
        <div className='canclick' style={{ height: 60, padding: '15px 0', display: 'flex', borderTop: '1px solid #42454a', justifyContent: 'space-between'}}>
            <div style={{display: 'flex'}}>
                <img className='avatar-32' style={{marginRight: 10}}/>
                <div>
                    <div style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 15, marginBottom: 3}}>{data?.username}</div>
                    <div style={{color: 'B9BBBE', fontSize: 13}}>Online</div>   
                </div>
            </div>
            <div style={{display: 'flex'}}>
                <IconButton><ChatBubbleIcon fontSize='small'/></IconButton>
                <IconButton><MoreVertIcon fontSize='small'/></IconButton>
            </div>
        </div>
    )
}

export default FriendList