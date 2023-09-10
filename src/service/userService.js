const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');

const userRepository = require('../repository/userRepository');
const validate = require('../validator/validate');
const {userRegisterSchema, userLoginSchema} = require('../validator/user');
const clientError = require("../error/clientError");
class userService{
    #userRepository;
    constructor() {
        this.#userRepository = new userRepository();
    }

    async register({email,password,full_name,age,address,phone_number}){
        validate(userRegisterSchema(),{email,password,full_name,age,address,phone_number});
        const user = await this.#userRepository.findOne(['email',email]);
        if(user) throw new clientError('email already exist');
        return await this.#userRepository.insert({email,password : await bcrypt.hash(password,10),full_name,age,address,phone_number});
    }

    async login({email,password}){
        validate(userLoginSchema(),{email,password});
        const user = await this.#userRepository.findOne(['email',email]);
        if(!user) throw new clientError('email or password is wrong');
        const check = await bcrypt.compare(password,user.password);
        if(!check) throw new clientError('email or password is wrong');
        return jwt.sign({userId: user.id },process.env.SECRET_KEY_TOKEN,{expiresIn: '1h'})
    }

}

module.exports = userService;