import mongoose from 'mongoose'

const directMessageSchema = mongoose.Schema({
    recipients: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
})

export const DirectMessageModel = mongoose.model('dm', directMessageSchema)