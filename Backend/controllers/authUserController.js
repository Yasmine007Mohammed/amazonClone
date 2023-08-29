// singup & login & forget password & logout
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel2");
const sendEmail = require("../utils/sendEmail");


// @desc    Signup as seller
// @route   GET /api/auth/sellerSignup
// @access  Public
exports.sellerSignup=asyncHandler(async (req,res,next)=>{
    const user=await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role:'seller'
    });
        // generation token
        const token = jwt.sign({ userId: user._id }, process.env.jwt_Key, {
            expiresIn: process.env.jwt_ExpireDate,
        });
        res.status(201).json({ data: user, token });
})

// @desc    Login as seller
// @route   GET /api/auth/sellerLogin
// @access  Public
exports.sellerLogin=asyncHandler(async (req,res,next)=>{
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError("incorrect Email or Password", 401));
    }
        // generation token
        const token = jwt.sign({ userId: user._id }, process.env.jwt_Key, {
            expiresIn: process.env.jwt_ExpireDate,
        });
        res.status(201).json({ data: user, token });
})
// @desc    Signup
// @route   GET /api/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
    // 1- Create user
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    // generation token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_Key, {
        expiresIn: process.env.jwt_ExpireDate,
    });
    res.status(201).json({ data: user, token });
});

// @desc    Login
// @route   GET /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    // check user exist , password ic correct
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError("incorrect Email or Password", 401));
    }
    // generation token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_Key, {
        expiresIn: process.env.jwt_ExpireDate,
    });
    res.status(200).json({ data: user, token });
});

// @desc   make sure the user is logged in

exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ApiError("you are not login please login"), 401);
    }

    const decode = jwt.verify(token, process.env.jwt_Key);

    const currentUser = await User.findById(decode.userId);
    if (!currentUser) {
        return next(new ApiError("invaild user data please try ", 401));
    }
    if (currentUser.passwordChangedAt) {
        const passwordChangedAtTimeStam = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000,
            10
        );
        if (passwordChangedAtTimeStam > decode.iat) {
            return next(
                new ApiError(
                    "user recrntly change password please login with new password ",
                    401
                )
            );
        }
    }
    req.user = currentUser;
    next();
});
// user permistions
// @desc    Authorization (User Permissions)
// ["admin"]
exports.allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role))
        {
            next(new ApiError("you are noy allowed to make this action", 403));
        }
        next();
    });

// forget password
// @desc    Forgot password
// @route   POST /api/auth/forgotPassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    //verify user email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`${req.body.email} is invaild `, 404));
    }

    // if user is exist genarate random code 6 degits and save it in database
    const userResetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(userResetCode)
        .digest("hex");
    user.passwordResetCode = hashedResetCode;
    //add expiration date for reset code after 10 mintus
    user.passwordResetCodeExpirse = Date.now() + 10 * 60 * 1000;
    user.passwordResetCodeVerified = false;
    await user.save();
    // send rendom code to user email
    const messageContent = `Hi ${user.name}\nYour reset code password for your account ${user.email} on Amazon is \n ${userResetCode}\n please enter it to reset your password\n thanks for helps us to make your account secure\n Amazon Team`;

    try {
        await sendEmail({
            email: user.email,
            subject: "reset code password message",
            message: messageContent,
        });
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpirse = undefined;
        user.passwordResetCodeVerified = undefined;
        await user.save();
        return next(new ApiError('there are an error in sending email', 500))
    }
    res.status(200).json({ status: 'success', message: 'reset code send to email' })
});
// verifying reset code
// @desc    Verify password reset code
// @route   POST /api/auth/verifyResetCode
// @access  Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(req.body.resetCode)
        .digest("hex");
    const user = await User.findOne({ passwordResetCode: hashedResetCode, passwordResetCodeExpirse: { $gt: Date.now() } });
    if (!user) {
        return next(new ApiError('invaild password reset code'));
    }
    user.passwordResetCodeVerified = true;
    await user.save();
    res.status(200).json({ status: 'success' })
});
// @desc    Reset password
// @route   POST /api/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // get user based on email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError('please enter vaild email ', 404))
    }
    // check if reset code verified
    if (!user.passwordResetCodeVerified) {
        return next(new ApiError('code is not verified ', 400))
    }
    user.password = req.body.password;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpirse = undefined;
    user.passwordResetCodeVerified = undefined;
    await user.save();
    // if is done => create token:
    const token = jwt.sign({ userId: user._id }, process.env.jwt_Key, { expiresIn: process.env.jwt_ExpireDate });
    res.status(200).json({ status: 'success', message: 'password updated', token })
});
