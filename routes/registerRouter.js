const express = require('express');
const registerRouter = express.Router();
const path=require('path');

const registerController = require('../controllers/registercontroller');


registerRouter.post('/', registerController.handleNewUser);
module.exports = registerRouter;



