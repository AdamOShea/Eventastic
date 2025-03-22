const express = require('express');
const router = express.Router();

const { addFriend, fetchFriends } = require('../controllers/friends');

router.post('/add-friend', addFriend);
router.post('/fetch-friends', fetchFriends);


module.exports = router;