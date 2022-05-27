const express = require("express");

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    app.services.transaction.find(req.user.id)
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  });

  router.post('/', (req,res,next) => {
    app.services.transaction.save(req.body)
      .then(result => res.status(201).json(result[0]))
      .catch(err => next(err))
  })

  router.get('/:id', (req, res, next) => {
    app.services.transaction.findOne({id:req.params.id})
    .then(result => res.status(200).json(result))
    .catch(err => next(err));
  });

  router.put('/:id', (req, res, next) => {
    app.services.transaction.update(req.params.id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(err => next(err));
  });

  return router;
};