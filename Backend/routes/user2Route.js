const express = require("express");
const {
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
    createUserValidator,
    changePasswordValidator,
    updateMyDataValidator
} = require("../utils/validators/user2Validator");

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeImage,
    changePassword,
    getMyData,
    updateMePassword,
    updateMeData,
    deleteMeData
} = require("../controllers/userController2");
const router = express.Router();
router.put("/changePassword/:id", changePasswordValidator, changePassword);

const AuthController = require("../controllers/authUserController");
router.get('/getMyData',AuthController.protect,getMyData,getUser)
router.put('/updateMyPassword',AuthController.protect,updateMePassword)
router.put('/updateMyData',updateMyDataValidator,AuthController.protect,updateMeData)
router.delete('/deleteMyData',deleteMeData)
// admin
router
    .route("/")
    .get(AuthController.protect, AuthController.allowedTo("admin"), getUsers)
    .post(
        AuthController.protect,
        AuthController.allowedTo("admin"),
        uploadUserImage,
        resizeImage,
        createUserValidator,
        createUser
    );
router
    .route("/:id")
    .get(
        AuthController.protect,
        AuthController.allowedTo("admin"),
        getUserValidator,
        getUser
    )
    .put(
        AuthController.protect,
        AuthController.allowedTo("admin"),
        uploadUserImage,
        resizeImage,
        updateUserValidator,
        updateUser
    )
    .delete(
        AuthController.protect,
        AuthController.allowedTo("admin"),
        deleteUserValidator,
        deleteUser
    );

module.exports = router;
