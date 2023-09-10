const photoRepository = require('../repository/photoRepository');
const validate = require('../validator/validate');
const  {addPhotoSchema} = require('../validator/photo');
const clientError = require("../error/clientError");
const notFoundError = require('../error/notFoundError');

class photoService{
    #photoRepository;
    constructor() {
        this.#photoRepository = new photoRepository();
    }

    async getAll(userId){
        return this.#photoRepository.findAll(userId);
    };

    async getOnePk(pk){
        const photo = await this.#photoRepository.findByPk(pk);
        if(!photo) throw new notFoundError('Photo not found');
        return photo;
    };

    async add({title,caption,image,userId}){
        validate(addPhotoSchema(),{title,caption,image});
        return this.#photoRepository.insert({title,caption,image,userId});
    };

    async update({id,title,caption,image}){
        const photo = await this.#photoRepository.findByPk(id);
        if(!photo) throw new notFoundError('Photo not found');

        if(title === null) title = photo.title;
        if(caption === null) caption = photo.caption;
        if(image === null) image = photo.image;
        validate(addPhotoSchema(),{title,caption,image});

        await this.#photoRepository.update({id,title,caption,image});
        return true;
    };

    async delete(id){
        const photo = await this.#photoRepository.findByPk(id);
        if(!photo) throw new notFoundError('Photo not found');
        await this.#photoRepository.delete(id);
        return true;
    }
}

module.exports = photoService;