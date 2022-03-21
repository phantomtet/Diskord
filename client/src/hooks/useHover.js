import React, { useState, useRef, useEffect } from 'react'

const useHover = () => {
    const [hover, setHover] = useState(false)
    const ref = useRef()
    useEffect(() => {
        ref.current.onmouseenter = () => setHover(true)
        ref.current.onmouseleave = () => setHover(false)
    }, [ref])
    return [hover, ref]
}

export default useHover