const mongoose = require('mongoose')
const Product = require('./productModel')

const reviewSchema = new mongoose.Schema({

    title: {
        type: String
    },
    ratings: {
        type: Number,
        min: [1 , "Min Ratings Value is 1.0"],
        max: [5 , "Min Ratings Value is 5.0"],
        required: [true ,'Review rating is required']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user2',
        required: [true ,'Review Must be long User']
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true ,'Review Must be long Product']
    }
},{ timestamps: true })

// populate used to used for display User Name in the review
reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name' });
    next();
});

// Aggregation Ratings , Quantity
reviewSchema.statics.calculateRatingQuantity = async function(productId){
    // stage (1) get all product reviews
    const allReviews = await this.aggregate([
        {
            $match:{product:productId}
        },
        // Stage (2) Gropuing reviews used productId
        {
            $group:{
                _id:'product',
                avgRatings: { $avg: '$ratings'},
                Quantity:{$sum:1}
            }
        }
    ]) 
    console.log(allReviews)
    if(allReviews.length > 0){
        await Product.findOneAndUpdate(productId ,{
            ratingAverage: allReviews[0].avgRatings,
            ratingQuntity: allReviews[0].Quantity,
        })
    }else{
        await Product.findOneAndUpdate(productId ,{
            ratingAverage:0,
            ratingQuntity:0,
         })
    }
}
  // this calculateRatingQuantity action save when POST
reviewSchema.post("save", async function(){
    await this.constructor.calculateRatingQuantity(this.product)
})

 // this calculateRatingQuantity action remove when POST
reviewSchema.post('remove', async function(){
    await this.constructor.calculateRatingQuantity(this.product)
})
module.exports = mongoose.model('Review', reviewSchema)