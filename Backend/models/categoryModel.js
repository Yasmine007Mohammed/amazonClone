const mongoose = require('mongoose')

// category schema
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    minlength: 3,
    maxlength: 30
  },
  slug: {
    type: String,
    lowercase: true
  },
  
  image: {
    type: String,
    
  }
  
},{
  timestamps: true
}
)

/// mongoose middleware
const setImageUrl = (doc) =>{
  if(doc.image){
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`
    doc.image = imageUrl
  }
} 
CategorySchema.post('init', (doc) =>{
  setImageUrl(doc)
})

CategorySchema.post('save', (doc) =>{  // create
  setImageUrl(doc)
})
// category model
const CategoryModel = mongoose.model('Category',CategorySchema)

module.exports = CategoryModel