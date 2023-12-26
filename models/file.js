const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
    },
    actualName: {
        type: String
    }
},
    {
        timestamps: true
    }
)

const File=mongoose.model('File',fileSchema)

module.exports=File