import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux';
import { addRelationship } from '../../../store/profile';
import { TextField, Button } from '@mui/material';
import { socket } from './../../../socket';
import { sendFriendRequestTo } from '../../../api/api';

const AddFriendContainer = () => {
    // hook
    const dispatch = useDispatch()
    const initialResponse = useMemo(() => ({ status: null, message: ''}), [])

    // statet
    const [search, setSearch] = useState('')
    const [response, setResponse] = useState({...initialResponse})

    // method
    const handleChange = e => {
        setSearch(e.target.value)
        setResponse(initialResponse)
    }
    const handleSearch = () => {
        if (!search) return
        sendFriendRequestTo(search).then((res) => {
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
            <TextField placeholder='Search'size='small' fullWidth autoComplete='new-password'
            style={{margin: '20px 0 10px 0'}}
            value={search}
            onChange={handleChange}
            InputProps={{
                endAdornment: 
                    <Button size='small' className='test'
                    style={{backgroundColor: '#5865F2', color: 'white', textTransform: 'capitalize', fontWeight: 'bold', margin: '10px 0', cursor: search ? 'pointer' : 'not-allowed', width: 200}}
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