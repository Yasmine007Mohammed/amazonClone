const stripe = require('stripe')(process.env.Stripe_Key)
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const Order = require('../models/ordersModel');
const cartModel = require('../models/cartModel')
const ProductModel = require('../models/productModel');
const User=require('../models/userModel2')



// @desc     Create cash order
// @route   GET /api/order/cartId
// @access  private/protected/user
exports.cashOrder = asyncHandler(async (req, res, next) => {
    const shippingPrice = 0;
    // 1) Get cart depend on cartId
    const cart = await cartModel.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError('there is no product in cart for this user', 404))
    }
    // 2) Get order price depend on cart price "Check if coupon apply"

    const cartPrice = cart.totalCartPrice
    const totalOrderPrice = cartPrice + shippingPrice

    // 3) Create order with default paymentMethodType cash
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice,
    })
    // 4) After creating order, decrement product quantity, increment product sold
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { stock: -item.quantity, sold: +item.quantity } },
            },
        }));
        await ProductModel.bulkWrite(bulkOption, {});
        // 5) Clear cart depend on cartId
        await cartModel.findByIdAndDelete(req.params.cartId);
    }
    res.status(201).json({ status: 'success', data: order });
})

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'user') req.filterObj = { user: req.user._id };
    next();
});
// @desc    Get all orders
// @route   POST /api/orders
// @access  Protected/User-Admin-Manager
exports.findAllOrders = factory.getAll(Order);

// @desc    Get spcefic orders
// @route   POST /api/orders
// @access  Protected/User-Admin-Manager
exports.speceficOrder = factory.getOne(Order)

// @desc    update order status to paid
// @route   Put /api/orders/:id for order
// @access  Protected/Admin
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ApiError('can not find order', 404))
    }
    order.isPaid = true;
    order.paidAt = Date.now()
    const updatedOrder = await order.save();
    res.status(200).json({ status: 'success', data: updatedOrder });
})
// @desc    update order status to delivered
// @route   Put /api/orders/:id for order
// @access  Protected/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ApiError('can not find order', 404))
    }
    order.isDelivered = true;
    order.DeliveredAt = Date.now()
    const updatedOrder = await order.save();
    res.status(200).json({ status: 'success', data: updatedOrder });
})


// @desc    create section on stripe
// @route   get /api/orders/checkout/cartId
// @access  Protected/user


exports.createStripeSession = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findById(req.params.cartId).populate({
        path: 'cartItems.product',
        select: 'title imageCover describtion price ',
    });;
    if (!cart) {
        return next(
            new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
        );
    }
    const totalPrice = cart.totalCartPrice

    const line_items = cart.cartItems.map((item) => {
        return {
            price_data: {
                currency: 'usd',
                unit_amount:(item.product.price*item.quantity)*100,
                product_data: {
                    name: item.product.title,
                    description: item.product.description,
                    images: [item.product.imageCover],
                },
            },
            quantity: 1,
        };
    });

    const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url:`http://localhost:3000/CheckoutSuccessed`,
        cancel_url: `${req.protocol}://3000/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: req.body.shippingAddress,

    });
    res.status(200).json({ status: 'success', session });
})
const createStripeOrder=async (session)=>{
    const cartId=session.client_reference_id;
    const shippingAddress=session.metadata;
    const orderPrice=session.amount_total/100;
    const cart =await cartModel.findById(cartId)
    const user=await User.findOne({email:session.customer_email})
    //create order

    const order=await Order.create({
        user: user._id,
        cartItems: cart.cartItems,
        shippingAddress,
        totalOrderPrice:orderPrice,
        isPaid:true,
        paidAt:Date.now(),
        paymentMethodsType:'card'
    });
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { stock: -item.quantity, sold: +item.quantity } },
            },
        }));
        await ProductModel.bulkWrite(bulkOption, {});
        // 5) Clear cart depend on cartId
        await cartModel.findByIdAndDelete(cartId);
    }
}

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.end_point_Secret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type=="checkout.session.completed"){
        console.log('create order here......');

        //create order here 
        createStripeOrder(event.data.object)
    }
    res.status(200).json({received: true})
})
