const Joi =require('joi');

const addPhotoSchema = ()=>{
    return Joi.object({
        title : Joi.string().min(5).required(),
        caption : Joi.string().min(8).required(),
        image : Joi.string().uri().required(),
    });
}


module.exports = {
    addPhotoSchema,
}