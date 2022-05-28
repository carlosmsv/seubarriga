const express = require("express");

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    app.services.transfer.find({user_id: req.user.id})
      .then(result => res.status(200).json(result))
      .catch(err => next(err))
  });

  router.post('/', (req, res, next) => {
    const transfer = { ...req.body, user_id: req.user.id};
    app.services.transfer.save(transfer)
      .then(result => res.status(201).json(result))
      .catch(err => next(err));
  });
   
  return router;
}