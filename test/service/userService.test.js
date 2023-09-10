const userService = require('../../src/service/userService');
const {beforeEach, describe, test, expect} = require("@jest/globals");
const {removeUserTest,insertUserTest, lastPkUser, findAllUser} = require("../util-test");
const clientError = require ('../../src/error/clientError');
const userServiceTest = new userService();

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

describe('Test Register User',()=>{
    test('Register success',async ()=>{
        const id = await userServiceTest.register(userNew);
        expect(id).toBe(await lastPkUser());
        const users = await findAllUser();
        expect(users).toHaveLength(3);
        expect(users[2]).toHaveProperty('email','admin@gmail.com');
    });

    test('Register fail, invalid input',async ()=>{
        await expect(userServiceTest.register({...userNew,email : ''})).rejects.toThrow(clientError);
    });
    test('Register fail, email already',async ()=>{
        await expect(userServiceTest.register({...userNew,email : 'diory@gmail.com'})).rejects.toThrow(/email already exist/i);
        const users = await findAllUser();
        expect(users).toHaveLength(2);
    });
});


describe('Test Login User',()=>{
    test('Login user success',async ()=> {
        const token = await userServiceTest.login({email:'diory@gmail.com',password :'password1'});
        expect(token).not.toBe('');
    });
    test('Login fail, input invalid',async ()=>{
        await expect(userServiceTest.login({email :'',password :'dsd'})).rejects.toThrow(clientError);
    });


    test('Login fail, email not found',async ()=>{
        await expect(userServiceTest.login({email:'admin@gmail.com',password :'sas'})).rejects.toThrow(/email or password is wrong/i);
    });
    test('Login fail, password wrong',async ()=>{
        await expect(userServiceTest.login({email:'diory@gmail.com',password :'salah'})).rejects.toThrow(/email or password is wrong/i);
    });
})




