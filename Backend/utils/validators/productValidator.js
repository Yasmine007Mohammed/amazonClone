const { check } = require('express-validator')
const validatorMiddeleware = require('../../middlewares/validatorMiddleware')
const CategoryModel = require('../../models/categoryModel')

// array of rules
exports.createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage('Product title required')
    .isLength({min: 3})
    .withMessage('Product title is shorter than 3'),
    
  check('describtion')
    .notEmpty()
    .withMessage('Product describtion required')
    .isLength({max: 2000})
    .withMessage('Product describtion is larger than 2000'),
    
  check('maxQuantity')
    .notEmpty()
    .withMessage('Product quantity required')
    .isNumeric()
    .withMessage('Product quantity must be numeric')
    .optional(),

  

  check('price')
    .notEmpty()
    .withMessage('Product price required')
    .isNumeric()
    .withMessage('Product price must be number')
    .isLength({max: 10000})
    .withMessage('Product price is larger than 10'),

  check('discount')
    .optional()
    .isNumeric()
    .withMessage('Product price must be number')
    .isFloat()
    // .custom((value, {req}) =>{
    //   if(req.body.price <= value){
    //     throw new Error('priceAfterDiscount must be lower than price ')
    //   }
    //   return true;
    // }),
  ,
  check('category')
    .notEmpty()
    .withMessage('Product must belong to category')
    .isMongoId()
    .withMessage('Invalid Id format')
    .custom((categoryId =>
      CategoryModel.findById(categoryId).then((category) =>{
        if(!category){
          return Promise.reject(
            new Error(`no category for this id : ${categoryId}`)
          )
        }
      }))),

  check('ratingAverage')
    .optional()
    .isNumeric()
    .withMessage('ratingAverage must be number')
    .isFloat()
    .isLength({min: 1})
    .withMessage('rating must be above or equal 1.0')
    .isLength({max:5})
    .withMessage('rating must be below or equal 5.0'),

  check('ratingQuntity')
    .optional()
    .isNumeric()
    .withMessage('ratingQuntity must be number'),

    validatorMiddeleware
]

exports.getProductValidator = [
  check('id').isMongoId().withMessage("invalid product id format"),
  validatorMiddeleware
];

exports.updateProductValidator = [
  check('id').isMongoId().withMessage("invalid product id formate"),
  validatorMiddeleware
];

exports.deleteProductValidator = [
  check('id').isMongoId().withMessage("invalid product id formate"),
  validatorMiddeleware
];
