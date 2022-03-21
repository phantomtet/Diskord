
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setProfile } from '../store/profile';

const Sidebar = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    return (
        <div
        style={{
            width: 72,
        }}
        >
            Sidebar
            <Button onClick={() => history.push('/')}>a</Button>
            <Button onClick={() => history.push('/@me')}>b</Button>
        </div>
    )
}

export default Sidebar