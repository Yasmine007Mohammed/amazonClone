<h1 align="center" id="title">Amazon Clone Back End</h1>
## Description
  E-commerce Web Application build with Node.js, Express, and MongoDB.
## Technologies 
Technologies  and Tools

  * Node.js
  * express
  * MongoDB
  * NPM
  * JWT
  * bcryptjs
  * nodemon
  * dotenv
  * nodemailer
  * multer
  * express-async-handler
  * express-validator
  * morgan
  * slugify
  
## **Key Features:** 

  **User Authentication:** Secure user authentication endpoints using JWT tokens.
  **User Profiles:** Fetch and update user profiles, including profile image, and contact information.
  **Product Management:** Add, Update, Delete products details such as name, description, price, photos, category, and rating.
  **Shopping Cart Management:** Users can Add or Remove items.
  **Order Management:** Handle order's details and Payment.
  **Review Management:** Create, retrieve, update, and delete reviews.
  **Pagination:** Paginate large data sets for efficient retrieval and presentation.
  **Upload Images:** Upload and manage images to be included in category, product or user profiles.

## Installation
  1. **Clone the Repository:**
   Use the `git clone` command to clone the GitHub repository to your local machine.
   ```bash
   git clone https://github.com/Yasmine007Mohammed/amazonClone.git

  2. **Initialize a Package.json File (if not already done):**
   If your project doesn't already have a `package.json` file, you can create one by running:
   ```bash
   npm init

  3. **Install depends**
   ```bash
      npm install

  4. **Run Application**
  ```bash
     npm test

## Project Structure
 ```powershell

.
├── config/
|    └── connectToDB.js
├── controllers/
|   ├── authUserController.js
|   ├── cartController.js
|   ├── categoryController.js
|   ├── handleFactoryController.js
|   ├── orderController.js
|   ├── productController.js
|   ├── reviewController.js
|   ├── userController2.js
|   └── withlistController.js
├── middlewares/
|   ├── errorMiddleware.js
|   ├── imageMiddleware.js
|   ├── uploadImageMiddleware.js
|   └── validatorMiddleware.js
├── models/
|   ├── cartModel.js
|   ├── categoryModel.js
|   ├── ordersModel.js
|   ├── productModel.js
|   ├── reviewModule.js
|   └── userModel2.js
├── routes/
|   ├── authRoute.js
|   ├── cartRoute.js
|   ├── categoryRoute.js
|   ├── orderRoute.js
|   ├── productRoute.js
|   ├── reviewRoute.js
|   ├── user2Route.js
|   └── wishlistRoute.js
├── utils/
|   ├── validators/
|   |   ├── authValidator.js
|   |   ├── categoryValidator.js
|   |   ├── productValidator.js
|   |   ├── reviewValidator.js
|   |   └── user2Validator.js
|   ├── apiError.js
|   ├── apiFeatures.js
|   └── sendEmail.js
├── .gitignore
├── app.js
├── package-lock.json
└── package.json
```








  
