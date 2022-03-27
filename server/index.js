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
io.on('connection', (socket) => {
    clients.push({
        socketId: socket.id,
        userId: socket.handshake.query.userId
    })
    socket.join(socket.handshake.query.userId)
    // receive message
    socket.on('disconnect', reason => {
        clients = clients.filter(item => item.socketId !== socket.id)
        // console.log('someone disconnect', clients)
    })
    console.log('current clients', clients)
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
