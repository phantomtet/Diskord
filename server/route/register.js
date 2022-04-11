import mongoose from 'mongoose'
import express from 'express'
import { ProfileModel, UserModel } from '../model/user.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/', async (req, res) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    if (!emailRegex.test(req.body.email)) return res.status(400).send({ message: 'Invalid email address'})
    try {
        const createAction = await UserModel.create({ 
            email: req.body.email, 
            password: req.body.password,
            username: req.body.username,
            date_of_birth: req.body.date_of_birth
        })
        const token = jwt.sign({id: createAction._doc._id}, process.env.JWT_SECRET_KEY)

        res.send({...createAction._doc, token})
        
    } catch (error) {
        res.status(400).send({ message: 'Email has been already taken'})
    }
})

export default router