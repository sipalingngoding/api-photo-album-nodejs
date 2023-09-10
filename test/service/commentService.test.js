const {describe, beforeEach, test, expect} = require("@jest/globals");
const {removeCommentTest, removePhotoTest, insertPhotoTest, insertUserTest, insertCommentTest, lastPkComment,
    lastPkPhoto, lastPkUser, findAllComment
} = require("../util-test");
const commentService = require('../../src/service/commentService');
const notFoundError = require("../../src/error/notFoundError");
const clientError = require('../../src/error/clientError');

const commentServiceTest = new commentService();

beforeEach(async ()=>{
    await removeCommentTest();
    await removePhotoTest();
    await removeCommentTest();
    await insertUserTest();
    await insertPhotoTest();
    await insertCommentTest();
});

describe('Test Get All comments', () => {
    test('get all comment success',async ()=>{
        const comments = await commentServiceTest.getAll(await lastPkUser());
        expect(comments).toHaveLength(1);
    });
});

describe('Find One Comment By Pk', () => {
    test('Find comment success',async ()=>{
        const comment = await commentServiceTest.getOnePk(await lastPkComment());
        expect(comment).not.toBeNull();
        expect(comment).toHaveProperty('comment','Comment photo budiman');
        expect(comment).toHaveProperty('photoId',await lastPkPhoto());
        expect(comment).toHaveProperty('userId',await lastPkUser());
        expect(comment).toHaveProperty('Photo');
        const photo = comment.Photo;
        expect(photo).toHaveProperty('title','Photo budiman');
    });

    test('Find comment fail, not found',async ()=>{
        await expect(commentServiceTest.getOnePk(await lastPkComment()+1)).rejects.toThrow(notFoundError);
    });
});

describe('Test add comment',()=>{
    test('add comment success',async ()=>{
        const id = await commentServiceTest.add({comment : 'Comment photo budiman 2',photoId: await lastPkPhoto(), userId : await lastPkUser()});
        expect(id).toBe(await lastPkComment());
        const comments = await commentServiceTest.getAll(await lastPkUser());
        expect(comments).toHaveLength(2);
        expect(comments[1]).toHaveProperty('comment','Comment photo budiman 2');
    });

    test('add comment fail, invalid input',async ()=>{
        await expect(commentServiceTest.add({comment : '', photoId : await lastPkPhoto(), userId : await lastPkUser()})).rejects.toThrow(clientError);
    });
});

describe('Test update comment',()=>{
    test('update comment success',async ()=>{
        await expect(commentServiceTest.update({comment : 'Update comment photo budiman',id : await lastPkComment()})).resolves.toBeTruthy();
        const comment = await commentServiceTest.getOnePk(await lastPkComment());
        expect(comment).toHaveProperty('comment','Update comment photo budiman');
    });

    test('update comment fail, not found comment',async ()=>{
        try {
            await commentServiceTest.update({comment : 'Comment',id : await lastPkComment()});
        }catch (err){
            expect(err).toBeInstanceOf(notFoundError);
            expect(err.message).toMatch(/comment not found/i);
        }
    });

    test('update comment fail, invalid input',async ()=>{
        try {
            await commentServiceTest.update({comment : '',id : await lastPkComment()});
        }catch (err){
            expect(err).toBeInstanceOf(clientError);
            expect(err.message).not.toBe('');
        }
    });
});

describe('Test delete comment',()=>{
    test('delete comment success',async ()=>{
        await expect(commentServiceTest.delete(await lastPkComment())).resolves.toBeTruthy();
        const comments = await findAllComment();
        expect(comments).toHaveLength(1);
    });

    test('delete comment fail, not found',async ()=>{
        await expect(commentServiceTest.delete(await lastPkComment()+1)).rejects.toThrow(notFoundError);
    });
});