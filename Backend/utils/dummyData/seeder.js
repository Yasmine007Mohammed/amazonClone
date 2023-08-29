const fs = require('fs')
const dotenv = require('dotenv')
const ProductModel = require('../../models/productModel')
const databaseConnection = require('../../config/connectToDB')

dotenv.config()

// connec to DB
databaseConnection()
// read data
const products = JSON.parse(fs.readFileSync('./products.json'))
// insert data
const insertData = async () =>{
    try{
        await ProductModel.create(products)
        console.log("Data Inserted");
        process.exit(0)
    }catch(error){
        console.log(error);
    }
}

// destroy data
const destroyData = async () =>{
    try{
        await ProductModel.deleteMany()
        console.log("Data Destroyed");
        process.exit()
    }catch(error){
        console.log(error);
    }
}
///// run seeder
if(process.argv[2] === '-i'){   // node seeder.js -i  =>insert , node seeder.js -d  =>destroy
    insertData()
}else if(process.argv[1] === '-d'){
    destroyData()
}