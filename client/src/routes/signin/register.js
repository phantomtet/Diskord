import { Box, Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { register } from '../../api/api';

const Register = () => {
    const history = useHistory()
    const id = useSelector(state => state.profile?._id)
    const [input, setInput] = useState({
        email: '',
        username: '',
        password: '',
        date_of_birth: '',
    })
    const [emailError, setEmailError] = useState(null)

    const handleSubmit = () => {
        return register(input)
    }
    const handleResponse = (res) => {
        if (res.status === 200) {
            localStorage.setItem('diskordToken', res.data.token)
            window.location.assign('/@me')
        }
        else {
            setEmailError(res.message)
        }
    }

    // effect
    useEffect(() => {
        setEmailError(null)
    }, [input])
    useEffect(() => {
        if (id) history.push('/@me')
    }, [id])

    return (
        <div
        align='center'
        style={{
            backgroundColor: 'lightblue',
            height: '100vh',
            display: 'flex',
        }}
        >
            <Box
            style={{
                margin: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                borderRadius: 4,
                padding: 32,
                backgroundColor: '#36393f',
            }}
            sx={{
                height: {
                    xs: '100%',
                    sm: 'auto',
                },
                width: {
                    xs: '100%',
                    sm: 'auto',
                },
            }}
            >
                <div
                style={{
                    width: 414
                }}
                >
                    <div>
                        <div style={{padding: '0 0 8px', fontSize: 24, color: 'white', fontWeight: 600}}>Create account</div>
                    </div>
                    {/* email input */}
                    <div align='left' style={{ margin: '20px 0 10px', fontSize: 12, color: !emailError ? 'lightgray' : '#eb8385', fontWeight: 600}}>
                        EMAIL <span style={{fontWeight: 450, fontStyle: 'italic', color: '#eb8385'}}>{emailError}</span>
                    </div>
                    <TextField
                    autoComplete='new-password'
                    color={emailError ? 'error' : ''}
                    inputProps={{
                        style: {
                            color: 'lightgray',
                            backgroundColor: '#202225'
                        }
                    }}
                    size='small'
                    fullWidth
                    value={input.email}
                    onChange={e => setInput(prev => ({...prev, email: e.target.value}))}
                    />
                    {/* login name input */}
                    <div align='left' style={{ margin: '20px 0 10px', fontSize: 12, fontWeight: 600}}>
                        LOGIN NAME
                    </div>
                    <TextField
                    autoComplete='new-password'
                    inputProps={{
                        style: {
                            color: 'lightgray',
                            backgroundColor: '#202225'
                        }
                    }}
                    size='small'
                    fullWidth
                    value={input.username}
                    onChange={e => setInput(prev => ({...prev, username: e.target.value}))}
                    />
                    {/* password input */}
                    <div align='left' style={{ margin: '20px 0 10px', fontSize: 12, fontWeight: 600}}>
                        PASSWORD
                    </div>
                    <TextField
                    size='small'
                    inputProps={{
                        style: {
                            color: 'lightgray',
                            backgroundColor: '#202225'
                        }
                    }}
                    fullWidth
                    type='password'
                    value={input.password}
                    onChange={e => setInput(prev => ({...prev, password: e.target.value}))}
                    />
                    {/* Birthday input */}
                    <div align='left' style={{ margin: '20px 0 10px', fontSize: 12, fontWeight: 600}}>
                        BIRTHDAY
                    </div>
                    <TextField
                    size='small' type='date'
                    inputProps={{
                        style: {
                            color: 'lightgray',
                            backgroundColor: '#202225'
                        }
                    }}
                    fullWidth
                    value={input.date_of_birth}
                    onChange={e => setInput(prev => ({...prev, date_of_birth: e.target.value}))}
                    />
                    <SubmitButton
                    disabled={!Object.keys(input).every(key => input[key])}
                    onClick={handleSubmit}
                    response={handleResponse}
                    />
                    <div align='left' className='hover underlined' style={{marginTop: 10, fontSize: 14}}>
                        Already have an account?
                    </div>
                    <div align='left' style={{marginTop: 20, fontSize: 11}}>
                        By registering, you agree to Diskord's <span className='hover underlined'>Terms of Service</span>
                    </div>
                </div>
            </Box>
        </div>
    )
}

const SubmitButton = ({onClick, response, disabled}) => {
    const [loading, setLoading] = useState(false)
    const handleClick = () => {
        setLoading(true)
        onClick().then(res => {
            setLoading(false)
            response(res)
        })
    }
    return (
        <Button 
        onClick={handleClick}
        disabled={disabled || loading}
        variant='contained' 
        color='primary' 
        fullWidth 
        style={{height: 44, fontWeight: 600, textTransform: 'none', marginTop: 20}}>
            { loading ? <div className='dot-flashing'/> : 'Register'}
        </Button>
    )
}
export default Register