import { Switch, Route, useHistory } from 'react-router-dom'
import SignIn from './routes/signin';
import Channel from './routes/channel';
import Sidebar from './components/layout/Sidebar.component';
import Register from './routes/register';
import { useEffect } from 'react';
import Dashboard from './routes/@me/@me';

import './App.css'
import { useSelector, useDispatch } from 'react-redux';
import { getMe } from './api/api';
import { setProfile } from './store/profile';
import { createConnection, disconnectConnection } from './socket';

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
          dispatch(setProfile(res.data))
        }
      })
      return
    }
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
