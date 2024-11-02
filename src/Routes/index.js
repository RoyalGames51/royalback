const {Router} = require('express');
const router = Router();

const postUserHandler = require('../Handlers/userHandlers/postUserHandler')
const deleteUserHandler = require('../Handlers/userHandlers/deleteUserHandler')
const getUserByEmailHandler = require('../Handlers/userHandlers/getUserByEmailHandler')

const userAdminHandler = require('../Handlers/userHandlers/userAdminHandler')




router.post('/user/create', postUserHandler);
router.delete('/user', deleteUserHandler);
router.put('/userAdmin',userAdminHandler)

router.get('/user/email', getUserByEmailHandler);

module.exports= router;