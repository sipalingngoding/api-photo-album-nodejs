const {beforeEach, describe, test, expect}  = require("@jest/globals");
const supertest = require('supertest');
const {removeUserTest,insertUserTest, lastPkUser} = require('./util-test');
const app = require('../src/app');

beforeEach(async ()=>{
    await removeUserTest();
    await insertUserTest();
});

const userNew = {
    email : 'admin@gmail.com',
    password :'Admin123?',
    full_name :'Admin Aja',
    age : 22,
    address : 'Papua',
    phone_number :'0832431223',
    createdAt : new Date(),
    updatedAt : new Date(),
}

describe('POST /users/register',()=>{
    test('Register Success',async ()=>{
        const response = await supertest(app)
            .post('/users/register')
            .send(userNew);
        expect(response.status).toBe(201);
        expect(response.body.message).toMatch(/register user success/);
        expect(response.body.data.id).toBe(await lastPkUser());
    });

    test('Register User fail, invalid input',async ()=>{
        const response = await supertest(app)
            .post('/users/register')
            .send({...userNew,password: 'password'});
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });

    test('Register user fail, email already',async ()=>{
        const response = await supertest(app)
            .post('/users/register')
            .send({...userNew,email :'diory@gmail.com'});
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/email already exist/i);
    })
});

describe('POST /users/login',()=>{
    test('User login success',async ()=>{
        const response = await supertest(app)
            .post('/users/login')
            .send({email :'diory@gmail.com',password :'password1'})
        expect(response.status).toBe(200);
        expect(response.body.data.token).not.toBe('');
    });

    test('User login fail, invalid input',async ()=>{
        const response = await supertest(app)
            .post('/users/login')
            .send({email :'diory@gmail.com',password :''})
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });

    test('User login fail, email not found',async ()=>{
        const response = await supertest(app)
            .post('/users/login')
            .send({email :'admin@gmail.com',password :'Diory123?!'})
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/email or password is wrong/i);
    });

    test('User login fail, password wrong',async ()=>{
        const response = await supertest(app)
            .post('/users/login')
            .send({email :'diory@gmail.com',password :'password'})
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/email or password is wrong/i);
    });
});