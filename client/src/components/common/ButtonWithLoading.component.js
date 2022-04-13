import { useState } from "react"

const Loading = ({children, promise, response}) => {
    const [loading, setLoading] = useState(false)
    const callAPI = async () => {
        setLoading(true)
        await promise()?.then(res => {
            response(res)
        })
        setLoading(false)
    }
    return children(loading, callAPI)
}
export default Loading