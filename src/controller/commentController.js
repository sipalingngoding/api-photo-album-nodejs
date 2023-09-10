const commentService = require('../service/commentService');

const CommentService = new commentService();
class commentController{
    static async getAll(req,res,next){
        try{
            const comments = await CommentService.getAll(req.userId);
            return res.json({
                status : 'success',
                data : {
                    comments,
                }
            })
        }catch (err){
            next(err);
        }
    }

    static async getOne(req,res,next){
        try {
            const comment = await CommentService.getOnePk(req.params.commentId);
            return res.json({
                status : 'success',
                data : {
                    comment,
                },
            });
        }catch (err){
            next(err);
        }
    }

    static async add(req,res,next){
        try{
            const id = await CommentService.add({comment : req.body.comment ,photoId : req.body.photoId, userId : req.userId});
            return res.status(201).json({
                status : 'success',
                message : 'add comment success',
                data : {
                    id,
                },
            });
        }catch (err){
            next(err);
        }
    }

    static async update(req,res,next){
        try {
            await CommentService.update({comment : req.body.comment,id : req.params.commentId});
            return res.json({
                status : 'success',
                message : 'update comment success',
            });
        }catch (err){
            next(err);
        }
    }

    static async delete(req,res,next){
        try {
            const {commentId} = req.params;
            await CommentService.delete(commentId);
            return res.json({
                status : 'success',
                message : 'delete comment success',
            });
        }catch (err){
            next(err);
        }
    }
}


module.exports = commentController;