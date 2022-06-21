import { useLayoutEffect, useRef, useState } from "react"

const useTrackState = (trackState) => {
    const ref = useRef(trackState)
    useLayoutEffect(() => {
        ref.current = trackState
        // console.log('ref', ref.current, 'state', trackState)
    }, [trackState])

    return ref
}

export default useTrackState