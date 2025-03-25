const express = require('express');
const router = express.Router();

const { userValidation, validateRegister, validateLogin } = require('../middlewares/user.js');
const { createUser, loginUser, searchUsers, findUserByEmail } = require('../controllers/user.js');

router.post('/create-user', validateRegister, userValidation, createUser);
router.post('/login-user', validateLogin, userValidation, loginUser);
router.post('/find-user-by-email', findUserByEmail);
router.post('/find-user-by-id')
router.post('/search-users', searchUsers);

module.exports = router; 
