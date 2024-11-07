const {Router} = require('express');
const router = Router();

const postUserHandler = require('../Handlers/userHandlers/postUserHandler')
const deleteUserHandler = require('../Handlers/userHandlers/deleteUserHandler')
const getUserByEmailHandler = require('../Handlers/userHandlers/getUserByEmailHandler')
const getUserByIdHandler = require('../Handlers/userHandlers/getUserByIdHandler')


const userAdminHandler = require('../Handlers/userHandlers/userAdminHandler')


const addChipsHandler = require('../Handlers/chipsHandlers/addChipsHandler');
const { receiveWebhook } = require('../Controllers/MPcontrollers/paymentControl');
const getUserByNickHandler = require('../Handlers/userHandlers/getUserByNickHandler');




router.post('/user/create', postUserHandler);
router.delete('/user', deleteUserHandler);
router.put('/userAdmin',userAdminHandler)
router.get('/user/:id', getUserByIdHandler);

router.get('/user/email', getUserByEmailHandler);
router.get('/user/nick',getUserByNickHandler)




router.put('/add/chips',addChipsHandler)


//MERCADOPAGO
 router.post('/mepago/webhook', receiveWebhook);

module.exports= router;