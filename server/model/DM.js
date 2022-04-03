import mongoose from 'mongoose'

const directMessageSchema = mongoose.Schema({
    // receipt la 1 mang gom object, object co 2 key, 1 key la user objectId, 1 key laf status cua user do: 0 - unfollow, 1 - follow
    recipients: [{
        user: {type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: Number,
            required: true
        },
        seen: {
            type: Boolean,
            default: true
        }
    }],
    isInbox: {
        type: Boolean,
        required: true
    },
    lastMessage: {
        type: mongoose.Types.ObjectId,
        ref: 'Message'
    }
})

export const DirectMessageModel = mongoose.model('dm', directMessageSchema)