const {User,Photo,Comment} = require('../src/db/models');
const bcrypt = require("bcrypt");

const insertUserTest = async ()=>{
    await User.create({
        email : 'diory@gmail.com',
        password : bcrypt.hashSync('password1',10),
        full_name :'Diory Pribadi Sinaga',
        age : 22,
        address : 'Bekasi',
        phone_number :'0832431223',
        createdAt : new Date(),
        updatedAt : new Date(),
    });
    await User.create({
        email : 'budiman@gmail.com',
        password : bcrypt.hashSync('password2',10),
        full_name :'Budiman Aja',
        age : 23,
        address : 'Pekanbaru',
        phone_number :'08324331',
        createdAt : new Date(),
        updatedAt : new Date(),
    })
};

const insertPhotoTest =async ()=>{
    await Photo.create({
        title : 'Photo diory',
        caption :'Wisuda',
        image : 'https://avatars.githubusercontent.com/u/92094174?v=4',
        userId : await lastPkUser()-1,
    });
    await Photo.create({
        title : 'Photo budiman',
        caption :'Kerja',
        image : 'https://avatars.githubusercontent.com/u/92094174?v=4',
        userId : await lastPkUser(),
    });
};

const insertCommentTest  = async ()=>{
    await Comment.create({
        comment : 'Comment photo diory',
        userId : await lastPkUser()-1,
        photoId : await lastPkPhoto()-1,
    });
    await Comment.create({
        comment : 'Comment photo budiman',
        userId : await lastPkUser(),
        photoId : await lastPkPhoto(),
    });
};

const removeUserTest = async ()=>{
    await User.destroy({
        truncate : true,
        cascade : true,
    })
};


const removePhotoTest = async ()=>{
    await Photo.destroy({
        truncate : true,
        cascade : true
    });
};

const removeCommentTest = async ()=>{
    await Photo.destroy({
        truncate: true,
        cascade : true,
    })
}

const lastPkUser = async ()=>{
    const users = await User.findAll({order : [['id','DESC']]});
    return users[0].id;
};

const lastPkPhoto = async ()=>{
    const photos = await Photo.findAll({order : [['id','DESC']]});

    return photos[0].id;
};
const lastPkComment = async ()=>{
    const comment = await Comment.findAll({order : [['id','DESC']]});

    return comment[0].id;
}

const findAllUser  = async ()=>{
    return User.findAll();
};

const findAllPhoto = async ()=>{
    return Photo.findAll();
};

const findAllComment = async ()=>{
    return Comment.findAll();
}

module.exports = {
    insertUserTest,removeUserTest, lastPkUser, findAllUser,insertPhotoTest, removePhotoTest,lastPkPhoto,findAllPhoto,
    insertCommentTest,removeCommentTest,lastPkComment,findAllComment
}

