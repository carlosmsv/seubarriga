module.exports = (app) => {
  const find = (filter = {}) => {
    return app.db("transfers")
      .where(filter)
      .select();
  };

  const save = (transfer) => {
    return app.db("transfers")
      .insert(transfer, '*')
  }

  return { find, save };
}