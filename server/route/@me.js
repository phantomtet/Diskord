import express from "express";
import verifyToken from "../middleware/authorization.js";
import { UserModel, ProfileModel, userPrivateFields } from './../model/user.js';
import { DirectMessageModel } from './../model/DM.js';

const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.payloadFromJWT.id, {password: 0})
        res.send(user._doc)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/channel', verifyToken, async (req, res) => {
    const { recipients } = req.body
    try {
        const getChannel = await DirectMessageModel.findOne({ recipients: { $all: recipients } }).populate('recipients', {...userPrivateFields})
        if (!getChannel) {
            const createDM = await DirectMessageModel.create({recipients})
            const getChannelAgain = await DirectMessageModel.findOne({ recipients: { $all: recipients } }).populate('recipients', {...userPrivateFields})
            res.send(getChannelAgain)
        }
        else res.send(getChannel)
    } catch (error) {
        res.status(500).send(error)
    }
})




export default router