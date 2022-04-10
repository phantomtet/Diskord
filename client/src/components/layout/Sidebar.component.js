
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { initializeProfile } from '../../store/profile';

const Sidebar = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const handleLogout = () => {
        localStorage.setItem('diskordToken', null)
        dispatch(initializeProfile(null))
    }
    return (
        <div
        style={{
            width: 72,
            backgroundColor: '#202225'
        }}
        >
            Sidebar
            <Button onClick={() => history.push('/')}>/</Button>
            <Button onClick={() => history.push('/@me')}>me</Button>
            <Button onClick={handleLogout}>Log out</Button>
        </div>
    )
}

export default Sidebar