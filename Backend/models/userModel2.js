const mongoose=require('mongoose');
const bycrypt=require('bcryptjs');

const userScehma2=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'name is required']
    },
    slug:{
        type:String,
        lowercase:true
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
        lowercase:true
    },
    phone:String,
    profileImage:String,
    password:{
        type:String,
        required:[true,'password is required'],
        minLength:[8,'min length must be at least 8 char']
    },
    passwordChangedAt:Date,
    passwordResetCode:String,
    passwordResetCodeExpirse:Date,
    passwordResetCodeVerified:Boolean,
    role:{
        type:String,
        enum:['admin','user','seller'],
        default:'user'
    },
    active:{
        type:Boolean,
        default:true
    },
    // relashion chiled refrance one to many
    wishlist:[
        {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
        }
    ],
},{timestamps:true});

userScehma2.pre('save', async function (next){
    if(!this.isModified('password')) return next()
    //hashing for passwords
    this.password=await bycrypt.hash(this.password,12);
    next()


})

module.exports=mongoose.model('user2',userScehma2);