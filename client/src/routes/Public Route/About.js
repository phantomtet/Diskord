import React from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const About = () => {
    const history = useHistory()
    return (
        <div style={{color: 'black'}}>
            This is about page, its under construction. <span className='canclick' onClick={() => history.push('/')}>Return to App</span>
        </div>
    )
}
export default About