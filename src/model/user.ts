import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    userMail: {
        type: String,
        required: true
    },
    contact: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
})

const userRegistration: any = mongoose.model('users',userSchema)

export default userRegistration