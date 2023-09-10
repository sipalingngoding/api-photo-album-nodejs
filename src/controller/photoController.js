const photoService = require('../service/photoService');

const PhotoService= new photoService();
class photoController{
    static async getAll(req,res,next){
        try{
            const photos = await PhotoService.getAll(req.userId);
            return res.json({
                status : 'success',
                data : {
                    photos,
                },
            });
        }catch (err){
            next(err);
        }
    }

    static async getOne(req,res,next){
        try{
            const photo = await PhotoService.getOnePk(req.params.photoId);
            return res.json({
                status : 'success',
                data : {
                    photo,
                }
            });
        }catch (err){
            next(err);
        }
    };

    static async add(req,res,next){
        try{
            const {title =null,caption = null,image = null} = req.body;
            const id = await PhotoService.add({title,caption,image,userId : req.userId});
            return res.status(201).json({
                status : 'success',
                message : 'add photo success',
                data : {
                    id,
                },
            });
        }catch (err){
            next(err);
        }
    }

    static async update(req,res,next){
        try{
            const {title = null, caption = null,image  = null} = req.body;
            await PhotoService.update({id :req.params.photoId, title, caption,image});
            return res.json({
                status : 'success',
                message : 'update photo success',
            })
        }catch (err){
            next(err);
        }
    }

    static async delete(req,res,next){
        try{
            await PhotoService.delete(req.params.photoId);

            return res.json({
                status : 'success',
                message : 'delete photo success',
            });
        }catch (err){
            next(err);
        }
    }
}

module.exports = photoController;