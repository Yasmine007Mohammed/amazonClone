const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const factory = require("./handlersFactory");
const Review = require('../models/reviewModule')

// nested route
// Get  /products/:prductId/review
exports.createFilterObject = (req,res,next)=>{
  let filerObject = {};
  if(req.params.productId) filerObject ={ product: req.params.productId};
  req.filterObj = filerObject;
  next()
}

// @desc    Get list of reviews
// @route   GET /api/reviews
// @access  private
exports.getReviews = factory.getAll(Review);

// @desc    Get specific reviews by id
// @route   GET /api/reviews:id
// @access  private
exports.getReview = factory.getOne(Review);

// nested route (create)
exports.setProductIdAndUserId = (req,res,next)=>{
  if(!req.body.product) req.body.product = req.params.productId;
  if(!req.body.user) req.body.user = req.user._id;
  next();
}

// @desc    Create reviews
// @route   POST  /api/reviews/:id
// @access  Private
exports.createReview = factory.createOne(Review);

// @desc    Update specific Review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = factory.updateOne(Review);


// @desc    Delete specific review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = factory.deleteOne(Review);