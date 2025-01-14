const {Router} = require('express');
const router = Router();

const postUserHandler = require('../Handlers/userHandlers/postUserHandler')
const deleteUserHandler = require('../Handlers/userHandlers/deleteUserHandler')
const getUserByEmailHandler = require('../Handlers/userHandlers/getUserByEmailHandler')
const getUserByIdHandler = require('../Handlers/userHandlers/getUserByIdHandler');
const { createPaypalOrder } = require('../Controllers/PaypalControllers/paypal');


const userAdminHandler = require('../Handlers/userHandlers/userAdminHandler')


const addChipsHandler = require('../Handlers/chipsHandlers/addChipsHandler');
// const { receiveWebhook } = require('../Controllers/MPcontrollers/paymentControl');
const getUserByNickHandler = require('../Handlers/userHandlers/getUserByNickHandler');
const postPayHandler = require('../Handlers/PayHandlers/postPayHandler');
const removeChipsHandler = require('../Handlers/chipsHandlers/removeChipsHandler');
const updateUserHandler = require('../Handlers/userHandlers/updateUserHandler');
const getAllUserHandler = require('../Handlers/userHandlers/getAllUserHandler');
const banUserHandler = require('../Handlers/userHandlers/banUserHandler');
const inactiveUserHandler = require('../Handlers/userHandlers/inactiveUserHandler');
const firstChipsHandler = require('../Handlers/userHandlers/firstChipsHandler');
const sendMailHandler = require('../Mailing/sendMailHandler');
const { receiveWebhook, createOrder } = require('../Controllers/MPcontrollers/paymentControl');
const { createOrderMx,receiveWebhookMx } = require('../Controllers/MPcontrollers/paymentControlMX');
const {
    getFavoritesHandler,
    addFavoriteHandler,
    removeFavoriteHandler,
} = require("../Handlers/favoriteHandlers"); 
const createGameHandler = require("../Handlers/gameHandlers/createGameHandler");



router.get('/getUsers',getAllUserHandler);
router.patch('/actualizar-usuario/:id',updateUserHandler);
router.post('/user-create', postUserHandler);
router.delete('/user-delete/:id', deleteUserHandler);
router.put('/userAdmin',userAdminHandler);
router.get('/user/:id', getUserByIdHandler);
router.put('/user-ban',banUserHandler);
router.put('/firstchips',firstChipsHandler)

router.get('/user-email', getUserByEmailHandler);
router.get('/user-nick',getUserByNickHandler)
router.put('/inactivar-user',inactiveUserHandler)

router.post('/send-mail', sendMailHandler)

router.get('/favorites/:userId', getFavoritesHandler); // Obtener juegos favoritos
router.post('/favorites', addFavoriteHandler); // Agregar favorito
router.delete('/favorites/:userId/:gameId', removeFavoriteHandler); // Eliminar favorito


router.post('/game', createGameHandler);//crea un juego

//------------------------------------------
//Chips
router.put('/remove/chips',removeChipsHandler)
router.put('/add/chips',addChipsHandler)
//------------------------------------------


//------------------------------------------
//MERCADOPAGO
router.post('/mepago/create-order', createOrder);
 router.post('/mepago/webhook', receiveWebhook);

 router.post('/mepago/create-order/mx', createOrderMx);
 router.post('/mepago/webhook/mx', receiveWebhookMx);

//------------------------------------------
//paypal

router.post('/paypal/create-order', createPaypalOrder);
//------------------------------------------
//Pay
router.post('/newpay',postPayHandler)
//------------------------------------------

module.exports= router;