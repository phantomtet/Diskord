import mongoose from 'mongoose'

const channelSchema = mongoose.Schema({
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }]
})

export const ChannelModel = mongoose.model('Channel', channelSchema)