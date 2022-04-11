import { Route, useHistory } from 'react-router-dom'
import SignIn from './routes/signin/signin';
import Channel from './routes/channel';
import Sidebar from './components/layout/Sidebar.component';
import Register from './routes/signin/register';
import React, { useEffect, useState } from 'react';
import Dashboard from './routes/@me/@me';
import './App.css'
import { useSelector, useDispatch } from 'react-redux';
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
  const [loading, setLoading] = useState(true)
  // effect
  useEffect(() => {
    if (!localStorage.getItem('diskordToken')) {
      setLoading(false)
      history.push('/signin')
      disconnectConnection()
      return
    }
    if (!id) {
      setLoading(true)
      createConnection(localStorage.getItem('diskordToken'))
      return
    }
  }, [id])
  useEffect(() => {
    if (!id) {
      socket?.removeAllListeners()
      socket?.on('server send profile', profile => {
        dispatch(initializeProfile(profile))
        setLoading(false)
      })
      return
    }
    socket?.off('server send profle')
    socket?.on('request sent', (user) => {
      dispatch(setProfile(prev => ({...prev, relationship: [...prev.relationship, user]})))
    })
    socket?.on('request received', (user) => {
      dispatch(setProfile(prev => ({...prev, relationship: [...prev.relationship, user]})))
    })
    socket?.on('request accepted', (user) => {
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
    socket?.on('update dm', dm => {
      dispatch(setProfile(prev => {
        // return {...prev, dms: [dm, ...prev.dms.filter(item => item._id !== dm._id)]}
        return {...prev, dms: [dm, ...prev.dms.filter(item => item._id !== dm._id)]}
      }))
    })
  }, [id])

  if (!loading) return (
    <div className='fullwidth flex'>
      {/* <button>click</button> */}
      <Sidebar/>
      <div className='fullwidth'>
        <Route exact path='/signin' component={SignIn}/>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/channel/:channelId' component={Channel}/>
        <Route exact path='/test' component={Test}/>
        <Route exact path='/' component={Dashboard}/>
        <Route exact path='/@me' component={Dashboard}/>
      </div>
    </div>
  )
  return ''
}

export default App;















const Test = () => {
  
  const [array, setArray] = useState([1,2,3])
  const them_phan_tu_vao_dau_array = () => {
    setArray(prev => [Math.random(), ...prev])
  }
  const them_phan_tu_vao_dit_array = () => {
    setArray(prev => [...prev, Math.random()])
  }
  return (
    <div>
      <button onClick={them_phan_tu_vao_dau_array}>Thêm phần tử vào đầu array</button>
      <button onClick={them_phan_tu_vao_dit_array}>Thêm phần tử vào đít array</button>
      {
        array.map((item, index) =>
          <El data={item}/>
        )
      }
    </div>
  )
}
const El = React.memo((props) => <div>{props.data}</div>)