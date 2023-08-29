const { check, body } = require('express-validator')
const validatorMiddeleware = require('../../middlewares/validatorMiddleware');
const { default: slugify } = require('slugify');
const User = require('../../models/userModel');



exports.createUserValidator = [
    check("name")
        .notEmpty()
        .withMessage('Name required')
        .isLength({min: 3})
        .withMessage('User name is shorter than 3')
        .custom((val,{req})=>{
            req.body.slug = slugify(val);
            return(true)
        }),

    check("email")
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invaled email address')
        .custom((val)=>User.findOne({email : val})
        .then(user=>{
            if(user){
                return Promise.reject(new Error("Email alredr used"))
        }
        })),

        check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .custom((val, { req }) => {
      // Check if the password matches the confirmation password
      if (val !== req.body.passwordConfirm) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required'),

    check("phone")
    .isMobilePhone(['ar-EG','en-US','ar-SA'])
    .withMessage('Invalied Phone Number must be (EG - US - SA)')
    .optional(),

    check("profileImg").optional(),

    check("role").optional(),

    validatorMiddeleware
];

// array of rules
exports.getUserValidator = [
    check('id').isMongoId().withMessage("invalid User id format"),
    validatorMiddeleware
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage("invalid User id format"),
  body('name').optional().custom((val, {req}) =>{
    req.body.slug = slugify(val)
    return true
  }),
  validatorMiddeleware
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage("invalid User id format"),
  validatorMiddeleware
];