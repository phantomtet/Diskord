import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    // required field
    email: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    // optional field
    avatar: {
        type: String,
        default: null
    },
    banner: {
        type: String,
        default: null
    },
    bannerColor: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: ''
    },
    guilds: [{
        type: mongoose.Types.ObjectId,
        ref: 'Guild'
    }],
    channels: [{
        type: mongoose.Types.ObjectId,
        ref: 'Channel'
    }],
    dms: [{
        type: mongoose.Types.ObjectId,
        ref: 'dm'
    }],
    friends: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
})
export const userPrivateFields = {
    dms: 0,
    guilds: 0,
    channels: 0,
    email: 0,
    password: 0,
    friends: 0
}
const profileSchema = mongoose.Schema({
    // required
    linkedUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    // optional
    currentGuilds: [{
        type: mongoose.Schema.Types.ObjectId,
        default: []
    }],
    friendList: [{
        type: mongoose.Schema.Types.ObjectId,
        default: []
    }],
    friendRequest: [{
        type: mongoose.Schema.Types.ObjectId,
        default: []
    }],
    friendSent: [{
        type: mongoose.Schema.Types.ObjectId,
        default: []
    }],

})

export const UserModel = mongoose.model('User', userSchema)
export const ProfileModel = mongoose.model('Profile', profileSchema)