const express = require("express");
const {
    cashOrder,
    findAllOrders,
    speceficOrder,
    filterOrderForLoggedUser,
    updateOrderToPaid,
    updateOrderToDelivered,
    createStripeSession
} = require("../controllers/orderController");

const AuthController = require("../controllers/authUserController");
const router = express.Router();
router.use(AuthController.protect);

router.route('/checkout-session/:cartId').get(AuthController.allowedTo("user","seller"),createStripeSession)
router.put('/:id/pay',AuthController.allowedTo('admin'),updateOrderToPaid)
router.put('/:id/delivered',AuthController.allowedTo('admin'),updateOrderToDelivered)
router.route("/:cartId").post(AuthController.allowedTo("user","seller"),cashOrder);
router.get(
    "/",
    AuthController.allowedTo("user","admin"),
    filterOrderForLoggedUser,
    findAllOrders
);
router.get("/:id",speceficOrder);

module.exports = router;
