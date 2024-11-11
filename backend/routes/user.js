const express = require('express');
const router = express.Router();

const {createUser, loginUser} = require('../controllers/user');
router.post('/create-user', createUser);
router.post('/login-user', loginUser);

module.exports = router;