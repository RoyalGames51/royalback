const {Router} = require('express');
const router = Router();

const postUserHandler = require('../Handlers/userHandlers/postUserHandler')
const deleteUserHandler = require('../Handlers/userHandlers/deleteUserHandler')




router.post('/user/create', postUserHandler);
router.delete('/user', deleteUserHandler);

module.exports= router;