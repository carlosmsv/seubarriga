const request = require("supertest");

const app = require('../src/app');

test('Deve responder na raiz', () => {
  // esse return funciona como uma promise, posso fazer um get, ver status 200 e etc
  return request(app).get('/')
    .then((res) => {
      expect(res.status).toBe(200)
    })
})