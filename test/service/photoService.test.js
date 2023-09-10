const {describe, test, beforeEach, expect, afterAll} = require("@jest/globals");
const {removeUserTest, removePhotoTest, insertUserTest, insertPhotoTest, lastPkPhoto, lastPkUser, findAllPhoto,
    findAllComment, insertCommentTest, removeCommentTest
} = require("../util-test");
const photoService = require('../../src/service/photoService');
const notFoundError = require('../../src/error/notFoundError');
const clientError = require('../../src/error/clientError');

const photoServiceTest = new photoService();

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

describe('Get All Photo',()=>{
    test('get all photos',async ()=>{
        const photos = await photoServiceTest.getAll(await lastPkUser());
        expect(photos).toHaveLength(1);
        expect(photos[0]).toHaveProperty('User');
        expect(photos[0]).toHaveProperty('title','Photo budiman');
        expect(photos[0]).toHaveProperty('caption','Kerja');
        expect(photos[0].User).toHaveProperty('email','budiman@gmail.com');
        expect(photos[0].User).toHaveProperty('full_name','Budiman Aja');
        expect(photos[0]).toHaveProperty('Comments');
    });
});


describe('Test get One By Pk',()=>{
    test('get photo success',async ()=>{
        const photo = await photoServiceTest.getOnePk(await lastPkPhoto());
        expect(photo).not.toBeNull();
        expect(photo).toHaveProperty('title','Photo budiman')
        expect(photo).toHaveProperty('caption','Kerja')
        expect(photo).toHaveProperty('userId',await lastPkUser());
        expect(photo).toHaveProperty('Comments');
    });

    test('get photo not found',async ()=>{
        await expect(photoServiceTest.getOnePk(await lastPkPhoto()+1)).rejects.toThrow(clientError);
    });
});

describe('Test insert photo',()=>{
    test('add photo success',async ()=>{
        const id = await photoServiceTest.add({...photoNew,userId : await lastPkUser()});
        expect(id).toBe(id);
        const photos = await photoServiceTest.getAll(await lastPkUser());
        expect(photos).toHaveLength(2);
    });

    test('add photo fail, invalid input',async ()=>{
        await expect(photoServiceTest.add({...photoNew,caption :'Oke'})).rejects.toThrow(clientError);
    });
});


describe('Test update photo',()=>{
    test('update photo success',async ()=>{
        await expect(photoServiceTest.update({id:await lastPkPhoto(),title : 'Photo budiman ijazah',caption :'Caption New',image :null})).resolves.toBeTruthy();
        const photo = await photoServiceTest.getOnePk(await lastPkPhoto());
        expect(photo).toHaveProperty('title','Photo budiman ijazah');
        expect(photo).toHaveProperty('caption','Caption New');
        expect(photo).toHaveProperty('image','https://avatars.githubusercontent.com/u/92094174?v=4');
    });

    test('Update photo fail, not found',async ()=>{
        await expect(photoServiceTest.update({id : await lastPkPhoto()+1,title : 'Photo budiman ijazah',caption :'Caption New',image :null})).rejects.toThrow(/photo not found/i);
    });

    test('Update photo fail, invalid input',async ()=>{
        await expect(photoServiceTest.update({id : await lastPkPhoto()+1,title : 'Photo budiman ijazah',caption :'Caption New',image : ''})).rejects.toThrow(notFoundError);
    });
});

describe('Test delete photo',()=>{
    test('Delete photo success',async ()=>{
        await expect(photoServiceTest.delete(await lastPkPhoto())).resolves.toBeTruthy();
        const photos =  await findAllPhoto();
        expect(photos).toHaveLength(1);
        const comments = await findAllComment();
        expect(comments).toHaveLength(1);
    });

    test('Delete photo fail, not found',async ()=>{
        await expect(photoServiceTest.delete(await lastPkPhoto()+1)).rejects.toThrow(/photo not found/i);
        const photos = await photoServiceTest.getAll(await lastPkUser());
        expect(photos).toHaveLength(1);
    });
});