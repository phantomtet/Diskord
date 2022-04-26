import { Button, Checkbox, ClickAwayListener, Popper, TextField } from '@mui/material'
import React, { useLayoutEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { createDM } from '../../api/api'

const CreateGroupDMPopper = ({ onClose, ...rest }) => {
    // state
    const [input, setInput] = useState('')
    const [selected, setSelected] = useState([])
    // redux state
    const friends = useSelector(state => state.profile?.relationship.filter(item => selected.includes(item._id) || item.status === 1 && item.user.username.includes(input)))
    // method
    const toggleElement = id => {
        if (selected.includes(id)) {
            return setSelected(prev => prev.filter(item => item !== id))
        }
        setSelected(prev => [...prev, id])
    }
    const handleCreate = () => {
        return createDM({recipients: friends.filter(item => selected.includes(item._id)).map(item => item.user._id)})
    }
    useLayoutEffect(() => {
        setSelected([])
    }, [rest.open])
    return (
        <Popper
            {...rest}
            placement='bottom-end'
        >
            <ClickAwayListener onClickAway={onClose}>
                <div className='shadow-0' style={{ width: 440, backgroundColor: '#36393f', padding: 16, borderRadius: 4 }}>
                    <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Select Friends</div>
                    <div style={{ fontSize: 12, color: '#B9BBBE', marginBottom: 20 }}>You can add {9 - selected.length} more friends</div>
                    <TextField size='small' placeholder='Type the usename of a friend' fullWidth autoComplete='new-password'
                        inputProps={{ style: { backgroundColor: '#202225', color: 'lightgray' } }}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <div style={{ maxHeight: 200, overflowY: 'auto', margin: '16px 0' }}>
                        {
                            friends?.length ?
                                friends.map(item =>
                                    <FriendList data={item.user} key={item._id} onClick={() => toggleElement(item._id)} checked={selected.includes(item._id)} />
                                )
                                :
                                <div>
                                    No friends found that are not already in this DM.
                                </div>
                        }
                    </div>
                    <Button onClick={handleCreate} disabled={Boolean(!selected.length)} fullWidth style={{backgroundColor: '#5865F2', color: 'white', textTransform: 'capitalize', opacity: !selected.length && 0.5}}>
                        Create Group DM
                    </Button>
                </div>
            </ClickAwayListener>
        </Popper>
    )
}
export default CreateGroupDMPopper

const FriendList = ({ data, onClick, checked }) => {
    return (
        <div className='canclick2' style={{ height: 40, display: 'flex', padding: '6px 8px', justifyContent: 'space-between' }} onClick={onClick}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img className='avatar-32' src={data.avatar || '/discord_icon.ico'} />
                <div style={{ color: 'white', fontSize: 14, fontWeight: 'bold', marginLeft: 8 }}>{data.username}</div>&nbsp;<div style={{ fontSize: 13 }}>#{data.tag}</div>
            </div>
            <Checkbox checked={checked} />
        </div>
    )
}