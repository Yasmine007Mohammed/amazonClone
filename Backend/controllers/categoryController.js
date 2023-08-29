const slugify = require('slugify')
// const multer = require('multer')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError')
const ApiFeatures = require('../utils/apiFeatures')
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware')
const CategoryModel = require('../models/categoryModel')

/// uload single image
exports.uploadCategoryImage = uploadSingleImage("image")

// image processing
exports.resizeImage = asyncHandler(async (req,res,next) =>{
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
      // .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({quality: 95})
      .toFile(`uploads/categories/${filename}`);

      req.body.image = filename  // save image on DB
  next();
})

// get all category - router: GET /api/category - public
exports.getCategories = asyncHandler(async (req,res) =>{
  // build query
  const documentsCounts = await CategoryModel.countDocuments()
  const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query) 
  .paginate(documentsCounts)
  .filter()
  .search()
  .limitFields()
  .sort()

   // execute quere
  const {mongooseQuery,paginationResult} = apiFeatures
  const categories = await mongooseQuery
  res.status(200).json({results: categories.length, paginationResult,data:categories})
})

// get single category - router: GET /api/category/:id - public
exports.getCategory = asyncHandler(async(req,res,next) =>{
  const { id } = req.params
  const category = await CategoryModel.findById(id)
  if (!category){
    // res.status(404).json({message: `category is not found on ${id}`})
    return next(new ApiError(`category is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: category})
})
// create category - router: POST /api/category - private
exports.createCategory = asyncHandler(async (req,res) => {
  const name = req.body.name
  const image = req.body.image
  const category = await CategoryModel.create({name, slug: slugify(name),image})
  res.status(201).json({data: category})
})

// update category - router: PUT /api/category/:id - private
exports.updateCategory = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const { name } = req.body
  const category = await CategoryModel.findByIdAndUpdate(
    {_id:id},
    {name, slug: slugify(name)},
    {new:true})
  if (!category){
    return next(new ApiError(`category is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: category})
})

// delete category - router: DELETE /api/category/:id - private
exports.deleteCategory = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const category = await CategoryModel.findByIdAndDelete(id)
  if (!category){
    return next(new ApiError(`category is not found on id: ${id}`, 404))
  }
  res.status(204).json({message:"category is removed"})
})