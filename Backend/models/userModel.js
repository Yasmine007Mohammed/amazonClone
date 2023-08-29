const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: [true],
    },
    slug: {
        type: String,
        lowercase: true
    },
    email:{
        type: String,
        required: [true],
        unique: true,
        lowercase: true,
    },
    phone: String,

    profileImg: String,

    password:{
        type: String,
        required: [true, 'password required'],
        minlength: [8, 'short password']
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
},
    {
        timestamps: true
    }
)

const User = mongoose.model('User',userSchema)
module.exports = User