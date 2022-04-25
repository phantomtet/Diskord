import React, { useState, useMemo } from 'react'
import { TextField, Button } from '@mui/material';
import { sendFriendRequestTo } from '../../../api/api';

const AddFriendContainer = () => {
    // hook
    const initialResponse = useMemo(() => ({ status: null, message: ''}), [])
    // statet
    const [search, setSearch] = useState('')
    const isCorrectFormat = search.split('#').length === 2 && search.split('#').every(element => element !== '')
    const [response, setResponse] = useState({...initialResponse})

    // method
    const handleChange = e => {
        // cant write more than 1 '#' character
        let count = 0
        e.target.value.split('').forEach(key => {
            if (key === '#' || (count === 1 && isNaN(key))) count ++
        })
        if (count > 1) return
        setSearch(e.target.value)
        setResponse(initialResponse)
    }
    const handleSearch = () => {
        if (!isCorrectFormat) return
        sendFriendRequestTo({username: search.split('#')[0], tag: parseInt(search.split('#')[1])}).then((res) => {
            setResponse({
                status: res.status,
                message: res.message
            })
        })
    }
    // effect
    return (
        <div style={{padding: '15px 20px 20px 30px', width: '100%'}}>
            <h4 style={{margin: '10px 0', color: 'white'}}>ADD FRIEND</h4>
            <div style={{color: '#B9BBBE', fontSize: 14}}>You can add a friend with their Diskord tag. It's cAsE sEnSiTiVe!</div>
            <TextField placeholder='Username#0000' size='small' fullWidth autoComplete='new-password'
            style={{margin: '20px 0 10px 0'}}
            value={search}
            onChange={handleChange}
            InputProps={{
                endAdornment: 
                    <Button size='small' variant='contained'
                    style={{backgroundColor: '#5865F2', color: 'white', opacity: isCorrectFormat ? 1 : 0.5, textTransform: 'capitalize', fontWeight: 'bold', margin: '10px 0', cursor: isCorrectFormat ? 'pointer' : 'not-allowed', width: 200}}
                    onClick={handleSearch} 
                    >
                        Send Friend Request
                    </Button>,
                style: {backgroundColor: '#202225'}
            }}
            inputProps={{
                style: {color: '#cbcccd', backgroundColor: '#202225'}
            }}
            />
            <div style={{ color: response.status === 200 ? '#4FDC7C' : '#ED4245'}}>{response.message}</div>
        </div>
    )
}

export default AddFriendContainer