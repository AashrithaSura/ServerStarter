const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Initialize users database
const usersDB = {
    users: require("../models/users.json"),
    setUsers: async function(data) {
        this.users = data;
        try {
            await fsPromises.writeFile(
                path.join(__dirname, '..', 'models', 'users.json'),
                JSON.stringify(this.users, null, 2)
            );
            console.log('Users database updated successfully');
        } catch (err) {
            console.error('Error saving users:', err);
            throw err;
        }
    }
};

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Find user
        const foundUser = usersDB.users.find(user => user.username === username);
        if (!foundUser) return res.sendStatus(401); // Unauthorized

        // Verify password
        const roles = Object.values(foundUser.roles)
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) return res.sendStatus(401);

        // Create tokens
        const accessToken = jwt.sign(
            { 
                "UserInfo":{
                    'username':foundUser.username,
                    'roles':roles
                }
             },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '120s'}
        );
        
        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Update user with refresh token
        const updatedUsers = usersDB.users.map(user => 
            user.username === username 
                ? { ...user, refreshToken }
                : user
        );

        // Save to database
        await usersDB.setUsers(updatedUsers);
        console.log('Refresh token saved for user:', username);

        // Set cookie and return response
        res.cookie('jwt', refreshToken, { 
            httpOnly: true,sameSite:'none',secure:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000 
        });
        
        res.json({ 
            accessToken,
            username: foundUser.username
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { handleLogin };
