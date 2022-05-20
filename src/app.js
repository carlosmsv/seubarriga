const app = require('express')();
/* 
  assim fica mais simples do que:
  const express = require('express')
  const app = express();
*/

app.get('/', (req, res) => {
  res.status(200).send();
})

module.exports = app;