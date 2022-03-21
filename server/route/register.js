import mongoose from 'mongoose'
import express from 'express'
import { ProfileModel, UserModel } from '../model/user.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const createAction = await UserModel.create({ 
            email: req.body.email, 
            password: req.body.password,
            username: req.body.username,
            date_of_birth: req.body.date_of_birth
        })
        const createProfile = await ProfileModel.create({
            linkedUser: createAction._doc._id
        })
        res.send({...createAction._doc, ...createProfile._doc})
        
    } catch (error) {
        res.status(500).send(error)
    }
})

export default router