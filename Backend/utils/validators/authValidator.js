const slugify = require("slugify");
const { check} = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const user = require("../../models/userModel2");
const bcrypt = require("bcryptjs");


exports.signValidator = [
    check("name")
        .notEmpty()
        .withMessage("name required")
        .isLength({ min: 3 })
        .withMessage("Too short user name")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    check("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invaild email")
        .custom((val) =>
            user.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error("email is already exit"));
                }
            })
        ),

    check("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 character")
        .custom((password, { req }) => {
            if (password !== req.body.confirmPassword) {
                throw new Error("password confirmation invaild");
            }
            return true;
        }),

    check("confirmPassword")
        .notEmpty()
        .withMessage("confirmPassword is required"),
        validatorMiddleware,
];

exports.loginValidator=[
    check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invaild email"),

check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 character"),
    validatorMiddleware
]

exports.forgetPasswordValidator=[
    check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invaild email"),
    validatorMiddleware
]



