const {User,Photo} = require('../db/models');
class userRepository{
    #User;
    constructor() {
        this.#User = User;
    }

    async findAll(){
        return this.#User.findAll({
            include : {
                model : Photo, attributes :['id','title','caption','image'],
            }
        });
    }

    async findByPk(pk){
        return this.#User.findByPk(pk,{
            include : {
                 model : Photo, attributes :['id','title','caption','image']
            }
        });
    }

    async findOne(data){
        return this.#User.findOne({
            where :{
                [data[0]] :data[1],
            }
        })
    };

    async insert({email,password,full_name,age,address,phone_number}){
        const userNew = await this.#User.create({
            email,password,full_name,age,address,phone_number,
        })
        return userNew.id;
    }

    async update({id,email,password,full_name,age,address,phone_number})
    {
        await this.#User.update({
            email,password,full_name,age,address,phone_number,
        },{
            where : {id}
        });
        return true;
    }

    async delete(id){
        await this.#User.destroy({
            where : {id},
        })
        return true;
    }

}

module.exports = userRepository;