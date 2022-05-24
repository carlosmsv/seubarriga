const request = require('supertest');
const app = require('../../src/app');

test('Deve receber token ao logar', () => {
  const mail = `${Date.now()}@mail.com`
  return app.services.user.save(
    {name:'Walter', mail, passwd: '123456' }
  ).then(() => request(app).post('/auth/signin')
      .send({mail, passwd: '123456'}))
    .then((res) => {
      expect(res.status).toBe(200);
      //console.log(res.body) para ver o token
      expect(res.body).toHaveProperty('token');
    });
});

test('Deve autenticar usuário com senha errada', () => {
  const mail = `${Date.now()}@mail.com`
  return app.services.user.save(
    {name:'Walter', mail, passwd: '123456' }
  ).then(() => request(app).post('/auth/signin')
      .send({mail, passwd: '654321'}))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Usuário inexistente ou senha incorreta');
    });
});

test('Não deve autenticar usuário que não existe', () => {
  return request(app).post('/auth/signin')
      .send({mail: 'naoexiste@mail.com', passwd: '654321'})
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Usuário inexistente ou senha incorreta');
    });
});

test('Não deve acesar uma rota protegida sem token', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(401);
    });
});