const express = require("express");

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    app.services.user.findAll()
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  });

  // TODO colocar isso no padrão com then, mais organizado do que o try catch no async await
  router.post('/',  async (req, res, next) => {
    try {
      const result = await app.services.user.save(req.body)
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
    
  }); 

  return router
} 