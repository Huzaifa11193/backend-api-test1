const express = require('express');
const { login, register, verifyToken } = require('../middleware/auth');



const authRouter = express.Router();

authRouter.post('/login',login);
authRouter.post('/register',register);
authRouter.post('/verifytoken',verifyToken);

//http://localhost:9000/api/auth/login
//http://localhost:9000/api/auth/register

module.exports = authRouter;