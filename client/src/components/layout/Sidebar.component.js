
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { initializeProfile } from '../../store/profile';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({open}) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const handleLogout = () => {
        localStorage.removeItem('diskordToken')
        dispatch(initializeProfile(null))
    }
    return (
        <div
        style={{
            width: 72,
            backgroundColor: '#202225',
            paddingTop: 12,
            display: open ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'space-between',
            transition: 'all 0.5s'
        }}
        >
            <div>
                <img onClick={() => history.push('/@me')} className='pressing canclick' src='/discord_icon.ico' style={{backgroundColor: '#5865f2', width: 48, height: 48, borderRadius: '33%', margin: '0 12px 4px 12px'}}/>
                <hr color='#373a3f' style={{margin: '0 20px 8px 20px'}}/>
            </div>
            <div style={{ height: 52, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <LogoutIcon onClick={handleLogout} style={{fontSize: 30, fill: 'red'}} className='canclick pressing'/>
            </div>
        </div>
    )
}

export default Sidebar