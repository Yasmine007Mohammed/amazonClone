const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
// const multer = require('multer')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')
const ApiError = require('../utils/apiError')
const ApiFeatures = require('../utils/apiFeatures')
const ProductModel = require('../models/productModel')
const {uploadSingleImage} = require('../middlewares/uploadImageMiddleware')
const factory = require("./handlersFactory");

// const { query } = require('express')


/// uload single image
exports.uploadProductImage = uploadSingleImage("imageCover")

// image processing
exports.resizeImage = asyncHandler(async (req,res,next) =>{
  const filename = `product-${uuidv4()}-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
      // .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({quality: 95})
      .toFile(`uploads/products/${filename}`);

      req.body.imageCover = filename  // save image on DB
  next();
})

// get all products - router: GET /api/product - public
exports.getProducts = asyncHandler(async (req,res) =>{
  // build query
  const documentsCounts = await ProductModel.countDocuments()
  const apiFeatures = new ApiFeatures(ProductModel.find(), req.query) 
  .paginate(documentsCounts)
  .filter()
  .search('Products')
  .limitFields()
  .sort()

  // execute query
  const {mongooseQuery,paginationResult} = apiFeatures
  const products = await mongooseQuery

  res.status(200).json({results: products.length, paginationResult,data:products})
})

// get single product - router: GET /api/product/:id - public
// get single product using factory
exports.getProduct = factory.getOne(ProductModel,'reviews');

// exports.getProduct = asyncHandler(async(req,res,next) =>{
//   const { id } = req.params
//   const product = await ProductModel.findById(id)
//   .populate({path: 'category', select: 'name -_id' })
//   if (!product){
//     // res.status(404).json({message: `product is not found on ${id}`})
//     return next(new ApiError(`category is not found on id: ${id}`, 404))
//   }
//   res.status(200).json({data: product})
// })


// create product - router: POST /api/product - private
exports.createProduct = asyncHandler(async (req,res) => {
  req.body.slug = slugify(req.body.title)
  const product = await ProductModel.create(req.body)
  res.status(201).json({data: product})
})

// update product - router: PUT /api/product/:id - private
exports.updateProduct = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const product = await ProductModel.findByIdAndUpdate(
    {_id:id},
    req.body,
    {new:true})
  if (!product){
    return next(new ApiError(`product is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: product})
})

// delete product - router: DELETE /api/product/:id - private
exports.deleteProduct = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const product = await ProductModel.findByIdAndDelete(id)
  if (!product){
    return next(new ApiError(`product is not found on id: ${id}`, 404))
  }
  res.status(204).json({message:"product is removed"})
})
exports.getProductByCategory = asyncHandler(async(req,res)=>{
  const products =await ProductModel.find({category:req.params.categoryId})
  console.log(products)

  res.status(200).json( { apiStatus:true , data : products , apiMessage : "There are the category products" } )
})