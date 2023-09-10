const {describe, test, beforeEach, expect} =  require('@jest/globals');
const userRepository = require("../../src/repository/userRepository");
const {insertUserTest, removeUserTest, lastPkUser, removePhotoTest, insertPhotoTest} = require("../util-test");
const bcrypt = require("bcrypt");

const userRepositoryTest = new userRepository();

beforeEach(async ()=>{
    await removeUserTest();
    await removePhotoTest();
    await insertUserTest();
    await insertPhotoTest();
});

const userNew = {
    email : 'admin@gmail.com',
    password : bcrypt.hashSync('password3',10),
    full_name :'Admin',
    age : 22,
    address : 'Papua',
    phone_number :'0832431223',
    createdAt : new Date(),
    updatedAt : new Date(),
}

describe('Test Find All',()=>{
    test('Find All users success',async ()=>{
        const users = await userRepositoryTest.findAll();
        expect(users).toHaveLength(2);
        expect(users[0]).toHaveProperty('email','diory@gmail.com')
        expect(users[1]).toHaveProperty('email','budiman@gmail.com')
        expect(users[0]).toHaveProperty('address','Bekasi')
        expect(users[1]).toHaveProperty('address','Pekanbaru')
        expect(users[1]).toHaveProperty('Photos');
        const photos = users[1].Photos;
        expect(photos).toHaveLength(1);
    })
})

describe('Test Find By Pk',()=>{
    test('Find User success, found',async ()=>{
        const user = await userRepositoryTest.findByPk(await lastPkUser());
        expect(user).not.toBeNull();
        expect(user).toHaveProperty('email','budiman@gmail.com');
        expect(user).toHaveProperty('address','Pekanbaru');
        expect(user).toHaveProperty('Photos');
        const photos = user.Photos;
        expect(photos).toHaveLength(1);
        expect(photos[0]).toHaveProperty('title','Photo budiman')
    });

    test('Find User not found ',async ()=>{
        const user = await userRepositoryTest.findByPk(await lastPkUser()+1);
        expect(user).toBeNull();
    });
});

describe('Test Find One',()=>{
    test('Find User success with email',async ()=>{
        const user = await userRepositoryTest.findOne(['email','budiman@gmail.com']);
        expect(user).not.toBeNull();
        expect(user.id).toBe(await lastPkUser());
        expect(user).toHaveProperty('address','Pekanbaru');
    });
    test('Find User success with address',async ()=>{
        const user = await userRepositoryTest.findOne(['address','Bekasi']);
        expect(user).not.toBeNull();
        expect(user.id).toBe(await lastPkUser()-1);
        expect(user).toHaveProperty('email','diory@gmail.com');
    });


    test('Find User fail, not found',async ()=>{
        const user = await userRepositoryTest.findOne(['email','admin@gmai.com']);
        expect(user).toBeNull();
    });
});

describe('Test insert User',()=>{
    test('insert user success',async ()=>{
        const id = await userRepositoryTest.insert(userNew);
        expect(id).toBe(await lastPkUser());
        const users = await userRepositoryTest.findAll();
        expect(users).toHaveLength(3);
    });
});

describe('Test Update',()=>{
    test('update user success',async ()=>{
        expect(await userRepositoryTest.update({...userNew,id : await lastPkUser()}));
        const user = await userRepositoryTest.findByPk(await lastPkUser());
        expect(user).toHaveProperty('email','admin@gmail.com');
        expect(user).toHaveProperty('full_name','Admin');
    });
});

describe('Test Delete User',()=>{
    test('delete user success',async ()=>{
        expect(await userRepositoryTest.delete(await lastPkUser())).toBeTruthy();
        const users = await userRepositoryTest.findAll();
        expect(users).toHaveLength(1);
        expect(users[0]).toHaveProperty('email','diory@gmail.com');
    });
});