const { check } = require('express-validator')
const validatorMiddeleware = require('../../middlewares/validatorMiddleware')
const Review = require('../../models/reviewModule')


// array of rules
exports.createReviewValidator = [
  check('title').optional(),
  
  check('ratings')
    .notEmpty()
    .withMessage('ratings Value is required')
    .isFloat({min: 1, max:5})
    .withMessage('rating must be between 1.0 to 5.0'),

    check('user').isMongoId().withMessage("invalid Review id format"),
    check('product').isMongoId().withMessage("invalid Review id format").
    custom((val,{req})=>{
        //check if user create review before
        return Review.findOne({user: req.user._id, product: req.body.product})
        .then(
            (review)=>{
                if(review){
                    return Promise.reject(
                        new Error("Already Creating Review Before")
                    )
                }
            }
        )
            return true;
    }),

    validatorMiddeleware
]

exports.getReviewValidator = [
  check('id').isMongoId().withMessage("invalid Review id format"),
  validatorMiddeleware
];

exports.updateReviewValidator = [
    check('ratings')
    .notEmpty()
    .withMessage('ratings Value is required')
    .isFloat({min: 1, max:5})
    .withMessage('rating must be between 1.0 to 5.0'),

  check('id').isMongoId().withMessage("invalid Review id formate")
  .custom((val,{req})=>{
    //check if user update review before
    return Review.findById(val)
    .then(
        (review)=>{
            if(!review){
                return Promise.reject(
                    new Error(`Not Review With Id:${val}`)
                )
            }
            // console.log(req.user._id.toString())
            // console.log(review.user.toString() == req.user._id.toString() )
            if(review.user._id.toString() !== req.user._id.toString()){
                return Promise.reject(
                    new Error(`Not the real user who made the review`)
                )
            }
        }
    )

}),
  validatorMiddeleware
];

exports.deleteReviewValidator = [
  check('id').isMongoId().withMessage("invalid Review id formate")
  .custom((val,{req})=>{
    if(req.user.role === 'user'){
         //check if user delete review 
    return Review.findById(val)
    .then(
        (review)=>{
            if(!review){
                return Promise.reject(
                    new Error(`Not Review With Id:${val}`)
                )
            }
            if(review.user._id.toString() !== req.user._id.toString()){
                return Promise.reject(
                    new Error(`Not the real user who made the review`)
                )
            }
        }
    )

    }}),
  validatorMiddeleware
];
