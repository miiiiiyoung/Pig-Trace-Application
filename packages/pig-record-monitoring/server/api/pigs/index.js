var express = require('express')
var controller = require('./pigs')

var router = express.Router()

router.get('/', controller.get)

module.exports = router
