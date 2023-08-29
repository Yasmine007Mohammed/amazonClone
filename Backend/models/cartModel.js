const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
  cartItems: [
    {
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
      },
      price: Number,
      quantity: {
        type: Number,
        default: 1,
      },
    }
  ],
  totalCartPrice: Number,
  totalCartQuantity: Number,
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user2',
  }
},
  { timestamps: true }
);
cartSchema.pre('save', async function () {
  console.log(this.isModified('cartItems'))
  if (this.isModified('cartItems')) {
    this.totalCartPrice = 0
    this.totalCartQuantity = 0
    await Promise.all(this.cartItems.map(async (item) => {
      const product = await productModel.findById(item.product)
      this.totalCartPrice += (product.price - product.discount) * item.quantity
      this.totalCartQuantity += item.quantity
    }))
    this.totalCartPrice = Math.ceil(this.totalCartPrice)
  }
})
module.exports = mongoose.model('Cart', cartSchema)
var productModel = require('./productModel')
