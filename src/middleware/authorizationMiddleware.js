const {Photo, Comment} = require('../db/models');
const authorizationMiddleware = async (req,res,next)=>{
    const userId = req.userId;
    const { photoId = null, commentId = null } =  req.params;
    if(photoId !== null) {
        const photo = await Photo.findOne({
            where : {id: photoId},
        });
        if(!photo){
            next();
            return ;
        }
        if(userId !== photo.userId) {
            return res.status(403).json({
                status : 'fail',
                message : 'forbidden',
            });
        }
    }else if(commentId !== null){
        const comment = await Comment.findOne({
            where : {id : commentId},
        });
        if(!comment){
            next();
            return ;
        }
        if(userId !== comment.userId) {
            return res.status(403).json({
                status : 'fail',
                message : 'forbidden',
            });
        }
    }
    next();
}

module.exports = authorizationMiddleware;