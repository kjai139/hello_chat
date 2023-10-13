const mongoose = require('mongoose')
const Schema = mongoose.Schema


const genRandomColor = () => {
    const randomNumber = Math.floor(Math.random() * 5) + 1
    console.log(randomNumber)
    if (randomNumber === 1) {
        
        return '#f5f5f5'
    } else if (randomNumber === 2) {
        return '#22d3ee'
    } else if (randomNumber === 3) {
        return '#f472b6'
    } else if (randomNumber === 4) {
        return '#d8b4fe'
    } else if (randomNumber === 5) {
        return '#4ade80'
    }
}

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
    friends: [{
        type:Schema.Types.ObjectId,
        ref: 'User',
        default: null
        
    }],
    friendRequests: [{
        type:Schema.Types.ObjectId,
        ref: 'User',
        default: null
        
    }],
    email: {
        type: String,
        unique:true
    },
    image: {
        type:String,
        default: null
    },
    defaultColor: {
        type:String,
        
    },
    status: {
        type:String,
        enum:['online', 'offline', 'busy', 'away'],
        default:'offline'
    }


})

UserSchema.pre('save', function(next) {
    if (!this.defaultColor) {
        this.defaultColor = genRandomColor()
    }
    next()
})

module.exports = mongoose.model('User', UserSchema)