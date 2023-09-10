const photoRepository = require('../../src/repository/photoRepository');
const {beforeEach, describe, test, expect} = require("@jest/globals");
const {removePhotoTest, removeUserTest,insertPhotoTest,insertUserTest, lastPkUser, lastPkPhoto, findAllPhoto,
    removeCommentTest,insertCommentTest
} = require("../util-test");

const photoRepositoryTest  = new photoRepository();

beforeEach(async ()=>{
    await removeCommentTest();
    await removePhotoTest();
    await removeUserTest();
    await insertUserTest();
    await insertPhotoTest();
    await insertCommentTest();
});

const photoNew = {
    title : 'Photo Budiman aja',
    caption :'Photo Wisuda',
    image : 'https://avatars.githubusercontent.com/u/92094174?v=4'
}

describe('Test Find All Photo',()=>{
    test('Find All Photo Success',async ()=>{
        const photos = await photoRepositoryTest.findAll(await lastPkUser());
        expect(photos).toHaveLength(1);
        expect(photos[0]).toHaveProperty('id',await lastPkPhoto());
        expect(photos[0]).toHaveProperty('title','Photo budiman');
        expect(photos[0]).toHaveProperty('caption','Kerja');
        expect(photos[0]).toHaveProperty('User');
        expect(photos[0]).toHaveProperty('Comments');
        const user = photos[0].User;
        expect(user.email).toBe('budiman@gmail.com');
        expect(user.full_name).toBe('Budiman Aja');
        expect(user.address).toBe('Pekanbaru');
        const comments = photos[0].Comments;
        expect(comments).toHaveLength(1);
    });
});

describe('Test Find Photo By Pk',()=>{
    test('Find Photo success',async ()=>{
        const photo = await  photoRepositoryTest.findByPk(await lastPkPhoto());
        expect(photo).not.toBeNull();
        expect(photo).toHaveProperty('title','Photo budiman')
        expect(photo).toHaveProperty('caption','Kerja')
        expect(photo).toHaveProperty('userId',await lastPkUser());
        expect(photo).toHaveProperty('Comments');
        const comments = photo.Comments;
        expect(comments).toHaveLength(1);
        expect(comments[0]).toHaveProperty('comment','Comment photo budiman')
    });

    test('Find Photo fail, not found',async ()=>{
        const photo = await photoRepositoryTest.findByPk(await lastPkPhoto()+1);
        expect(photo).toBeNull();
    });
});

describe('Test Find Photo keyword',()=>{
    test('Find Photo success',async ()=>{
        const photo = await  photoRepositoryTest.findOne(['userId',await lastPkUser()]);
        expect(photo).not.toBeNull();
        expect(photo).toHaveProperty('title','Photo budiman')
        expect(photo).toHaveProperty('caption','Kerja')
        expect(photo).toHaveProperty('userId',await lastPkUser());
        expect(photo).toHaveProperty('Comments');
        const comments = photo.Comments;
        expect(comments).toHaveLength(1);
        expect(comments[0]).toHaveProperty('comment','Comment photo budiman');
    });

    test('Find Photo fail, not found',async ()=>{
        const photo = await photoRepositoryTest.findOne(['userId',await lastPkUser()+1]);
        expect(photo).toBeNull();
    });
});

describe('Test insert Photo',()=>{
    test('insert photo success',async ()=>{
        const id = await photoRepositoryTest.insert({...photoNew,userId : await lastPkUser()});
        expect(id).toBe(await lastPkPhoto());
        const photos = await findAllPhoto();
        expect(photos).toHaveLength(3);
        expect(photos[2]).toHaveProperty('title','Photo Budiman aja');
    });
});

describe('test update Photo',()=>{
    test('update photo success',async ()=>{
        await expect(photoRepositoryTest.update({...photoNew,id:await lastPkPhoto()})).toBeTruthy();
        const photo = await photoRepositoryTest.findByPk(await lastPkPhoto());
        expect(photo).toHaveProperty('title','Photo Budiman aja');
    });
});

describe('test delete Photo',()=>{
    test('delete photo success',async ()=>{
        await expect(photoRepositoryTest.delete(await lastPkPhoto())).toBeTruthy();
        const photos = await findAllPhoto();
        expect(photos).toHaveLength(1);
    });

    test('delete photo fail',async ()=>{
        await expect(photoRepositoryTest.delete(await lastPkPhoto()+1)).toBeTruthy();
        const photos = await findAllPhoto();
        expect(photos).toHaveLength(2);
    });
});