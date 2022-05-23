const app = require('express')();
const consign = require('consign');
const { query } = require('express');
const knex = require('knex');
const knexfile = require('../knexfile');
//const knexLogger = require('knex-logger');

// TODO criar chaveamento dinâmico
app.db = knex(knexfile.test);

//app.use(knexLogger(app.db)); 

consign({ cwd: 'src' , verbose: false })
  .include('./config/middlewares.js')
  .then('./routes')
  .then('./config/routes.js')
  .into(app)

app.get('/', (req, res) => {
  res.status(200).send();
})

/*
app.db.on('query', (query) => {
  console.log({sql:query.sql, binding: query.bindings ? query.bindings.join(',') : ''});
})
  .on('query-response', (response) => console.log(response))
  .on('error', error => console.log(error));
*/

module.exports = app;