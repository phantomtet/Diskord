import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom'
import SignIn from './routes/signin';
import Channel from './routes/channel';
import Sidebar from './components/Sidebar.component';
import Register from './routes/register';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import Dashboard from './routes/@me';

import './App.css'
import { useSelector, useDispatch } from 'react-redux';
import { getMe } from './api/api';
import { setProfile } from './store/profile';
export const socket = io('http://localhost:3001')

function App() {
  const dispatch = useDispatch()
  const id = useSelector(state => state.profile?._id)
  const history = useHistory()
  useEffect(() => {
    if (!localStorage.getItem('diskordToken')) {
      history.push('/signin')
      return
    }
    if (!id) getMe().then(res => {
      if (res.status === 200) {
        dispatch(setProfile(res.data))
      }
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
