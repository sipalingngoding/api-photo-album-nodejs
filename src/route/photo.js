const {Router} = require('express');

const photoRouter = Router();

const photoController = require('../controller/photoController');
const authenticationMid = require('../middleware/authenticationMiddleware');
const authorizationMid = require('../middleware/authorizationMiddleware');

photoRouter.use(authenticationMid);

photoRouter.get('/',photoController.getAll);

photoRouter.get('/:photoId',photoController.getOne);

photoRouter.post('/',photoController.add);

photoRouter.put('/:photoId',authorizationMid,photoController.update);

photoRouter.delete('/:photoId',authorizationMid,photoController.delete);


module.exports = photoRouter;
