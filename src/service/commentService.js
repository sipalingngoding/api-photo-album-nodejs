const commentRepository = require('../../src/repository/commentRepository');
const  notFoundError = require('../error/notFoundError');
const validate = require('../validator/validate');
const {addCommentSchema, updateCommentSchema} = require('../validator/comment');
const {Photo} = require('../db/models');
class commentService{
    #commentRepository;
    constructor() {
        this.#commentRepository = new commentRepository();
    }

    getAll(userId){
        return this.#commentRepository.findAll(userId);
    }

    async getOnePk(pk){
        const comment = await this.#commentRepository.findByPk(pk);
        if(!comment) throw new notFoundError('comment not found');
        return comment;
    }

    async add({comment,photoId,userId}){
        validate(addCommentSchema(),{comment,photoId});
        const photo = await Photo.findByPk(photoId);
        if(!photo) throw new notFoundError('photo not found')
        return this.#commentRepository.insert({comment,photoId,userId});
    }

    async update({comment,id}){
        const commentCheck = await this.#commentRepository.findByPk(id);
        if(!commentCheck) throw new notFoundError('comment not found');
        validate(updateCommentSchema(),{comment});
        return this.#commentRepository.update({comment,id});
    }

    async delete(id){
        const comment = await this.#commentRepository.findByPk(id);
        if(!comment) throw new notFoundError('comment not found');
        return this.#commentRepository.delete(id);
    }
}


module.exports  = commentService;