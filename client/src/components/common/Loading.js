import React from 'react'

const LoadingScreen = () => {

    return (
        <div style={{height: '100vh', width: '100vw', backgroundColor: '#14141a', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <img height='150px' src='/loading.gif'/>
        </div>
    )
}
export default LoadingScreen