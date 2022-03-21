import { Box, Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { register, signIn } from '../api/api';
import { color4, color6, color8 } from '../misc/config';
import { color7 } from './../misc/config';

const Register = () => {
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
        if (res.success) {
            localStorage.setItem('diskordToken', res.token)
        }
        else {
            setEmailError(res.message)
        }
    }

    // effect
    useEffect(() => {
        setEmailError(null)
    }, [input])
    
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
                backgroundColor: color6,
            }}
            sx={{
                height: {
                    xs: '100%',
                    sm: '344px',
                },
                width: {
                    xs: '100%',
                    sm: '414px',
                    md: '720px'
                },
            }}
            >
                <div
                style={{
                    width: 414
                }}
                >
                    <div>
                        <div style={{padding: '0 0 8px', fontSize: 24, color: 'white', fontWeight: 600}}>Welcome back!</div>
                        <div style={{fontSize: 16, color: color4}}>We're so excited to see you again!</div>
                    </div>
                    <div align='left' style={{ margin: '20px 0 10px', fontSize: 12, color: !emailError ? color4 : color7, fontWeight: 600}}>
                        EMAIL OR PHONE NUMBER <span style={{fontWeight: 450, fontStyle: 'italic'}}>{emailError}</span>
                    </div>
                    <TextField
                    autoComplete='new-password'
                    color={emailError ? 'error' : ''}
                    inputProps={{
                        style: {
                            color: color8,
                        }
                    }}
                    size='small'
                    fullWidth
                    value={input.email}
                    onChange={e => setInput(prev => ({...prev, email: e.target.value}))}
                    />
                    <div align='left' style={{ margin: '20px 0 10px', fontSize: 12, color: !emailError ? color4 : color7, fontWeight: 600}}>
                        PASSWORD <span style={{fontWeight: 450, fontStyle: 'italic'}}>{emailError}</span>
                    </div>

                    <TextField
                    size='small'
                    fullWidth
                    type='password'
                    value={input.password}
                    onChange={e => setInput(prev => ({...prev, password: e.target.value}))}
                    />
                    <div            
                    align='left'
                    style={{
                        padding: '4px 0 20px',
                    }}>
                        <span className='hover underlined'>Forgot password?</span>
                    </div>
                    <SubmitButton
                    onClick={handleSubmit}
                    response={handleResponse}
                    />
                </div>
                <Box
                className='QRCode'
                sx={{
                    width: '240px',
                    display: {
                        xs: 'none',
                        sm: 'none',
                        md: 'block'
                    }
                }}
                >
                    
                </Box>
            </Box>
        </div>
    )
}

const SubmitButton = ({onClick, response}) => {
    const [loading, setLoading] = useState(false)
    const handleClick = () => {
        setLoading(true)
        try {
            onClick().then(res => {
                setLoading(false)
                response(res.data)
            })
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <Button 
        onClick={handleClick}
        disabled={loading}
        variant='contained' 
        color='primary' 
        fullWidth 
        style={{height: 44, fontWeight: 600, textTransform: 'none'}}>
            { loading ? <div className='dot-flashing'/> : 'Login'}
        </Button>
    )
}

export default Register