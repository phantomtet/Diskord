import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({children, isAuth, ...rest}) => {
    // if (isAuth) return <Route {...rest} render={() => isAuth ? children : }/>
    // return <Redirect to='/signin'/>
    return <Route {...rest} render={() => isAuth ? children : <Redirect to='/signin'/>} />
}

export default PrivateRoute