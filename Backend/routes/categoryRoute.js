const express = require("express");

const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    resizeImage,
} = require("../controllers/categoryController");
const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const AuthController=require('../controllers/authUserController')

const router = express.Router();
router
    .route("/")
    .get(getCategories)
    .post(
        AuthController.protect,
        AuthController.allowedTo('admin'),
        uploadCategoryImage,
        resizeImage,
        createCategoryValidator,
        createCategory
    );

router
    .route("/:id")
    .get(getCategoryValidator, getCategory)
    .put(
        AuthController.protect,
        AuthController.allowedTo('admin'),
        uploadCategoryImage,
        resizeImage,
        updateCategoryValidator,
        updateCategory
    )
    .delete(AuthController.protect,
        AuthController.allowedTo('admin'),deleteCategoryValidator, deleteCategory);

module.exports = router;
