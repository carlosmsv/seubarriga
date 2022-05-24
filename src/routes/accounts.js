module.exports = (app) => {
  const create = async (req, res, next) => {
    app.services.accounts.save(req.body)
      .then((result) => {
        if(result.error) return res.status(400).json(result);
        return res.status(201).json(result[0]);
      }).catch(err => next(err))
  };

  const findAll = (req, res, next) => {
    app.services.accounts.findAll()
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  }

  const get = (req, res, next) => {
    app.services.accounts.find({ id: req.params.id})
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  }

  const update = (req, res, next) => {
    app.services.accounts.update(req.params.id, req.body)
      .then(result => res.status(200).json(result[0]))
      .catch(err => next(err));
  }

  const remove = (req, res, next) => {
    app.services.accounts.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch(err => next(err));
  }

  return { create, findAll, get, update, remove };
}