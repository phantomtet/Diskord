import React, { useState, useMemo, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TextField, IconButton, MenuItem, Menu, Popper, ClickAwayListener, Box, Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { createDM, deleteRelationship } from './../../../api/api';
import { useHistory } from 'react-router-dom';
import { setProfile } from "../../../store/profile";

const FriendList = () => {
    const [search, setSearch] = useState('')
    const list = useSelector(state => state?.profile?.relationship.filter(item => item.status === 1 && item.user?.username.includes(search)))
    const [dialogOpen, setDialogOpen] = useState(null)
    const handleRemoveFriend = useCallback((data) => {
        setDialogOpen(data)
    }, [])
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
                        onRemoveFriend={handleRemoveFriend}
                        key={index}
                        data={item.user}
                        />
                    )
                }
            </div>
            <RemoveFriendDialog
            data={dialogOpen}
            onClose={() => setDialogOpen(null)}
            />
        </div>

    )
}
const FriendListItem = React.memo(({data, onRemoveFriend}) => {
    // hook
    const history = useHistory()
    const dispatch = useDispatch()
    // redux state
    const selfId = useSelector(state => state.profile?._id)
    const dm = useSelector(state => state.profile?.dms?.find(item => item.isInbox && [data._id, selfId].every(sub_item => item.recipients.map(item => item.user._id).includes(sub_item)) ))
    // state
    const [anchorEl, setAnchorEl] = useState(null)
    // method
    const handleRemoveFriend = () => {
        setAnchorEl(null)
        onRemoveFriend(data)
    }
    const handleCreateDM = e => {
        // dispatch(setProfile(prev => ({...prev, dms: prev.dms.map(item => true ? {...item, recipients: item.recipients.map(rec => rec.user._id === selfId ? {...rec, seen: true} : rec) } : item)}) ))
        if (!dm) createDM({ recipients: [data._id] })
        else history.push(`/channel/${dm._id}`)
    }
    return (
        <div className='canclick2' onClick={handleCreateDM} style={{ height: 60, padding: '15px 0', display: 'flex', borderTop: '1px solid #42454a', justifyContent: 'space-between', borderRadius: 5}}>
            <div style={{display: 'flex'}}>
                <img className='avatar-32' style={{margin: '0 10px'}}/>
                <div>
                    <div style={{color: '#FFFFFF', fontWeight: 'bold', fontSize: 15, marginBottom: 3}}>{data?.username}</div>
                    <div style={{color: 'B9BBBE', fontSize: 13}}>Online</div>   
                </div>
            </div>
            <div style={{display: 'flex'}}>
                <IconButton><ChatBubbleIcon fontSize='small'/></IconButton>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}><MoreVertIcon fontSize='small'/></IconButton>
                <Popper
                className='popper'
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                >
                    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                        <Box style={{padding: 6}}>
                            <MenuItem style={{fontSize: 14, minWidth: 170}}>Start Video Call</MenuItem>
                            <MenuItem style={{fontSize: 14, minWidth: 170}}>Start Voice Call</MenuItem>
                            <MenuItem style={{fontSize: 14, color: '#ED4245', minWidth: 170}} onClick={handleRemoveFriend}>Remove Friend</MenuItem>
                        </Box>
                    </ClickAwayListener>
                </Popper>
            </div>
        </div>
    )
}
)
const RemoveFriendDialog = ({data, onClose}) => {
    const handleRemove = e => {
        deleteRelationship(data._id)
        onClose()
    }
    return (
        <Dialog open={Boolean(data)} onClose={onClose} maxWidth='xs'>
            <DialogTitle style={{ backgroundColor: '#36393F',}}>Remove '{data?.username}'</DialogTitle>
            <DialogContent style={{ backgroundColor: '#36393F',}}>
                Are you sure you want to permanently remove '{data?.username}' from your friends?
            </DialogContent>
            <DialogActions style={{ backgroundColor: '#2F3136'}}>
                <Button onClick={onClose} style={{ backgroundColor: '#2F3136', color: 'white', textTransform: 'capitalize', fontWeight: 'bold'}}>Cancel</Button>
                <Button onClick={handleRemove} style={{ backgroundColor: '#ED4245', color: 'white', textTransform: 'capitalize', fontWeight: 'bold'}}>Remove Friend</Button>
            </DialogActions>
        </Dialog>
    )
}

export default FriendList