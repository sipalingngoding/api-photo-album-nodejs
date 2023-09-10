const Joi = require('joi');

const userRegisterSchema = ()=>{
    return Joi.object({
        email : Joi.string().email().required(),
        password : Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
        full_name : Joi.string().min(8).required(),
        age : Joi.number().integer().required(),
        address : Joi.string().min(5).required(),
        phone_number : Joi.string().required()
    });
};


const userLoginSchema = ()=>{
    return Joi.object({
        email : Joi.string().email().required(),
        password : Joi.string().required(),
    })
}

module.exports = {
    userRegisterSchema, userLoginSchema
}