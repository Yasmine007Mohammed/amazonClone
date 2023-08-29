const multer = require('multer')
const ApiError = require('../utils/apiError')

const multerOptions = () =>{
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
// memory storage
  const multerStorage = multer.memoryStorage()
// only Image
  const multerFilter = function(req,file,cb){
    if (file.mimetype.startsWith('image')){
      cb(null,true)
    }else{
      cb(new ApiError(`only image allow`,400),false)
    }
  }

  const upload = multer({storage: multerStorage,fileFilter: multerFilter})

  return upload

}

exports.uploadSingleImage = (imageName) => multerOptions().single(imageName)

exports.uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields)
