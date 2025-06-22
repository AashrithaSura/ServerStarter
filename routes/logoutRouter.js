const express = require('express')
const logoutRouter = express.Router()
const path = require('path')
const { handleLogout } = require('../controllers/logoutcontroller')

logoutRouter.get('/', handleLogout)

module.exports = logoutRouter