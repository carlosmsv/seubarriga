module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select();
  };

  const save = (user) => {
    return app.db('users').insert(user, '*')
  }; 

  return { findAll, save }
}; 