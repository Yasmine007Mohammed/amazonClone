const { check, body } = require('express-validator')
const validatorMiddeleware = require('../../middlewares/validatorMiddleware');
const { default: slugify } = require('slugify');

// array of rules
exports.getCategoryValidator = [
    check('id').isMongoId().withMessage("invalid category id format"),
    validatorMiddeleware
];

exports.createCategoryValidator = [
  check("name")
      .notEmpty()
      .withMessage('Category required')
      .isLength({min: 3})
      .withMessage('Category name is shorter than 3')
      .isLength({max: 30})
      .withMessage('Category name is lager than 30'),
      check("image").optional(),
    validatorMiddeleware
];

exports.updateCategoryValidator = [
  check('id').isMongoId().withMessage("invalid category id format"),
  body('name').optional().custom((val, {req}) =>{
    req.body.slug = slugify(val)
    return true
  }),
  validatorMiddeleware
];

exports.deleteCategoryValidator = [
  check('id').isMongoId().withMessage("invalid category id format"),
  validatorMiddeleware
];