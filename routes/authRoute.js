const express = require('express');
const { login } = require('../middleware/auth');



const authRouter = express.Router();

authRouter.post('/login',login);


//http://localhost:9000/api/auth/login
//http://localhost:9000/api/auth/register

module.exports = authRouter;