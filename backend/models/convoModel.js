const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ConvoSchema = new Schema({
    name: {
        type:String
    },
    participants: [{
        type:Schema.Types.ObjectId,
        ref: 'User'
    }]
})


module.exports = mongoose.model('Convo', ConvoSchema)