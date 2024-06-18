const express = require('express');
const { list, create, update, delete_, detail } 
= require('../controllers/userController');


const usersRouter = express.Router();

usersRouter.get('',list)
usersRouter.post('/create',create)
usersRouter.put('/edit/:id',update)
usersRouter.delete('/delete/:id',delete_)
usersRouter.get('/:id',detail)

//http://localhost:9000/api/user
//http://localhost:9000/api/user/create
//http://localhost:9000/api/user/edit/1
//http://localhost:9000/api/user/delete/1
//http://localhost:9000/api/user/1

module.exports = usersRouter; 