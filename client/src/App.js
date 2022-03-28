import { Switch, Route, useHistory } from 'react-router-dom'
import SignIn from './routes/signin';
import Channel from './routes/channel';
import Sidebar from './components/layout/Sidebar.component';
import Register from './routes/register';
import { useEffect } from 'react';
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

  // effect
  useEffect(() => {
    if (!localStorage.getItem('diskordToken')) {
      history.push('/signin')
      disconnectConnection()
      return
    }
    if (!id) {
      getMe().then(res => {
        if (res.status === 200) {
          createConnection(res.data._id)
          dispatch(initializeProfile(res.data))
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
}, [id])

  return (
    <div className='fullwidth flex'>
      <Sidebar/>
      <div className='fullwidth'>
          <Switch>
            <Route exact path='/signin' component={SignIn}/>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/channel/:channelId' component={Channel}/>
            <Route exact path='/@me' component={Dashboard}/>
          </Switch>
      </div>
    </div>
  );
}

export default App;
