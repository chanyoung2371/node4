const express = require('express');
const router = express.Router();
const loginCtrl = require('../controller/loginCtrl');

router.get('/register', loginCtrl.Register)

router.get('/login', loginCtrl.loginRoot);

router.post('/login', loginCtrl.loginAction);

router.get('/logout', loginCtrl.logout);

router.get('/welcome', loginCtrl.Welcome);

module.exports = router;