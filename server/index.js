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
import meRouter, { getUserProfile } from './route/@me.js'
import { DirectMessageModel } from './model/DM.js';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin'

dotenv.config()
const firebaseConfig = {
    apiKey: "AIzaSyCtaB2LwgD9LyIVCt-c04yjTFwnx_sMctQ",
    authDomain: "diskord-166.firebaseapp.com",
    projectId: "diskord-166",
    storageBucket: "diskord-166.appspot.com",
    messagingSenderId: "366426352372",
    appId: "1:366426352372:web:1175d9e2a1172de0d5cca1",
    measurementId: "G-92259DQW03"
};
export const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "diskord-166",
        "private_key_id": "632186b5a50c00e352af898ef937b7c4839cf485",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCvZDt9PzTTPiK5\nkKFreA/FHulmN2OhYiqJIl/ohtyeIWWC6cHN7Fm1hPn+U4NeM1dkmQgXkqwTEiuy\nKm6H2aRaj+WEQbZzCGtNToMLyLYsOl8N4LRNefHuNM+keUStvR9bl/Z3gX087fSb\nTZj1S/Quhf836q748XZhTPiBrqUDupax1kQ+bCLhm+rlAnom3Ai3zCZK6oyjCeQe\nVi128+UxFnVUKpTNisyowROc2Oa3YBGV3WpiBXGLCj+LNF5T0SItXBw1omywH1qK\nJ2R3b8bF1ZdS6W8iydCbfvusWKNKecZvjd3W0bAg6tuLM+DzuZ8lKQ9PmASs2ne9\nuHU/z8PrAgMBAAECggEAD15Cgi58I/hhVY4xPrf19clIHT9EORtfa8W5zqemhCqb\n+PUfmLoZgDjHKPxLWgE4qqVoGpys/DzO3F0wczHkX1UVgNm7MWgu8saq3+j14Xk5\n4/7o/ZLuWneBLEG9/VVBfqaZn44WmbSmBsetW+0MV9lA7DbhnwmVXGBAtChH6EQX\niS/GMig1b+0/W+t64qkr3MRVzHlhmBHo4k56gPobrZN58lgVdJXvn1E2IrkHNPLM\nvfuAm2E4HR00o6KJc/+x9PBpJuk1rYpXwPCL2YllswVztLlzYDdyNehyITHejJwZ\n1ONPIRwBElLb9z3lC+v+zzWyw1s5mdd4TDkdonjZDQKBgQDfkVa+0L1wtaBGA6sQ\n/waOgVAMk1eefxzKLXpE7/AKZ5HL0rMG6H0dWJUwwxGma+WxlKFpnRIy/98OlqCG\ndlThwR+sGHiTa0sgxyH6IzyJALBJxNeXdlgJvXoxmmZuKyC5HlCHMqZPfOeqDUz+\nRttCVBzWgLHa1N1K7fYHjvssJQKBgQDI1cS25JTKdjj5JqubysVWpA2mns1CjfWS\n1PVIYErdDXN5vxM2wXvJsXPAQneF7f5jzcc+ij8HyOAVyoIvh6mXZGVbtEui5H2u\n1pnDqc4I0BVVTdK2f6wAXAoA5afy5mPun+UArDAYS5GuFoy1s8yFMmM4hBg0zrDe\nz3k8EcUqzwKBgHmuiz40Msejs2YoHPWVOKZbb4xIrcnQeYT5F7FpvoaLNGlxdotu\nApr0Wc8+fN7Nnyj2MpxfJ0amyWsRRLGquixdhrWOZCIopa1jdPTGNO6Ed27POmBv\nwx8aB+XzmYig5KCdBUtwn+BnpVeDAcLsIe6KBWAij6sBbKiZt+0JP2AZAoGAaBAL\n+9B5IGcdokvdQ75PflNHF3zVUpUIF+rspXHvmJatrPnK1OZwY9Pk7EwEbosg80ne\n4ZL0ke4N3nyt9D7RKzbEJj5HqsHGNd/QkMfdkEdxpl/KvPFuiEkojcpxubSTN0P2\nfuC5kv0lIRViF4xwftva+Z/IgyROFUVfxjZW+ZUCgYAMOL/VVg//5dstH84oQdMp\ng9nP+Eay8+/09QGpijfwOf4b/nJxBIivOjQHx2jPsuVMb25am937eYv/s1fZbKXg\n+OVyTS5O+10e956YkDQDX0LyX9rcAXfMzgfNJCE2+NxfqbK/oi1BCzHvH4r1uaI5\nWXPk3k8WzzZ219VEYO4CXA==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-zzikv@diskord-166.iam.gserviceaccount.com",
        "client_id": "117003284191859375313",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-zzikv%40diskord-166.iam.gserviceaccount.com"
      }
      ),
    storageBucket: "diskord-166.appspot.com"
})
export const bucket = admin.storage().bucket()
const app = express()
// middleware
app.use(express.json())
app.use(cors())
mongoose.connect(process.env.CONNECTION_URL)

export var clients = []
const server = createServer(app)
export const io = new Server(server, {
    cors: {
        origin: '*'
    }
})
io.on('connection', async (socket) => {
    socket.on('disconnect', reason => {
        clients = clients.filter(item => item.socketId !== socket.id)
        console.log(clients)
    })
    // get all channel which the use is in
    const user = jwt.verify(socket.handshake.query.jwtToken, process.env.JWT_SECRET_KEY) 
    const channels = await DirectMessageModel.find({'recipients.user': user.id})
    const profile = await getUserProfile(user.id)
    io.to(socket.id).emit('server send profile', profile)
    channels.forEach(channel => {
        socket.join(channel._id.toString())
    })
    clients.push({
        socketId: socket.id,
        userId: user.id,
        focusedChannel: null
    })
    socket.join(user.id)

    // leave channel
    socket.on('leave channel', channelId => {
        socket.leave(channelId)
    })
    // receive message
    socket.on('channel focus', channelId => {
        clients = clients.map(client => client.socketId === socket.id ? {...client, focusedChannel: channelId} : client)
        console.log(clients)
    })
    console.log(clients)
})


// router
app.use('/api/signin', signInRouter)
app.use('/api/register', registerRouter)
app.use('/api/channel', channelRouter)
app.use('/api/user', userRouter)
app.use('/api/@me', meRouter)
server.listen(3001)
