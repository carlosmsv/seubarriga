const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jwt-simple');


const MAIN_ROUTE = '/accounts'; 
let user;

beforeAll( async () => {
  const res = await app.services.user.save({name: 'User Account', mail: `${Date.now()}@mail.com`, passwd:'123456'})
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Segredo!');
});

test('Deve inserir uma conta com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Acc #1', user_id: user.id })
    .set('authorization', `bearer ${user.token}`)
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe('Acc #1');
    })
});

test('Não deve inserir uma conta sem nome', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ user_id: user.id })
    .set('authorization', `bearer ${user.token}`)
    .then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Nome é um atributo obrigatório');
    })
})

test.skip('Não deve inserir uma conta de nome duplicado, para o mesmo usuário', () => { });

test('Deve listar todas as contas', () => {
  return app.db('accounts')
    .insert({name:'Acc list', user_id: user.id})
    .then(() => request(app).get(MAIN_ROUTE).set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    })
});

test.skip('Deve listar apenas as contas do usuário', () => { })

test('Deve retornar uma conta por Id', () => {
  return app.db('accounts')
    .insert({name:'Acc by id', user_id: user.id}, ['id'])
    .then(acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`).set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Acc by id');
      expect(res.body.user_id).toBe(user.id);
    });
});

test.skip('Não deve retornar uma conta de outro usuário', () => { });

test('Deve alterar uma conta', () => {
  return app.db('accounts')
    .insert({name:'Acc by id', user_id: user.id}, ['id'])
    .then(acc => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
    .set('authorization', `bearer ${user.token}`)
      .send({name: 'Acc Updated'}))
    .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Acc Updated');
      })
}); 

test.skip('Não deve alterar uma conta de outro usuário', () => { });

test('Deve remover uma conta', () => {
  return app.db('accounts')
    .insert({ name: 'Acc to remove', user_id: user.id}, ['id'])
    .then(acc => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`).set('authorization', `bearer ${user.token}`))
    .then(res => expect(res.status).toBe(204));
});

test.skip('Não deve remover uma conta de outro usuário', () => { });