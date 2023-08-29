const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError')

const ProductModel = require('../models/productModel')
const cartModel = require('../models/cartModel')

// const calcTotalCartPrice = async (cart) => {
//   await cart.populate({ path: 'cartItems.product' })
//   let totalPrice = 0
//   cart.cartItems.forEach((item) => {
//     totalPrice += item.quantity * (item.product.price - item.product.discount)
//   });
//   return totalPrice
// }

// add product to cart - POST /api/carts - Private User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body
  const product = await ProductModel.findById(productId)
  // 1) Get cart for logged user
  let cart = await cartModel.findOne({ user: req.user._id })
  if (!cart) {
    // create cart for logged user
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [{ product: productId }]
    })
    cart = await cartModel.findById(cart._id)
  } else {

    // if product exist in cart, update product quentity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product._id.toString() === productId
    );
    if (productIndex > -1) {
      cart.cartItems[productIndex].quantity++
    } else {
      // product not exist on cart push product to cartItem array
      cart.cartItems.push({ product: productId, price: product.price })
    }
  }

  ////// calculate total price
  // cart.populate({path:'cartItems.product'})

  // cart.populated('cartItems.product')
  // cart.totalCartPrice = Math.ceil(await calcTotalCartPrice(cart))
  await cart.save();
  res.status(200).json({
    status: 'success',
    message: 'Product added to Cart',
    numOfCartItem: cart.cartItems.length,
    data: cart
  })
})

//////////////////////////////////////////////////////
// Get logged user cart - GET /api/cart - Private User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id }).populate({ path: 'cartItems.product', populate: { path: 'category' } })//,select:['title','price','category']

  if (!cart) {
    return next(new ApiError(`there is no cart to user id: ${req.user._id}`, 404))
  }


  res.status(200).json({
    status: 'success',
    numOfCartItem: cart.cartItems.length,
    data: cart
  })
})
//////////////////////////////////////////////////////
// Remove specific cart item - Delete /api/cart/:itemId - Private User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user:req.user._id})
const i=cart.cartItems.findIndex(item =>{
  console.log(item.product.toString())
  console.log(req.params.itemId)
  console.log(item.product.toString()== req.params.itemId)
  return item.product.toString()== req.params.itemId})
  if(i>-1){
    if(cart.cartItems[i].quantity>1){
      cart.cartItems[i].quantity--
    }else{
      cart.cartItems.splice(i,1)
    }
  }else{
    return next(new ApiError(`this product is not exist in your cart`, 404))
  }
  await cart.save()

  res.status(200).json({
    status: 'success',
    message: 'Product added to Cart',
    data: cart
  })
})
//////////////////////////////////////////////////////
// Remove delete cart item - Delete /api/cart/:itemId - Private User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id })
  res.status(204).send()
})
//////////////////////////////////////////////////////
// Update specific cart item - PUT /api/cart/:itemId - Private User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  console.log(req.user._id)
  const cart = await cartModel.findOne({ user: req.user._id })

  if (!cart) {
    return next(new ApiError(`there is no cart for user id: ${req.user._id}`, 404))
  }
  // console.log(cart)
  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    cart.cartItems.splice(itemIndex ,1)
  } else {
    console.log('inside the else')
    return next(new ApiError(`this product is not exist in your cart`, 404))
  }
  console.log(cart)
  // calcTotalCartPrice(cart)

  await cart.save()
  res.status(200).json({
    status: 'success',
    numOfCartItem: cart.cartItems.length,
    data: cart
  })
})