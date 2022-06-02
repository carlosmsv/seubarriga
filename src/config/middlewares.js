const bodyParser = require('body-parser')
//const knexLogger = require('knex-logger')
const cors = require('cors');

module.exports = (app) => {
  app.use(bodyParser.json()); 
  //app.use(knexLogger.json()); 
  app.use(cors({ origin: '*' }))
}