const userService = require('../service/userService');

const UserService = new userService();
class userController{
    static async register(req,res,next){
        try{
            const id = await UserService.register(req.body);
            return res.status(201).json({
                status :'success',
                message :'register user success',
                data : {
                    id
                },
            });
        }catch (err){
            next(err);
        }
    }

    static async login(req,res,next){
        try{
            const token = await UserService.login(req.body);
            return res.json({
                status :'success',
                data : {
                    token,
                }
            });
        }catch (err){
            next(err);
        }
    }
}

module.exports = userController;