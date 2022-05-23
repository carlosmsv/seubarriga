module.exports = (app) => {
  const save = (account) => {
    return app.db('accounts').insert(account, '*')
  }

  const findAll = () => {
    return app.db('accounts');
  }

  return { save, findAll };
};