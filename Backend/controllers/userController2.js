const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel2");

// Upload single image
exports.uploadUserImage = uploadSingleImage("profileImage");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user profileImage-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/users2/${filename}`);

        // Save image into our db
        req.body.profileImage = filename;
    }

    next();
});

// @desc    Get list of users
// @route   GET /api/users
// @access  private
exports.getUsers = factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/users:id
// @access  private
exports.getUser = factory.getOne(User);

// @desc    Create user
// @route   POST  /api/users/:id
// @access  Private
exports.createUser = factory.createOne(User);

// @desc    Update specific user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            email: req.body.email,
            phone: req.body.phone,
            profileImage: req.body.profileImage,
            role: req.body.role,
        },
        {
            new: true,
        }
    );

    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
    const document= await User.findByIdAndUpdate(req.params.id,
    {
        password: await bcrypt.hash(req.body.password,12),
        passwordChangedAt: Date.now() 
    },
    {
        new:true
    })

    if(!document){
        return next(new ApiError(`No document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({data:document});
});

// @desc    Delete specific user
// @route   DELETE /api/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(User);
        // (User):

// @desc    Get my data
// @route   GET /api/users/getMe
// @access  private/protected

exports.getMyData=asyncHandler(async (req, res, next) =>{
    req.params.id=req.user._id
    next()
})



// @desc    update my data password
// @route   PUT /api/users/updateMePassword
// @access  private/protected
exports.updateMePassword=asyncHandler(async (req,res,next) =>{
    // update user password based user payload
    const user= await User.findByIdAndUpdate(req.user._id,
        {
            password: await bcrypt.hash(req.body.password,12),
            passwordChangedAt: Date.now() 
        },
        {
            new:true
        })
    // create token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_Key, { expiresIn: process.env.jwt_ExpireDate });
    res.status(200).json({ data:user, token })
})

// @desc    update my data  without(password , role)
// @route   PUT /api/users/updateMedata
// @access  private/protected
exports.updateMeData=asyncHandler(async (req,res,next) =>{
    // update user data based user payload
    const updateUserData = await UserActivation.findByIdAndUpdate(req.user._id,
    {
        name: req.body.name,
        email: req.body.email,
        phone: req.body,phone
    },
    {new: true});
    res.status(200).json({ data:updateUserData, token })
})

// @desc    delete my data  
// @route   DELETE /api/users/deleteMedata
// @access  private/protected
exports.deleteMeData=asyncHandler(async (req,res,next) =>{
    // delete user data based user payload
    await User.findByIdAndUpdate( req.user._id ,{ active:false });
    res.status(204).json({ status:"Done" })
})