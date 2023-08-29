const express = require('express')
const {getReviews, createReview, getReview, updateReview,deleteReview ,createFilterObject,setProductIdAndUserId} = 
require('../controllers/reviewController')
const authUserController = require('../controllers/authUserController')
const { createReviewValidator,getReviewValidator,updateReviewValidator,deleteReviewValidator } =
require('../utils/validators/reviewValidator')

const router = express.Router({mergeParams:true})  // mergeParams used to any route send
router.route('/')
.get(createFilterObject,getReviews)
.post(
    authUserController.protect,
    authUserController.allowedTo('user'),
    createReviewValidator,
    setProductIdAndUserId,
    createReview
    )

router.route("/:id")
.get(getReviewValidator,getReview)
.put(
    authUserController.protect,
    authUserController.allowedTo('user'),
    updateReviewValidator,
    updateReview)
.delete(
    authUserController.protect,
    authUserController.allowedTo('user','admin'),
    deleteReviewValidator,
    deleteReview)


module.exports = router