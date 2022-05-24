const request = require("supertest");
const jwt = require('jwt-simple');

const app = require('../../src/app');

const mail = `${Date.now()}@mail.com`
let user;

beforeAll( async () => {
  const res = await app.services.user.save({name: 'User Account', mail: `${Date.now()}@mail.com`, passwd:'123456'})
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Segredo!');
});

test('Deve listar todos os usuários', () => {
  return request(app).get('/users')
  .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    })
});

test('Deve inserir usuário com sucesso', () => {
  return request(app).post('/users')
  .send({name: 'Walter Mitty', mail, passwd: '123456' })
  .set('authorization', `bearer ${user.token}`)
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Walter Mitty')
    expect(res.body).not.toHaveProperty('passwd')
  })
});

test('Deve armazenar senha criptografada', async () => {
  const res = await request(app).post('/users')
    .send({name: 'Walter Mitty', mail: `${Date.now()}@mail.com`, passwd: '123456' })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(201);

  const { id } = res.body;
  const userDb = await app.services.user.findOne({id});
  expect(userDb.passwd).not.toBeUndefined();
  expect(userDb.passwd).not.toBe('123456');
})

test('Não deve inserir usuário sem nome', () => {
  return request(app).post('/users')
    .send({ mail: 'walt@mail.com', passwd: '123456' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Nome é um atributo obrigatório')
    })
})

test('Não deve inserir usuário sem e-mail', async() => {
  const result = await request(app).post('/users')
    .send({ name: 'Walter Mitty', passwd: '123456' })
    .set('authorization', `bearer ${user.token}`);
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('E-mail é um atributo obrigatório');
})

test('Não deve inserir usuário sem senha', (done) => {
  request(app).post('/users')
    .send({ name: 'Walter Mitty', mail: 'walt@mail.com' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha é um atributo obrigatório');
      done();
    })
    .catch(err => done.fail(err))
})

test('Não deve inserir usuário com e-mail já existente', () => {
  return request(app).post('/users')
    .send({name: 'Walter Mitty', mail, passwd: '123456' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Já existe um usuário com esse e-mail');
    })
    
})