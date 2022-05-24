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
    })
})