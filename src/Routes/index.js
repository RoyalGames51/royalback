const {Router} = require('express');
const router = Router();

const postUserHandler = require('../Handlers/userHandlers/postUserHandler')
const deleteUserHandler = require('../Handlers/userHandlers/deleteUserHandler')
const getUserByEmailHandler = require('../Handlers/userHandlers/getUserByEmailHandler')




router.post('/user/create', postUserHandler);
router.delete('/user', deleteUserHandler);


router.get('/user/email', getUserByEmailHandler);

module.exports= router;