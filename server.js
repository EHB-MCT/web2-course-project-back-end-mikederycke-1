const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API docs/home page at root without exposing other files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(cors());

// Helper function to read users from JSON file
async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
}

// Helper function to write users to JSON file
async function writeUsers(users) {
    try {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing users file:', error);
        return false;
    }
}

// GET route - Get all users or a specific user by ID
app.get('/users', async (req, res) => {
    try {
        const users = await readUsers();
        const { id } = req.query;

        if (id) {
            const user = users.find(u => u.id === id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Remove password from response
            // const { password, ...userWithoutPassword } = user;
            // return res.json(userWithoutPassword);
            //ONly for demo purposes, return password as well
            return res.json(user);
        }

        // Return all users without passwords
        // const usersWithoutPasswords = users.map(({ password, ...user }) => user);
        // res.json(usersWithoutPasswords);
        //ONly for demo purposes, return password as well
        res.json(users);

    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

// POST route - Create a new user
app.post('/users', async (req, res) => {
    try {
        const { name, email, password, profilePictureUrl } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const users = await readUsers();

        // Check if email already exists
        if (users.some(u => u.email === email)) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            profilePictureUrl: profilePictureUrl || ''
        };

        users.push(newUser);
        await writeUsers(users);

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// PUT route - Update an existing user
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, profilePictureUrl } = req.body;

        const users = await readUsers();
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if new email conflicts with another user
        if (email && users.some((u, index) => u.email === email && index !== userIndex)) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Update user fields
        if (name) users[userIndex].name = name;
        if (email) users[userIndex].email = email;
        if (password) {
            users[userIndex].password = await bcrypt.hash(password, 10);
        }
        if (profilePictureUrl !== undefined) {
            users[userIndex].profilePictureUrl = profilePictureUrl;
        }

        await writeUsers(users);

        // Return updated user without password
        const { password: _, ...userWithoutPassword } = users[userIndex];
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE route - Delete a user
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const users = await readUsers();
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const deletedUser = users[userIndex];
        users.splice(userIndex, 1);
        await writeUsers(users);

        // Return deleted user without password
        const { password: _, ...userWithoutPassword } = deletedUser;
        res.json({ message: 'User deleted successfully', user: userWithoutPassword });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET    /users       - Get all users');
    console.log('  GET    /users?id=X  - Get user by ID');
    console.log('  POST   /users       - Create new user');
    console.log('  PUT    /users/:id   - Update user');
    console.log('  DELETE /users/:id   - Delete user');
    console.log('Proces environment variables test:');
    console.log(`  MONGO_URI: ${process.env.MONGO_URI}`);

});