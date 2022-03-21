import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
    attachments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Files'
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
    },
    // mentions: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     default: []
    // }],
    // mentionRoles: {
    //     type: Array,
    //     default: []
    // },
    createdAt: {
        type: Number,
        default: Date.now()
    }
})
export const MessageModel = mongoose.model('Message', messageSchema)