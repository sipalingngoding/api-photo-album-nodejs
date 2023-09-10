const Joi = require('joi');
const addCommentSchema = ()=>{
    return Joi.object({
        comment : Joi.string().required(),
        photoId : Joi.number().integer().required(),
    });
};

const updateCommentSchema = ()=>{
    return Joi.object({
        comment : Joi.string().required(),
    });
};

module.exports = {
    addCommentSchema, updateCommentSchema
}