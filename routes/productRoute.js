
  const express = require('express');
  const { list, create, update, delete_, detail } = require('../controllers/ProductController');
  
  const productRouter = express.Router();
  
  productRouter.get('', list);
  productRouter.post('/create', create);
  productRouter.put('/edit/:id', update);
  productRouter.delete('/delete/:id', delete_);
  productRouter.get('/:id', detail);
  
  module.exports = productRouter;
  