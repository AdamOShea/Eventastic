const express = require('express');
const router = express.Router();

const { userValidation, validateRegister, validateLogin } = require('../middlewares/user.js');
const { createUser, loginUser, findOneUser } = require('../controllers/user.js');

router.post('/create-user', validateRegister, userValidation, createUser);
router.post('/login-user', validateLogin, userValidation, loginUser);
router.post('/find-one-user', findOneUser);

module.exports = router; // Use CommonJS export
