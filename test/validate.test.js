const {describe, expect, test} = require("@jest/globals");
const validate = require('../src/validator/validate');
const {userRegisterSchema} = require("../src/validator/user");
const clientError = require('../src/error/clientError');

const input = {
    email : 'diory@gmail.com',
    password : 'Diory123?!',
    full_name :'Diory Pribadi Sinaga',
    age : 22,
    address : 'Bekasi',
    phone_number :'0832431223',
};

describe('Test validate function',()=>{
    test('validate user register schema',()=>{
        expect(()=>{
            validate(userRegisterSchema(),input);
        }).not.toThrow();
    })


    test('validate user register, error',()=>{
        expect(()=>{
            validate(userRegisterSchema(),{...input,email : 'diory'});
        }).toThrow(clientError);
    });
});