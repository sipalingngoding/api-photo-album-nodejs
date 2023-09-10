const clientError = require('../error/clientError');
const errorMiddleware = (err,req,res,next)=>{
    if(!err){
        next()
        return;
    }
    if(err instanceof clientError){
        return res.status(err.statusCode).json({
            status : 'fail',
            message : err.message,
        })
    }
    return res.status(500).json({
        status : 'fail',
        message :'Internal Server Error',
    });
};

module.exports = errorMiddleware;