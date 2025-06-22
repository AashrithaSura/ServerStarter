const express = require('express');
const refreshRouter = express.Router();
const path = require('path')
const refreshController = require('../controllers/refreshController');
refreshRouter.get('/', refreshController.handleRefreshToken);

module.exports = refreshRouter;