import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    username: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    config: {
        name: {
            type: String,
            default: ''
        },
        age: {
            type: String,
            default: 0
        }
    }
})

export const UserModel = mongoose.model('User', userSchema)