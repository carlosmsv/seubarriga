module.exports = (app) => {
  const save = (account) => {
    return app.db('accounts').insert(account, '*')
  }

  return { save };
};