import express from 'express'
import verifyToken from './../middleware/authorization.js';
import { UserModel, userPrivateFields } from './../model/user.js';
import { MessageModel } from './../model/message.js';
import { ChannelModel } from './../model/channel.js';
import { io } from './../index.js';
import mongoose from 'mongoose';
import multer from 'multer';
import FileModel from './../model/file.js';
import { DirectMessageModel } from './../model/DM.js';

const router = express.Router()
// file upload handle
const fileEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploadedFile')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '__' + file.originalname)
    }
})
export const upload = multer({ storage: fileEngine })

router.get('/:channelId/message', verifyToken, async (req, res) => {
    const { limit, beforeId } = req.query
    const id = new mongoose.Types.ObjectId(beforeId)

    // query
    const query = {
        channelId: req.params.channelId,
    }
    if (beforeId) query._id = { $lt: id }

    try {
        const messages = await MessageModel.find(query).limit(limit || 20).sort({createdAt: -1})
        .populate('author', {"email": 0, "password": 0})
        res.send(messages)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.post('/:channelId/message', verifyToken, upload.array('files', 3), async (req, res) => {
    try {
        const uploadFile = await FileModel.insertMany(req.files.map(file => ({
            filename: file.filename,
            content: {
                data: file.filename,
                contentType: file.mimetype
            }
        })))
        const createMessage = await MessageModel.create({
            attachments: uploadFile.map(item => item._id),
            content: req.body.content,
            author: mongoose.Types.ObjectId(req.payloadFromJWT.id),
            channelId: req.params.channelId,
            createdAt: Date.now()
        })
        const update = await ChannelModel.updateOne({_id: req.params.channelId}, { $push: { messages: mongoose.Types.ObjectId(createMessage._id) }})
        console.log(update)
        const message = await createMessage.populate([{path: 'author', 'email': 0}])
        io.emit('client send message', message)
        res.status(200).send(message)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

// create channel
router.post('/', verifyToken, async (req, res) => {
    try {
        const getSelfData = await UserModel.findById(req.payloadFromJWT.id)
        const myFriendIds = getSelfData.relationship.filter(item => item.status === 1).map(item => (item.user._id).toString())
        let dm
        // neu tat ca recipient deu nam trong list friend
        if (req.body.recipients.every(item => myFriendIds.includes(item))) {
            const totalRecipients = [...req.body.recipients, req.payloadFromJWT.id] .map(item => mongoose.Types.ObjectId(item))   // mang recipient ( bao gom ca ban than )
            // neu day la inbox
            // console.log(totalRecipients)
            if (totalRecipients.length === 2) {
                const find = await DirectMessageModel.findOne({
                    'recipients.0.user': { $in: totalRecipients },
                    'recipients.1.user': { $in: totalRecipients }
                }).populate('recipients.user', userPrivateFields)
                // console.log(find)
                if (find) {
                    dm = await DirectMessageModel.findOneAndUpdate({_id: find._id, 'recipients.user': req.payloadFromJWT.id}, {
                        $set: { 'recipients.$.status': 1}
                    }).populate('recipients.user', userPrivateFields)
                }
                // neu khong tim ra inbox (nghia la chua inbox lan nao) thi tao moi
                if (!find) {
                    const recipients = totalRecipients.map(item => item.toString() === req.payloadFromJWT.id ? { user: mongoose.Types.ObjectId(req.payloadFromJWT.id), status: 1} : {user: mongoose.Types.ObjectId(item), status: 0})
                    dm = await DirectMessageModel.create({recipients, isInbox: true})
                }

            }
        }
        // trigger noti
        io.to(req.payloadFromJWT.id).emit('create dm', dm)
        res.send()
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
router.delete('/:channelId', verifyToken, async (req, res) => {
    try {
        const update = await DirectMessageModel.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.params.channelId), 'recipients.user': req.payloadFromJWT.id}, {
            $set: { 'recipients.$.status': 0 }
        })
        // trigger noti
        io.to(req.payloadFromJWT.id).emit('delete dm', req.params.channelId)
        res.send()
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
export default router