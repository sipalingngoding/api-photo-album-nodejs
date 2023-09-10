const supertest = require('supertest');
const {describe, beforeEach, test, expect} = require("@jest/globals");
const jwt = require('jsonwebtoken');
const {removePhotoTest, removeUserTest,insertUserTest,insertPhotoTest, lastPkUser, lastPkPhoto, removeCommentTest,
    insertCommentTest
} = require("./util-test");

const app = require('../src/app');

let token;

beforeEach(async ()=>{
    await removeCommentTest();
    await removePhotoTest();
    await removeUserTest();
    await insertUserTest();
    await insertPhotoTest();
    await insertCommentTest();
    token = jwt.sign({userId : await lastPkUser()},process.env.SECRET_KEY_TOKEN,{expiresIn: '1h'});
});
require('dotenv').config();

const photoNew = {
    title : 'Photo Budiman aja',
    caption :'Photo Wisuda',
    image : 'https://avatars.githubusercontent.com/u/92094174?v=4'
}

describe('GET /photos',()=>{
    test('Find all photos',async ()=>{
        const response = await supertest(app)
            .get('/photos')
            .set('Authorization',token);
        expect(response.status).toBe(200);
        const photos = response.body.data.photos;
        expect(photos).toHaveLength(1);
        expect(photos[0]).toHaveProperty('title','Photo budiman');
        expect(photos[0]).toHaveProperty('caption','Kerja');
        expect(photos[0]).toHaveProperty('User');
        expect(photos[0]).toHaveProperty('Comments');
        expect(photos[0].User).toHaveProperty('full_name','Budiman Aja');
        const comments = photos[0].Comments;
        expect(comments).toHaveLength(1);
        expect(comments[0]).toHaveProperty('comment','Comment photo budiman')
    });
    test('Find all photos fail, token invalid',async ()=>{
        const response = await supertest(app)
            .get('/photos')
            .set('Authorization','43dfdsfswe32');
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
    test('Find all photos fail, token empty',async ()=>{
        const response = await supertest(app)
            .get('/photos')
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
});

describe('GET /photos/:photoId',()=>{
    test('Find photo success',async ()=>{
        const response = await supertest(app)
            .get('/photos/'+ await lastPkPhoto())
            .set('Authorization',token);
        expect(response.status).toBe(200);
        const photo = response.body.data.photo;
        expect(photo).toHaveProperty('title','Photo budiman');
        expect(photo).toHaveProperty('caption','Kerja');
        expect(photo).toHaveProperty('Comments');
        const comments = photo.Comments;
        expect(comments).toHaveLength(1);
    });


    test('find photo, not found',async ()=>{
        const response = await supertest(app)
            .get('/photos/'+ await lastPkPhoto()+1)
            .set('Authorization',token);
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/photo not found/i);
    });

    test('Find photo, token invalid',async ()=>{
        const response = await supertest(app)
            .get('/photos/'+ await lastPkPhoto())
            .set('Authorization','43dfdsfswe32');
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
    test('Find photo, token empty',async ()=>{
        const response = await supertest(app)
            .get('/photos/' + await lastPkPhoto());
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
});

describe('POST /photos',()=>{
    test('add photo success',async ()=>{
        const response = await supertest(app)
            .post('/photos')
            .set('Authorization',token)
            .send(photoNew);
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBe(await lastPkPhoto());
    });
    test('add photo fail, invalid input',async ()=>{
        const response = await supertest(app)
            .post('/photos')
            .set('Authorization',token)
            .send({...photoNew,title : 'Oke'});
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });
    test('add photo fail, invalid token',async ()=>{
        const response = await supertest(app)
            .post('/photos')
            .set('Authorization','dadsad')
            .send(photoNew);
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('add photo fail, token empty',async ()=>{
        const response = await supertest(app)
            .post('/photos')
            .set('Authorization','')
            .send(photoNew);
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
});

describe('PUT /photos/:photoId',()=>{
    test('update photo success',async ()=>{
        const response = await supertest(app)
            .put('/photos/'+ await lastPkPhoto())
            .set('Authorization',token)
            .send(photoNew);
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/update photo success/i);
    });

    test('update photo fail, not found',async ()=>{
        const response = await supertest(app)
            .put('/photos/'+ (await lastPkPhoto()+1))
            .set('Authorization',token)
            .send({...photoNew,title : 'Panjang1111'});
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/photo not found/i);
    });

    test('update photo fail, invalid input',async ()=>{
        const response = await supertest(app)
            .put('/photos/'+ await lastPkPhoto())
            .set('Authorization',token)
            .send({...photoNew,title : 'Oke'});
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });
    test('update photo fail, invalid token',async ()=>{
        const response = await supertest(app)
            .put('/photos/'+ await lastPkPhoto())
            .set('Authorization','dadsad')
            .send(photoNew);
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('update photo fail, token empty',async ()=>{
        const response = await supertest(app)
            .put('/photos/'+ await lastPkPhoto())
            .set('Authorization','')
            .send(photoNew);
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
    test('update photo fail, forbidden',async ()=>{
        const response = await supertest(app)
            .put('/photos/'+ (await lastPkPhoto() - 1) )
            .set('Authorization',token)
            .send(photoNew);
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/Forbidden/i);
    });
});

describe('DELETE /photos/:photoId',()=>{
    test('delete photo success',async ()=>{
        const response = await supertest(app)
            .delete('/photos/'+ await lastPkPhoto())
            .set('Authorization',token)
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/delete photo success/i);
    });

    test('delete photo fail, not found',async ()=>{
        const response = await supertest(app)
            .delete('/photos/'+ (await lastPkPhoto()+1))
            .set('Authorization',token)
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/photo not found/i);
    });


    test('delete photo fail, invalid token',async ()=>{
        const response = await supertest(app)
            .put('/photos/'+ await lastPkPhoto())
            .set('Authorization','dadsad')
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('delete photo fail, token empty',async ()=>{
        const response = await supertest(app)
            .put('/photos/'+ await lastPkPhoto())
            .set('Authorization','')
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
    test('delete photo fail, forbidden',async ()=>{
        const response = await supertest(app)
            .put('/photos/'+ (await lastPkPhoto() - 1) )
            .set('Authorization',token)
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/Forbidden/i);
    });
});