import mongoose from "mongoose";

const fileSchema = mongoose.Schema({
    filename: {
        required: true,
        type: String
    },
    contentType: {
        required: true,
        type: String
    },
    url: {
        required: true,
        type: String
    },
    size: {
        required: true,
        type: Number
    }
})

const FileModel = mongoose.model('Files', fileSchema)
export default FileModel