const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const user = require("../../models/userModel2");
const bcrypt = require("bcryptjs");

exports.getUserValidator = [
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    validatorMiddleware,
];

exports.createUserValidator = [
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
    check("profileImage").optional(),
    check("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA", "ar-AE", "ar-IQ"])
        .withMessage("invaild phone number"),
    check("role").optional(),
    validatorMiddleware,
];

exports.updateUserValidator = [
    check("id").isMongoId().withMessage("Invalid user id format"),
    body("name")
        .optional()
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
    check("profileImage").optional(),
    check("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA", "ar-AE", "ar-IQ"])
        .withMessage("invaild phone number"),
    check("role").optional(),
    validatorMiddleware,
];

exports.changePasswordValidator = [
    check("id").isMongoId().withMessage("Invalid user id format"),
    body("currentPassword").notEmpty().withMessage("this feild is required"),
    body("confirmPassword").notEmpty().withMessage("this feild must't be empty"),
    body("password")
        .notEmpty()
        .withMessage("this feild is required")
        .custom(async (val, { req }) => {
            const User = await user.findById(req.params.id);
            if (!User) {
                throw new Error("invaid user ");
            }
            const isCorrect = await bcrypt.compare(
                req.body.currentPassword,
                User.password
            );
            if (!isCorrect) {
                throw new Error("invaid user data");
            }
            if (val !== req.body.confirmPassword) {
                throw new Error("password confirmation invaild");
            }
            return true;
        }),
    validatorMiddleware,
];

exports.deleteUserValidator = [
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    validatorMiddleware,
];
      
      // (user):

exports.updateMyDataValidator = [
    body("name")
        .optional()
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
    check("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA", "ar-AE", "ar-IQ"])
        .withMessage("invaild phone number"),
    validatorMiddleware,
];
