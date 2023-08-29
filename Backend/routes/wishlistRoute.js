const express = require('express')
const { addWishlist, deleteWishlist, getUserWishlist} = 
require('../controllers/wishlistController')
const authUserController = require('../controllers/authUserController')

const router = express.Router() 

router.use(authUserController.protect, authUserController.allowedTo('user'))


router.route('/')
.post(addWishlist)
.get(getUserWishlist)

router.route("/:productId")
.delete(deleteWishlist)

module.exports = router