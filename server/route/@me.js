import express from "express";
import verifyToken from "../middleware/authorization.js";
import { UserModel, ProfileModel, userPrivateFields } from './../model/user.js';
import { DirectMessageModel } from './../model/DM.js';
import mongoose from "mongoose";
import { io, clients, bucket } from '../index.js'
import { upload } from "./channel.js";
const router = express.Router()

export const getUserProfile = async (id) => {
    let response
    try {
        const values = await Promise.all([
            UserModel.findById(mongoose.Types.ObjectId(id), {password: 0}).populate('relationship.user', userPrivateFields),
            DirectMessageModel.find({ 
                recipients: { $elemMatch: { user: id, status: 1}}
            }).populate('recipients.user', userPrivateFields).populate({ path: 'lastMessage', populate: { path: 'author', select: userPrivateFields }})
    
        ])
        return response = {
            ...values[0]._doc,
            dms: values[1] // chi tra ve user khac voi ban than
        }
    } catch (error) {
        return error
    }
}

router.get('/', verifyToken, async (req, res) => {
    try {
        // Promise.all([
        //     UserModel.findById(req.payloadFromJWT.id, {password: 0}).populate('relationship.user', userPrivateFields),
        //     DirectMessageModel.find({ 
        //         recipients: { $elemMatch: { user: req.payloadFromJWT.id, status: 1}}
        //     }).populate('recipients.user', userPrivateFields)

        // ]).then(values => {
        //     const response = {
        //         ...values[0]._doc,
        //         dms: values[1].map(dm => ({...dm._doc, recipients: dm._doc.recipients.filter(item => item.user._id.toString() !== req.payloadFromJWT.id)})) // chi tra ve user khac voi ban than
        //     }
        //     // trigger noti

        //     return res.send(response)
        // })
        const a = getUserProfile(req.payloadFromJWT.id)
        res.send(a)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
// relationship: 1 - friend, 2 - incoming, 3 - outgoing, 4 - block
router.put('/relationship/:targetid', verifyToken, async (req, res) => {     // send friend request
    if (req.params.targetid === req.payloadFromJWT.id) return res.status(400).send({ message: 'You cant add yourself!'})
    try {
        const selfId = mongoose.Types.ObjectId(req.payloadFromJWT.id)
        const targetId = mongoose.Types.ObjectId(req.params.targetid)
        const target = await UserModel.findById(targetId)       // tim target theo id
        if (!target) return res.status(400).send({message: 'You are blocked or user is not existed'})
        const yourself = target.relationship.find((item) => item.user.toString() === selfId.toString())

        // gui request den nguoi do
        if (!yourself) {
            const a = await UserModel.findByIdAndUpdate(target, {             
                $push: { relationship: { user: selfId, status: 2} }
            }, { fields: userPrivateFields })
            const b = await UserModel.findByIdAndUpdate(selfId, {
                $push: { relationship: { user: targetId, status: 3} }
            }, { fields: userPrivateFields })
            // trigger noti with socket
            io.to(req.payloadFromJWT.id).emit('request sent', { user: a, status: 3})
            io.to(req.params.targetid).emit('request received', { user: b, status: 2})
            return res.send({ message: 'Request sent'})
        }

        if (yourself.status === 2) return res.status(400).send({ message: 'You already sent request to this user' })     // ban da gui request roi
        if (yourself.status === 4) return res.status(400).send({ message: 'You are blocked or user is not existed' })    // ban bi block
        if (yourself.status === 1) return res.status(400).send({ message: 'You are already friend with this user' })     // ban da la friend voi nguoi nay roi

        // accept neu ng nay da gui friend request den ban
        if (yourself.status === 3) {                                                                                     
            const a = await UserModel.findOneAndUpdate({ _id: targetId, 'relationship.user': selfId }, {
                $set: { 'relationship.$.status': 1}
            }, { fields: userPrivateFields })
            const b = await UserModel.findOneAndUpdate({ _id: selfId, 'relationship.user': targetId}, {
                $set: { 'relationship.$.status': 1 }
            }, { fields: userPrivateFields })
            // trigger noti with socket
            io.to(req.payloadFromJWT.id).emit('request accepted', { user: a, status: 1})
            io.to(req.params.targetid).emit('request accepted', { user: b, status: 1})
            return res.send({ message: 'Accepted friend request' })                               
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: 'You are blocked or user is not existed' })
    }
})
router.delete('/relationship/:targetid', verifyToken, async (req, res) => {     // send friend request
    if (req.params.targetid === req.payloadFromJWT.id) return res.status(400).send({ message: 'Stop do this!'})
    try {
        const selfId = mongoose.Types.ObjectId(req.payloadFromJWT.id)
        const targetId = mongoose.Types.ObjectId(req.params.targetid)
        const target = await UserModel.findById(targetId)       // tim target theo id

        if (!target) return res.status(400).send({message: 'You are blocked or user is not existed'})
        const user = target.relationship.find((item) => item.user.toString() === selfId.toString())
        if (!user) return res.status(400).send({ message: 'You dont have relationship with this user'})                                                       // neu khong co relationship voi nguoi nay

        if ([1,2,3].includes(user.status)) {
            await UserModel.findByIdAndUpdate(target, {
                $pull: { relationship: { user: selfId }},       // xoa nhung relationship nao co field user = id cua minh
            })
            await UserModel.findByIdAndUpdate(selfId, {
                $pull: { relationship: { user: targetId }},     // xoa nhung relationship nao co field user = id cua doi phuong
            })
            // trigger noti with socket
            io.to(req.params.targetid).emit('remove relationship', req.payloadFromJWT.id)
            io.to(req.payloadFromJWT.id).emit('remove relationship', req.params.targetid)
            return res.send({ message: 'Delete relationship successfully'})
        }
        if (user.status === 4) return res.status(400).send({ message: 'You are blocked or user is not existed' })    // ban bi block
    } catch (error) {
        res.status(400).send({ message: 'You are blocked or user is not existed'})}
})
// create inbox
router.post('/channel', verifyToken, async (req, res) => {
    const { recipients } = req.body
    try {
        const getChannel = await DirectMessageModel.findOne({ recipients: { $all: recipients } }).populate('recipients', userPrivateFields)
        if (!getChannel) {
            const createDM = await DirectMessageModel.create({recipients})
            const getChannelAgain = await DirectMessageModel.findOne({ recipients: { $all: recipients } }).populate('recipients', userPrivateFields)
            res.send(getChannelAgain)
        }
        else res.send(getChannel)
    } catch (error) {
        res.status(500).send(error)
    }
})
// update user info
router.patch('/', verifyToken, async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send(error)
    }
})
// update user avatar
router.patch('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    console.log(req.file)
    let url = ''
    if (!req.file.mimetype.includes('image/')) return res.status(400).send({ message: 'Invalid type file' })
    try {
    const name = Date.now() + '__' + req.file.originalname
    const u = bucket.file(name)
    const stream = u.createWriteStream()
    stream.on('error', err => {
        return res.status(500).send(err)
    })
    stream.on('finish', async () => {
        await u.makePublic()
        url = u.publicUrl()
        await UserModel.findById(req.payloadFromJWT.id).exec((error, doc) => {
            doc.avatar = url
            doc.save()
        })
        res.send({url: url})
    })
    stream.end(req.file.buffer)
    } catch (error) {
        res.status(500).send(error)
    }
})



export default router