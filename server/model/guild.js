import mongoose from 'mongoose'

const guildSchema = mongoose.Schema({
    // required
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    channels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }],
})

export const GuildModel = mongoose.model('Guild', guildSchema)