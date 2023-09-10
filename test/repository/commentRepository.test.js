const {describe, test, beforeEach, expect} = require("@jest/globals");

const commentRepository = require('../../src/repository/commentRepository');
const {removeUserTest, removePhotoTest,removeCommentTest, insertUserTest, insertPhotoTest, insertCommentTest,
    lastPkPhoto, lastPkUser, lastPkComment, findAllComment
} = require("../util-test");

const commentRepositoryTest = new commentRepository();

beforeEach(async ()=>{
    await removeCommentTest();
    await removePhotoTest();
    await removeUserTest();
    await insertUserTest();
    await insertPhotoTest();
    await insertCommentTest();
});

describe('Test Find All Comment', () => {
    test('find all comments success',async ()=>{
        const comments = await commentRepositoryTest.findAll(await lastPkUser());
        expect(comments).toHaveLength(1);
        expect(comments[0]).toHaveProperty('comment','Comment photo budiman');
        expect(comments[0]).toHaveProperty('photoId',await lastPkPhoto());
        expect(comments[0]).toHaveProperty('userId',await lastPkUser());
        expect(comments[0]).toHaveProperty('Photo');
    });
});

describe('Test find Comment By Pk',()=>{
    test('Find Comment found',async ()=>{
        const comment = await commentRepositoryTest.findByPk(await lastPkComment());
        expect(comment).not.toBeNull();
        expect(comment).toHaveProperty('comment','Comment photo budiman');
        expect(comment).toHaveProperty('photoId',await lastPkPhoto());
        expect(comment).toHaveProperty('userId',await lastPkUser());
        expect(comment).toHaveProperty('Photo');
        expect(comment.Photo).toHaveProperty('title','Photo budiman')
        expect(comment.Photo).toHaveProperty('caption','Kerja')
    });

    test('Find comment fail, not found',async ()=>{
        await expect(commentRepositoryTest.findByPk(await lastPkComment() + 1)).resolves.toBeNull();
    });
});

describe('Test insert Comment',()=>{
    test('Insert comment success',async ()=>{
        const id = await commentRepositoryTest.insert({comment : 'Comment Photo budiman2',photoId : await lastPkPhoto(), userId : await lastPkUser()});
        expect(id).toBe(await lastPkComment());
        const comments = await findAllComment();
        expect(comments).toHaveLength(3);
    });
});

describe('Test update comment',()=>{
    test('Update comment success',async ()=>{
        await expect(commentRepositoryTest.update({comment : 'Comment photo budiman berubah',id : await lastPkComment()})).resolves.toBeTruthy();
        const comment = await commentRepositoryTest.findByPk(await lastPkComment());
        expect(comment).toHaveProperty('comment','Comment photo budiman berubah');
    });
});

describe('Test Delete comment',()=>{
    test('Delete Photo Success',async ()=>{
        await expect(commentRepositoryTest.delete(await lastPkComment())).resolves.toBeTruthy();
        const comments = await findAllComment();
        expect(comments).toHaveLength(1);
    });
});