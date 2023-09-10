const {Photo, User, Comment} = require('../db/models');
class photoRepository{
    #Photo;
    constructor() {
        this.#Photo = Photo;
    }

    async findAll(userId,attributes = ['id','title','caption','image','userId']){
        return this.#Photo.findAll({
            where : {
                userId
            },
            attributes : [...attributes],
            include : [{
                model : User, attributes :['id','email','full_name','address'],
            },{
                model : Comment,
            }]
        })
    }

    async findByPk(pk){
        return this.#Photo.findByPk(pk,{
            include : {model : Comment}
        });
    }

    async findOne(data){
        return this.#Photo.findOne({
            where : {
                [data[0]] : data[1],
            },
            include : {
                model : Comment,
            }
        })
    }

    async insert({title,caption,image,userId}){
        const photo = await this.#Photo.create({title,caption,image,userId});
        return photo.id;
    }

    async update({id,title,caption,image}){
        await this.#Photo.update({
            title,caption,image
        },{
            where : {id},
        })
        return true;
    }

    async delete(id){
        await this.#Photo.destroy({where:{id}});
        return true;
    }

}

module.exports = photoRepository;