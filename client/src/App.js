import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom'
import SignIn from './routes/signin';
import Channel from './routes/channel';
import Sidebar from './components/Sidebar.component';
import Register from './routes/register';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import Dashboard from './routes/@me';

import './App.css'
import { useSelector } from 'react-redux';
export const socket = io('http://localhost:3001')

function App() {
  const profile = useSelector(state => state.profile)
  const history = useHistory()
  useEffect(() => {
    const token = localStorage.getItem('diskordToken')

    if (!token) {
      history.push('/signin')
    }
    
  }, [])
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
