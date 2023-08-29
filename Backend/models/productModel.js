const mongoose = require('mongoose')

// category schema
const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  slug: {
    type: String,
    lowercase: true
  },
  describtion: {
    type: String,
    required: true,
    maxlength: 2000
  },
  maxQuantity: {
    type: Number,
    
  },

  price: {
    type: Number,
    required: true,
    trim: true,
    max: [10000]
  },    
  discount: {
    type: Number,
    default : 0
  },
  imageCover:{
    type:String,
  },
  category:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
    required: true
  },
  ratingAverage: {
    type: Number,
    min: [1],
    max: [5]
  },
  ratingQuntity: {
    type: Number,
    default: 0
  },
  stock:{
    type: Number
  },
  sold:{
    type:Number,
    default:0
  }
}
,{
  timestamps: true,
  // to enable virtual
  toJSON :{ virtuals : true},
  toObject: { virtuals : true}
}
);

  // virtual reviews
ProductSchema.virtual('reviews',{
  ref:'Review',
  foreignField: 'product',
  localField: '_id'
})

// mongoose query middelware
ProductSchema.pre(/^find/,function(next){
  this.populate({
    path: 'category',
    select: 'name-_id'
  })
  next()
})
/// mongoose middleware
const setImageUrl = (doc) =>{
  if(doc.imageCover){
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`
    doc.imageCover = imageUrl
  }
  if(doc.images){
    const imagesList = []
    doc.images.forEach((image) =>{
      const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`
      imagesList.push(imageUrl)
    })
    doc.images = imagesList
  }
} 
ProductSchema.post('init', (doc) =>{
  setImageUrl(doc)
})

ProductSchema.post('save', (doc) =>{  // create
  setImageUrl(doc)
})
const ProductModel = mongoose.model('Product',ProductSchema)
module.exports = ProductModel