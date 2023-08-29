const express = require('express')
const multer = require('multer')



const { getUsers,getUser,createUser,updateUser,deleteUser, uploadUserImage, resizeImage } = 
require('../controllers/userController');
const { getUserValidator,createUserValidator,updateUserValidator,deleteUserValidator } = 
require('../utils/validators/userValidator')

const router = express.Router()
router.route('/')
.get(getUsers)
.post(createUser,createUserValidator)

router.route("/:id")
.get(getUserValidator,getUser)
.put(updateUserValidator,updateUser)
.delete(deleteUserValidator,deleteUser)


module.exports = router