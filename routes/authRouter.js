const express = require('express');
const authRouter = express.Router();
const path = require('path');
const { handleLogin } = require('../controllers/authcontroller'); 

// Login endpoint
authRouter.post('/', handleLogin);

// Static file serving
authRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', 'index.html'), {
        headers: {
            'Cache-Control': 'no-store' 
        }
    });
});

authRouter.get('/404', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', '404.html'));
});

module.exports = authRouter; 