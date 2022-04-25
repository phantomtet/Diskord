import { Box, Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { signIn } from '../../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
const SignIn = () => {
    // hook
    const history = useHistory()
    // state
    const id = useSelector(state => state.profile?._id)
    const [input, setInput] = useState({
        email: '',
        password: '',
    })
    const [emailError, setEmailError] = useState(null)

    const handleSubmit = () => {
        return signIn(input)
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
                        <div style={{fontSize: 16, color: 'lightgray'}}>We're so excited to see you again!</div>
                    </div>
                    <div align='left' style={{ margin: '20px 0 10px', fontSize: 12, color: !emailError ? 'lightgray' : '#eb8385', fontWeight: 600}}>
                        EMAIL OR PHONE NUMBER <span style={{fontWeight: 450, fontStyle: 'italic', color: '#eb8385'}}>{emailError}</span>
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
                    <div align='left' style={{ margin: '20px 0 10px', fontSize: 12, color: !emailError ? 'lightgray' : '#eb8385', fontWeight: 600}}>
                        PASSWORD <span style={{fontWeight: 450, fontStyle: 'italic', color: '#eb8385'}}>{emailError}</span>
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
                    <div            
                    align='left'
                    style={{
                        padding: '4px 0 20px',
                        fontSize: 14
                    }}>
                        <span className='hover underlined'>Forgot password?</span>
                    </div>
                    <LoginButton
                    onClick={handleSubmit}
                    response={handleResponse}
                    />
                    <div style={{marginTop: 10, color: '#72767D', fontSize: 14}} align='left'>
                        Need an account? <span className='hover underlined' onClick={() => history.push('/register')}>Register here</span>
                    </div>
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

const LoginButton = ({onClick, response}) => {
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
        disabled={loading}
        variant='contained' 
        color='primary' 
        fullWidth 
        style={{height: 44, fontWeight: 600, textTransform: 'none'}}>
            { loading ? <div className='dot-flashing'/> : 'Login'}
        </Button>
    )
}

export default SignIn