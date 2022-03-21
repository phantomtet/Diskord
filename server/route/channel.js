import express from 'express'
import verifyToken from './../middleware/authorization.js';
import { UserModel } from './../model/user.js';
import { MessageModel } from './../model/message.js';
import { ChannelModel } from './../model/channel.js';
import { io } from './../index.js';
import mongoose from 'mongoose';
import multer from 'multer';
import FileModel from './../model/file.js';

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
    // try {
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
    // } catch (error) {
    //     res.status(500).send(error)
    // }
})
export default router