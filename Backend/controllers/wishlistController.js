const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel2");

// @desc    add product to wishlist
// @route   POST /api/wishlist
// @access  protected - user
exports.addWishlist = asyncHandler(async (req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            //$addToSet using to push in array
            $addToSet: { wishlist: req.body.productId }
        },{
            new: true
        },
        );
    res.status(200).json({
        status:'success',
        massage: 'Product added successfully to your wishlist',
        data : user.wishlist,
    })
})


// @desc    dalete product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  protected - user
exports.deleteWishlist = asyncHandler(async (req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            //$pull using to delete from array
            $pull: { wishlist: req.params.productId }
        },{
            new: true
        },
        );
    res.status(200).json({
        status:'success',
        massage: 'Product delete successfully to from wishlist',
        data : user.wishlist,
    })
})

// @desc    get logged user wishlist
// @route   GET /api/wishlist/:productId
// @access  protected - user
exports.getUserWishlist = asyncHandler(async (req,res,next)=>{
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({ 
        status:'success', 
        result:user.wishlist.length , 
        date : user.wishlist 
    })

})