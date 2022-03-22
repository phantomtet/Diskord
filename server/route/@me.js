import express from "express";
import verifyToken from "../middleware/authorization.js";
import { UserModel, ProfileModel, userPrivateFields } from './../model/user.js';
import { DirectMessageModel } from './../model/DM.js';
import mongoose from "mongoose";

const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.payloadFromJWT.id, {password: 0})
        return res.send(user._doc)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.put('/relationship/:targetid', verifyToken, async (req, res) => {     // send friend request
    const selfId = mongoose.Types.ObjectId(req.payloadFromJWT.id)
    const targetId = mongoose.Types.ObjectId(req.params.targetid)
    try {
        const target = await UserModel.findById(targetId)       // tim target theo id
        if (!target) return res.status(400).send('You are blocked or user is not existed')

        if (target.outgoingFriendRequests?.includes(selfId)) {      // neu nguoi nay da gui friend request den ban
            const accept = await UserModel.findByIdAndUpdate(targetid, { 
                $pull: { outgoingFriendRequests: selfId },
                $push: { friends: selfId }
            } )
            if (!accept) return res.status(400).send('You cant send request to this user right now')
            const accept2 = await UserModel.findByIdAndUpdate(selfId, {
                $pull: { incomingFriendRequests: targetId },
                $push: { friends: targetId }
            })
            if (!accept2) return res.status(400).send('You cant send request to this user right now')
            return res.status(204)
        }

        if (target.incomingFriendRequests?.includes(selfId)) return res.status(400).send('You already sent request to this user')       // neu ban da gui request den nguoi nay roi

        await UserModel.findByIdAndUpdate(target, {
            $push: { incomingFriendRequests: selfId }
        })
        await UserModel.findByIdAndUpdate(selfId, {
            $push: { outgoingFriendRequests: targetId }
        })
        return res.status(204).send()
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