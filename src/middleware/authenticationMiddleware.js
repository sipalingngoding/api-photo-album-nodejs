const jwt = require('jsonwebtoken');
const authenticationMiddleware = (req,res,next)=>{
    const token = req.get('Authorization');
    if(!token){
        return res.status(401).json({
            status : 'fail',
            message : 'Unauthorized',
        });
    }
    try{
        const decoded = jwt.verify(token,process.env.SECRET_KEY_TOKEN);
        req.userId = decoded.userId;
        next();
    }catch (err){
        return res.status(401).json({
            status : 'fail',
            message : 'Unauthorized',
        });
    }
}

module.exports = authenticationMiddleware;