const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database('./users.db'); // SQLite database file

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle registration form submission
app.post("/register", (req, res) => {
    const { uname1, email, upswd1, upswd2 } = req.body;

    // Basic validation
    if (upswd1 !== upswd2) {
        return res.send("Passwords do not match.");
    }

    // Insert data into the SQLite database
    const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    stmt.run([uname1, email, upswd1], (err) => {
        if (err) {
            return res.status(500).send("Error inserting data.");
        }
        res.send("Registration successful!");
    });
});

// Serve your static HTML files (if needed)
app.use(express.static('public'));

// Create the database schema if it doesn't exist (users table)
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)");
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
