const {Router} = require('express');

const commentRouter = Router();

const commentController = require('../controller/commentController');
const authenticationMid = require('../middleware/authenticationMiddleware');
const authorizationMid = require('../middleware/authorizationMiddleware');

commentRouter.use(authenticationMid);

commentRouter.get('/',commentController.getAll);

commentRouter.get('/:commentId',commentController.getOne);

commentRouter.post('/',commentController.add);

commentRouter.put('/:commentId',authorizationMid,commentController.update);

commentRouter.delete('/:commentId',authorizationMid,commentController.delete);

module.exports  = commentRouter;