const { validationResult } = require('express-validator')

// validation errors in request
const validatorMiddeleware = ((req,res,next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next()
})
module.exports = validatorMiddeleware