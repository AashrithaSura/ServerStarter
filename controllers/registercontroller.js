const usersDB = {
    users: require("../models/users.json"),
    setUsers: function(data) { this.users = data }
};

const path = require('path');
const fsPromises = require('fs').promises;
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({"message": "username and password are required"});
    }

    const duplicate = usersDB.users.find(user => user.username === username);
    if (duplicate) {
        return res.status(409).json({"message": "username already exists"});
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            password: hashedPassword,
            roles:{ "User": 2004}
        };

        // Update the usersDB object
        usersDB.setUsers([...usersDB.users, newUser]);
        console.log(newUser);
        
        // Write to file
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        
        res.status(201).json({"message": "new user created"});
    } catch (err) {
        console.error(err);
        res.status(500).json({"message": err.message});
    }
};

module.exports = { handleNewUser };