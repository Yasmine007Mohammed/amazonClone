const globalError = (err,req,res,next) =>{
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  
  if(process.env.NODE_ENV === 'development'){
    errorForDevelopment(err,res)
  }else{
    errorForProduction(err,res)
  }
}

const errorForDevelopment = (err,res) =>{
  // error details
  res.status(err.statusCode).json({
    status: err.status,
    error: err ,
    message: err.message,
    stack:  err.stack
  });
}

const errorForProduction = (err,res) =>{
  // error details
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}
module.exports = globalError