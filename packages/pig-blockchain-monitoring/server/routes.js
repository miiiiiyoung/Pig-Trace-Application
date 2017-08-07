module.exports = function (app) {
  'use strict'

  app.use('/transactions', require('./api/transactions'))
  app.use('/pigs', require('./api/pigs'))
}
