module.exports = (app) => {
  const findAll = (req, res) => {
    app.services.user.findAll()
      .then(result => res.status(200).json(result))

  };

  // TODO colocar isso no padrão com then, mais organizado do que o try catch no async await
  const create = async (req, res, next) => {
    try {
      const result = await app.services.user.save(req.body)
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
    
  }; 

  return { findAll, create }
} 