import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Route } from 'react-router-dom'

const PrivateRoute = (props) => {
    const profileId = useSelector(state => state.profile?._id)
    const history = useHistory()
    React.useEffect(() => {
        if (!profileId) history.push('/signin')
        console.log('you need to sign in first !!')
    }, [profileId])
    return <Route {...props}/>
}

export default PrivateRoute