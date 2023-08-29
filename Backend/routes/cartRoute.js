const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
} = require("../controllers/cartController");

const AuthController = require("../controllers/authUserController");

const router = express.Router();
router.use(AuthController.protect,) //AuthController.allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router 
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

module.exports = router;
