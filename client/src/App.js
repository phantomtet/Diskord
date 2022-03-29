import { Switch, Route, useHistory, useParams } from 'react-router-dom'
import SignIn from './routes/signin';
import Channel from './routes/channel';
import Sidebar from './components/layout/Sidebar.component';
import Register from './routes/register';
import { useEffect, useState } from 'react';
import Dashboard from './routes/@me/@me';
import './App.css'
import { useSelector, useDispatch } from 'react-redux';
import { createDM, getMe } from './api/api';
import { initializeProfile, setProfile } from './store/profile';
import { createConnection, disconnectConnection } from './socket';
import { socket } from './socket'

function App() {
  // hook
  const dispatch = useDispatch()
  const history = useHistory()
  // redux state
  const id = useSelector(state => state.profile?._id)
  // state
  const [loading, setLoading] = useState(false)
  // effect
  useEffect(() => {
    if (!localStorage.getItem('diskordToken')) {
      history.push('/signin')
      disconnectConnection()
      return
    }
    if (!id) {
      setLoading(true)
      getMe().then(res => {
        if (res.status === 200) {
          createConnection(res.data._id)
          dispatch(initializeProfile(res.data))
          setLoading(false)
        }
      })
      return
    }
  }, [id])
  useEffect(() => {
    if (!id) {
      console.log('remove all listener')
      socket?.removeAllListenter()
      return
    }
    socket?.on('request sent', (user) => {
      dispatch(setProfile(prev => ({...prev, relationship: [...prev.relationship, user]})))
    })
    socket?.on('request received', (user) => {
      dispatch(setProfile(prev => ({...prev, relationship: [...prev.relationship, user]})))
    })
    socket?.on('request accepted', (user) => {
      console.log(user)
      dispatch(setProfile(prev => ({...prev, relationship: prev.relationship.map(item => item.user._id === user.user._id ? user : item)})))
    })
    socket?.on('remove relationship', userId => {
      dispatch(setProfile(prev => ({...prev, relationship: prev.relationship.filter(item => item.user._id !== userId)})))
    })
    socket?.on('create dm', dm => {
      dispatch(setProfile(prev => !prev.dms.find(item => item._id === dm._id) ? ({...prev, dms: [dm, ...prev.dms] }) : prev))
      history.push(`/channel/${dm._id}`)
    })
    socket?.on('delete dm', dmId => {
      dispatch(setProfile(prev => ({...prev, dms: prev.dms.filter(item => item._id !== dmId) })))
    })
    // socket?.on('message received', )
  }, [id])

  if (!loading) return (
    <div className='fullwidth flex'>
      <Sidebar/>
      <div className='fullwidth'>
        <Route exact path='/signin' component={SignIn}/>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/channel/:channelId' component={Channel}/>
        <Route exact path='/@me' component={Dashboard}/>
      </div>
    </div>
  )
  return ''
}

export default App;
