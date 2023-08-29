const path = require('path')
const express = require('express')
const morgan = require('morgan')
const databaseConnection = require('./config/connectToDB')
require('dotenv').config()
const ApiError = require('./utils/apiError')
const globalError = require('./middlewares/errorMideleware')
// const userRoute = require('./routes/userRoute')
const cors=require("cors");
const helmet=require("helmet");
const compression = require('compression')
const {webhookCheckout}=require('./controllers/orderController')


// connec to DB
databaseConnection()
// Init app
const app = express()
app.use(cors())
// app.options('*',cors())
// compress all responses
app.use(compression())
app.use(helmet( { crossOriginResourcePolicy: false}));

//checkout webhook
app.post('/Webhooks-checkout', express.raw({type: 'application/json'}),webhookCheckout)

// Middelware
app.use(express.json())
app.use(express.static(path.join(__dirname,'uploads')))

//routes
app.use('/api/category',require('./routes/categoryRoute'))
app.use('/api/products',require('./routes/productRoute'))
app.use('/api/users', require('./routes/user2Route'))
app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/cart', require('./routes/cartRoute'))
app.use('/api/orders', require('./routes/orderRoute'))
app.use('/api/reviews', require('./routes/reviewRoute'))
app.use('/api/wishlist', require('./routes/wishlistRoute'))

app.all('*' , (req,res,next) =>{
  next(new ApiError(`can not find this route: ${req.originalUrl}`,400))
})

// global error handel middelware inside express
app.use(globalError)

// run server
const PORT = process.env.PORT || 8000 
const server = app.listen(PORT, () =>{
  console.log(`Server is running on Port ${PORT}`);
})

// hundel errors outside exress
process.on('unhandledRejection',(err) =>{
  console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`)
  server.close(() =>{
    console.error("Server closed");
    process.exit(1)
  })
})