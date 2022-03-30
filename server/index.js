import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import { createServer } from 'http'
import userRouter from './route/user.js'
import signInRouter from './route/signin.js'
import registerRouter from './route/register.js'
import channelRouter from './route/channel.js'
import meRouter from './route/@me.js'
import { DirectMessageModel } from './model/DM.js';
dotenv.config()


const app = express()
mongoose.connect(process.env.CONNECTION_URL)

export var clients = []
const server = createServer(app)
export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})
io.on('connection', async (socket) => {
    socket.on('disconnect', reason => {
        clients = clients.filter(item => item.socketId !== socket.id)
        console.log(clients)
    })
    // get all channel which the use is in
    const channels = await DirectMessageModel.find({'recipients.user': socket.handshake.query.userId})
    channels.forEach(channel => {
        socket.join(channel._id.toString())
    })
    clients.push({
        socketId: socket.id,
        userId: socket.handshake.query.userId,
        focusedChannel: null
    })
    socket.join(socket.handshake.query.userId)

    // leave channel
    socket.on('leave channel', channelId => {
        socket.leave(channelId)
    })
    // receive message
    socket.on('channel focus', channelId => {
        clients = clients.map(client => client.socketId === socket.id ? {...client, focusedChannel: channelId} : client)
        console.log(clients)
    })
})
// middleware
app.use(express.json())
app.use(cors())


// router
app.use('/api/signin', signInRouter)
app.use('/api/register', registerRouter)
app.use('/api/channel', channelRouter)
app.use('/api/user', userRouter)
app.use('/api/@me', meRouter)
server.listen(3001)
