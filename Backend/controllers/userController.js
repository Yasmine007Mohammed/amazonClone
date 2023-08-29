// User (CRUD) & (admin)
const uploadfile  = require('../middlewares/imagMiddeware')
const fs = require('fs')
const path = require('path')

//
const slugify = require('slugify')
const multer = require('multer')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError')
const User = require('../models/userModel')

// // diskStorage engine
// const multerStorage = multer.diskStorage({
//   destination: function(req,file,cb){
//     cb(null, 'uploads/categories')
//   },
//   filename: function(req,file,cb){
//     const ext = file.mimetype.split('/')[1]
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
//     cb(null,filename)
//     console.log(req.file)
//   }
// })
// memoryStorage
const multerStorage = multer.memoryStorage(
//   {
//     destination: (req, file, cb) => {
//         cb(null, `uploads/user`)
//     },
//     filename: (req, file, cb) => {
//         const myFileName = Date.now() + file.fieldname + file.originalname
//         cb(null, myFileName)
//     }
// }
)
// only Image
const multerFilter = function(req,file,cb){
  if (file.mimetype.startsWith('image')){
    cb(null,true)
  }else{
    cb(new ApiError(`only image allow`,400),false)
  }
}

const upload = multer({storage: multerStorage,fileFilter: multerFilter,limits:{fileSize:5000000}})

exports.uploadUserImage = upload

exports.resizeImage = asyncHandler(async (req,res,next) =>{
  // const filename = `user-${uuidv4()}-${Date.now()}.jpeg`
  // if(req.file){
  //   await sharp(req.file.buffer)
  //     .resize(600, 600)
  //     .toFormat('jpeg')
  //     .jpeg({quality: 90})
  //     .toFile(`uploads/users/${filename}`);

  //     req.body.profileImg = filename 
  // }
    
  next();
})




// get all users - router: GET /api/user - privet
exports.getUsers = asyncHandler(async (req,res) =>{
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 4
  const skip = (page - 1) * limit
  const users = await User.find({}).skip(skip).limit(limit) // 5
  res.status(200).json({results: users.length, data:users})
})

// get single users - router: GET /api/uers/:id - privet
exports.getUser = asyncHandler(async(req,res,next) =>{
  const { id } = req.params
  const user = await User.findById(id)
  if (!user){
    // res.status(404).json({message: `user is not found on ${id}`})
    return next(new ApiError(`user is not found on id: ${id}`, 404))
  }
  res.status(200).json({data: user})
})
// create User - router: POST /api/User - private
exports.createUser = async (req,res) => {
  
   

  //

  try {
    let image
    const upload = uploadfile('user', ['image/png', 'image/webp', 'image/apng', 'image/gif', 'image/jpeg'])
    const uploadImage = upload.single('profileImg')
    uploadImage(req, res, async function (e) {
        if (e instanceof multer.MulterError){
          console.log(e)
          res.status(500).send({ apiStatus:false, data:e, apiMessage:e.message+ 'its a multer error' })

        }

        else if (e) {
            // Helper.formatMyAPIRes(res, 500, false, e, e.message)
            console.log(e)
            res.status(500).send({ apiStatus:false, data:e, apiMessage:e.message })

        }
        else {
            try {
                if (req.file) {
                    image = req.file.path.replace('uploads\\', '')
                    image = image.replace(/\\/g, '/')
                    req.body.profileImg = image
                }
                req.body.slug=slugify(req.body.name)

                 const user = await User.create(req.body)
                res.status(200).send({ apiStatus:true, data:{ file: req.file ? req.file : 'there is file uploaded',user }, apiMessage:'you Regisrte is Succsefully' })
              }
            catch (e) {
                console.log(e) 
                if (fs.existsSync(path.join(__dirname, '../uploads/' + image))) {
                    fs.unlinkSync(path.join(__dirname, '../uploads/' + image))
                }
                res.status(500).send({ apiStatus:false, data:e, apiMessage:e.message })

            }
        }
    })
} catch (e) {
    console.log(e)
    res.status(500).send({ apiStatus:false, data:e, apiMessage:e.message })
}



}

// update User - router: PUT /api/User/:id - private
exports.updateUser = async(req,res,next) => {
  // const { id } = req.params
  // console.log(req.body)

  // const user = await User.findByIdAndUpdate(
  //   {_id:id},
  //   {...req.body,slug: slugify(req.body.name)},
  //   {new:true})
  // if (!user){
  //   return next(new ApiError(`user is not found on id: ${id}`, 404))
  // }
  // res.status(200).json({data: user})

  
  try {
    let image
    const upload = uploadfile('user', ['image/png', 'image/webp', 'image/apng', 'image/gif', 'image/jpeg'])   
     const uploadImage = upload.single('profileImg')
    uploadImage(req, res, async function (e) {
        if (e instanceof multer.MulterError)
        res.status(500).send({ apiStatus:false, data:e, apiMessage:e.message+ 'its a multer error' })
        else if (e) {
          res.status(500).send({ apiStatus:false, data:e, apiMessage:e.message })
        }
        else {
            try {
                let oldImage
                const user = await User.findById(req.params.id) 
                if(!user){
                  throw new Error("There is no user with such id")
                }
                if (req.file) {
                    image = req.file.path.replace('uploads\\', '')
                    image = image.replace(/\\/g, '/')
                    req.body.profileImg = image
                    oldImage = user.profileImg
                }
                if(req.body.name){
                  req.body.slug=slugify(req.body.name)
                }
                for (let field in req.body) {
                    if (field != '_id'/* we her write all the fildes that isn't accessable to be edite*/ && req.body[field]) { user[field] = req.body[field] }
                }
                const result = await user.save()
                if (fs.existsSync(path.join(__dirname, '../uploads/' + oldImage)) && req.file) {
                    fs.unlinkSync(path.join(__dirname, '../uploads/' + oldImage))
                }
                res.status(200).send({ apiStatus:true, data:{ file: req.file ? req.file : 'there is file uploaded',user }, apiMessage:'you Regisrte is Succsefully' })
            }
            catch (e) {
                console.log(e)
                if (fs.existsSync(path.join(__dirname, '../uploads/' + image))) {
                    fs.unlinkSync(path.join(__dirname, '../uploads/' + image))
                }
                res.status(500).send({ apiStatus:false, data:e, apiMessage:e.message })
            }
        }
    })
} catch (e) {
    console.log(e)
    res.status(500).send({ apiStatus:false, data:e, apiMessage:e.message })
}
}

// delete User - router: DELETE /api/User/:id - private
exports.deleteUser = asyncHandler(async(req,res,next) => {
  const { id } = req.params
  const user = await User.findByIdAndDelete(id)
  if (!user){
    return next(new ApiError(`user is not found on id: ${id}`, 404))
  }
  res.status(204).json({message:"uesr is removed"})
})