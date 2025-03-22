const express = require('express');
const router = express.Router();

const { userValidation, validateRegister, validateLogin } = require('../middlewares/user.js');
const { createUser, loginUser, findOneUser, searchUsers } = require('../controllers/user.js');

router.post('/create-user', validateRegister, userValidation, createUser);
router.post('/login-user', validateLogin, userValidation, loginUser);
router.post('/find-one-user', findOneUser);
router.post('/search-users', searchUsers);

module.exports = router; 
