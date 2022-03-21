import mongoose from "mongoose";

const fileSchema = mongoose.Schema({
    filename: {
        required: true,
        type: String
    },
    content: {
        data: Buffer,
        contentType: String
    }
})

const FileModel = mongoose.model('Files', fileSchema)
export default FileModel