import express from 'express';
import cors from 'cors'
import signInRouter from './route/signin.js'
import signUpRouter from './route/signup.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT || 9999
const app = express()
// middleware
app.use(express.json())
app.use(cors())

// router
app.use('/signin', signInRouter)
app.use('/signup', signUpRouter)

mongoose.connect(process.env.CONNECTION_URL)
.then(() => {
    app.listen(PORT, () => {
        console.log('Server running on port', PORT)
    })
})

