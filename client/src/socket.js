import io from 'socket.io-client'

export var socket = null
export const createConnection = (jwtToken) => {
    socket = io(process.env.REACT_APP_SOCKET_URL, {
        query: {
            jwtToken
        }
    })
}
export const disconnectConnection = () => {
    if (socket) socket.disconnect()
    socket = null
}