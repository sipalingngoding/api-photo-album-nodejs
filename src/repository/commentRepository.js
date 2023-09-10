const {Comment,Photo} = require('../db/models');

class commentRepository{
    #Comment;
    constructor() {
        this.#Comment = Comment;
    }

    async findAll(userId){
        return this.#Comment.findAll({
            include : {
                model: Photo,
            },
            where : {userId},
        })
    };

    async findByPk(pk){
        return this.#Comment.findByPk(pk,{
            include : {
                model : Photo,
            }
        });

    };

    async insert({comment,photoId,userId}){
        const photo = await this.#Comment.create({comment,photoId,userId});
        return photo.id;
    };


    async update({comment,id}){
        await this.#Comment.update({
            comment
        },{
            where : {id},
        });
        return true;
    }

    async delete(id){
        await this.#Comment.destroy({
            where : {
                id,
            },
        });
        return true;
    }
}

module.exports = commentRepository;