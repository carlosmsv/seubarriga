const ValidationError = require('../errors/ValidationError')

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select();
  };

  const save = async (user) => {
    if(!user.name) throw new ValidationError('Nome é um atributo obrigatório');
    if(!user.mail) throw new ValidationError('E-mail é um atributo obrigatório');
    if(!user.passwd) throw new ValidationError('Senha é um atributo obrigatório');

    const userDb = await findAll({mail:user.mail})
    if(userDb && userDb.length > 0) throw new ValidationError('Já existe um usuário com esse e-mail');

    return app.db('users').insert(user, '*')
  }; 

  return { findAll, save }
}; 