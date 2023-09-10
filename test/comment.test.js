const supertest = require('supertest');
const {describe, beforeEach, test, expect} = require("@jest/globals");
const jwt = require('jsonwebtoken');
const {removePhotoTest, removeUserTest,insertUserTest,insertPhotoTest, lastPkUser, lastPkPhoto, removeCommentTest,
    insertCommentTest, lastPkComment
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

describe('GET /comments',()=>{
    test('get all comment',async ()=>{
        const response = await supertest(app)
            .get('/comments')
            .set('Authorization',token);
        expect(response.status).toBe(200);
        const comments = response.body.data.comments;
        expect(comments).toHaveLength(1);
        expect(comments[0]).toHaveProperty('comment','Comment photo budiman');
        expect(comments[0]).toHaveProperty('Photo');
    });
    test('get all comment fail, token invalid',async ()=>{
        const response = await supertest(app)
            .get('/comments')
            .set('Authorization','dsdjadhos');
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
    test('get all comment fail, no token ',async ()=>{
        const response = await supertest(app)
            .get('/comments')
            .set('Authorization','');
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
});

describe('GET /comments/:commentId',()=>{
    test('Get Comment success',async ()=>{
        const response = await supertest(app)
            .get(`/comments/${await lastPkComment()}`)
            .set('Authorization',token);
        expect(response.status).toBe(200);
        const comment = response.body.data.comment;
        expect(comment).toHaveProperty('comment','Comment photo budiman');
        expect(comment).toHaveProperty('photoId',await lastPkPhoto());
        expect(comment).toHaveProperty('userId',await lastPkUser());
        expect(comment).toHaveProperty('Photo');
        expect(comment.Photo).toHaveProperty('title','Photo budiman');
    });
    test('get comment fail, token invalid',async ()=>{
        const response = await supertest(app)
            .get('/comments/'+ await lastPkComment())
            .set('Authorization','dsdjadhos');
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
    test('get comment fail, no token ',async ()=>{
        const response = await supertest(app)
            .get('/comments/'+ await lastPkComment())
            .set('Authorization','');
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
});

describe('POST /comments',()=>{
    test('add comment success',async ()=>{
        const response = await supertest(app)
            .post('/comments')
            .set('Authorization',token)
            .send({comment : 'Comment Photo Budiman 2',photoId : await lastPkPhoto()});
        expect(response.status).toBe(201);
        expect(response.body.message).toMatch(/add comment success/i);
        const id = response.body.data.id;
        expect(id).toBe(await lastPkComment());
    });

    test('add comment fail, invalid input',async ()=>{
        const response = await supertest(app)
            .post('/comments')
            .set('Authorization',token)
            .send({comment : '',photoId : await lastPkPhoto()});
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });
    test('add comment fail, no found photo',async ()=>{
        const response = await supertest(app)
            .post('/comments')
            .set('Authorization',token)
            .send({comment : 'Comment photo budiman 2',photoId : (await lastPkPhoto() + 1 )});
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/photo not found/i)
    });

    test('add comment fail, token invalid',async ()=>{
        const response = await supertest(app)
            .post('/comments')
            .set('Authorization','dsdjadhos');
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
    test('get comment fail, no token ',async ()=>{
        const response = await supertest(app)
            .post('/comments')
            .set('Authorization','');
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
});

describe('PUT /comments', () => {
    test('Update comment success',async ()=>{
        const response = await supertest(app)
            .put('/comments/' + await lastPkComment())
            .set('Authorization',token)
            .send({comment : 'Update comment budiman'});
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/update comment success/i);
    });

    test('update comment fail, no found comment',async ()=>{
        const response = await supertest(app)
            .put('/comments/' + await lastPkComment() + 1)
            .set('Authorization',token)
            .send({comment : 'Comment photo budiman 2'});
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/comment not found/i)
    });

    test('update comment fail, invalid input',async ()=>{
        const response = await supertest(app)
            .put('/comments/' + await lastPkComment())
            .set('Authorization',token)
            .send({comment : ''});
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });

    test('update comment fail, token invalid',async ()=>{
        const response = await supertest(app)
            .put('/comments/' + await lastPkComment())
            .set('Authorization','dsdjadhos')
            .send({comment : 'Comment photo budiman 2'});
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
    test('update comment fail, no token ',async ()=>{
        const response = await supertest(app)
            .put('/comments/' + await lastPkComment())
            .set('Authorization','')
            .send({comment : 'Comment photo budiman 2'});
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('update comment fail, forbidden',async ()=>{
        const response = await supertest(app)
            .put('/comments/' + (await lastPkComment() - 1))
            .set('Authorization',token)
            .send({comment : 'Comment photo budiman 2'});
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/forbidden/i);
    });
});

describe('DELETE /comments/:commentId', () => {
    test('Delete comment success',async ()=>{
        const response = await supertest(app)
            .delete(`/comments/${await lastPkComment()}`)
            .set('Authorization',token);
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/delete comment success/i)
    });

    test('Delete comment fail, comment not found',async ()=>{
        const response = await supertest(app)
            .delete(`/comments/${await lastPkComment()+1}`)
            .set('Authorization',token);
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/comment not found/i)
    });

    test('delete comment fail, token invalid',async ()=>{
        const response = await supertest(app)
            .delete('/comments/' + await lastPkComment())
            .set('Authorization','dsdjadhos')
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });
    test('delete comment fail, no token ',async ()=>{
        const response = await supertest(app)
            .delete('/comments/' + await lastPkComment())
            .set('Authorization','')
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Unauthorized/i);
    });

    test('delete comment fail, forbidden',async ()=>{
        const response = await supertest(app)
            .delete('/comments/' + (await lastPkComment() - 1))
            .set('Authorization',token)
        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/forbidden/i);
    });
});