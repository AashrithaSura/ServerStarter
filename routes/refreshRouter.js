const express = require('express');
const refreshRouter = express.Router();
const path = require('path')
const refreshController = require('../controllers/refreshcontroller');
refreshRouter.get('/', refreshController.handleRefreshToken);

module.exports = refreshRouter;