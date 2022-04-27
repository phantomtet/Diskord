import { Route, useHistory } from 'react-router-dom'
import SignIn from './routes/signin/signin';
import Channel from './routes/channel';
import Sidebar from './components/layout/Sidebar.component';
import Register from './routes/signin/register';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import Dashboard from './routes/@me/Dashboard';
import './App.css'
import { useSelector, useDispatch } from 'react-redux';
import { initializeProfile, setProfile } from './store/profile';
import { createConnection, disconnectConnection } from './socket';
import { socket } from './socket'
import PrivateRoute from './misc/PrivateRoute';
import { updateAvatar } from './api/api';
import IncomingCallDialog from './components/common/IncomingCallDialog';
import { setIncomingCall } from './store/incomingCallChannelData';
import PublicNotFound from './routes/Public Route/PublicNotFound';
import { Switch } from 'react-router-dom';
import LoadingScreen from './components/common/Loading';
import About from './routes/Public Route/About';

function App() {

  return (
    <div>
      <Switch>
        <Route exact path='/test' component={Test} />
        <Route exact path='/about' component={About} />

        <Route path='/(channel|@me|app|signin|register|)' component={PrivateApp} />
        <Route component={PublicNotFound} />
      </Switch>
    </div>
  )
}

export default App;

const PrivateApp = () => {
  // hook
  const dispatch = useDispatch()
  const history = useHistory()
  // redux state
  const id = useSelector(state => state.profile?._id)
  // state
  const [loading, setLoading] = useState(true)
  // effect
  useLayoutEffect(() => {
    if (!localStorage.getItem('diskordToken')) {
      setLoading(false)
      disconnectConnection()
      return
    }
    if (!id) {
      setLoading(true)
      createConnection(localStorage.getItem('diskordToken'))
      return
    }
    setLoading(false)
  }, [id])
  // socket 
  useEffect(() => {
    socket?.removeAllListeners()
    if (!id) {
      socket?.on('server send profile', profile => {
        if (!profile) {
          localStorage.removeItem('diskordToken')
        }
        else dispatch(initializeProfile(profile))
        setLoading(false)
      })
      return
    }
    socket?.on('add relationship', (user) => {
      dispatch(setProfile(prev => ({ ...prev, relationship: [...prev.relationship, user] })))
    })
    socket?.on('update relationship', (user) => {
      dispatch(setProfile(prev => ({ ...prev, relationship: prev.relationship.map(item => item.user._id === user.user._id ? user : item) })))
    })
    socket?.on('remove relationship', userId => {
      dispatch(setProfile(prev => ({ ...prev, relationship: prev.relationship.filter(item => item.user._id !== userId) })))
    })
    socket?.on('create dm', (dm, creater) => {
      dispatch(setProfile(prev => !prev.dms.find(item => item._id === dm._id) ? ({ ...prev, dms: [dm, ...prev.dms] }) : prev))
      creater === id && history.push(`/channel/${dm._id}`)
    })
    socket?.on('delete dm', dmId => {
      dispatch(setProfile(prev => ({ ...prev, dms: prev.dms.filter(item => item._id !== dmId) })))
    })
    socket?.on('update dm', dm => {
      dispatch(setProfile(prev => {
        return { ...prev, dms: [dm, ...prev.dms.filter(item => item._id !== dm._id)] }
      }))
    })
    socket?.on('profile change', profile => {
      dispatch(setProfile(prev => {
        if (profile._id === prev._id) prev = { ...prev, ...profile }
        return ({
          ...prev,
          relationship: prev.relationship.map(item => item.user._id === profile._id ? { ...item, user: profile } : item),
          dms: prev.dms.map(dm => ({ ...dm, recipients: dm.recipients.map(item => item.user._id === profile._id ? { ...item, user: profile } : item) }))
        })
      }))
    })
    socket?.on('call', ({ channel, callerId }) => {
      if (callerId === id) {
        history.push(`/channel/${channel._id}`)
        return
      }
      dispatch(setIncomingCall(channel))
    })
  }, [id])

  if (!loading) return (
    <div className='fullwidth flex'>
      {/* <Switch> */}
      <Sidebar open={Boolean(id)} />
      <div className='fullwidth'>
        <Route exact path='/signin' component={SignIn} />
        <Route exact path='/register' component={Register} />
        <PrivateRoute isAuth={Boolean(id)} path='/channel/:channelId' children={<Channel />} />
        <PrivateRoute isAuth={Boolean(id)} path='/(app|@me|)' children={<Dashboard />} />

      </div>
      <IncomingCallDialog />

      {/* </Switch> */}
    </div>
  )
  return <LoadingScreen />
}














const Test = () => {
  const handleChange = e => {
    const form = new FormData()
    form.append('avatar', e.target.files[0])
    updateAvatar(form)
  }
  console.log('test component render')
  return (
    <div style={{ backgroundColor: 'black', height: '100vh' }}>
      <input type='file' onChange={handleChange} />
    </div>
  )
}
