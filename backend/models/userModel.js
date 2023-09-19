const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type:String,
        required:true,
        unique: true
    },
    normalized_name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required:true
    },
    friends: {
        type:Schema.ObjectId,
        ref: 'User'
    },
    email: {
        type: String,
        unique:true
    },
    image: {
        type:String,
    }

})

module.exports = mongoose.model('User', UserSchema)