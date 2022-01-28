const Router = require('express');
const router = new Router();
const register = require('./auth/register')
const login = require('./auth/login')

router.post('/auth/register', register);
router.post('/auth/login', login);

module.exports = router;