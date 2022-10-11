import express from 'express'
import {verifyToken} from '../utils/verifyToken'
import {register, login, user} from '../controllers/UserController'
var router = express.Router();

//Path to register a user. POST Request to API, no authentication required.
router.post('/register', register);
//Logs in the user and generates JWT which lasts for 2 hours.
router.post('/login', login);
router.get('/user', verifyToken, user);

module.exports = router;