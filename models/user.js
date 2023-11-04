const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }]
},{
    timestamps: true
})

const User=mongoose.model('User',userSchema)

module.exports=User