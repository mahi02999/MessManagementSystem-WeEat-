const connection = require('../db/connection'); // Import your DB connection
const bcrypt = require('bcrypt'); // Require bcrypt for hashing and verifying passwords

// Controller to register a student
exports.registerStudent = (req, res) => {
    const { stud_name, email, password_stud, phone_no } = req.body;

    if (!stud_name || !email || !password_stud || !phone_no) {
        return res.status(400).send('All fields are required');
    }

    // Hash the password before storing it
    bcrypt.hash(password_stud, 10, (err, hashedPassword) => {
        if (err) return res.status(500).send('Server error');

        const query = `INSERT INTO student (stud_name, email, password_stud, phone_no) VALUES (?, ?, ?, ?)`;
        connection.query(query, [stud_name, email, hashedPassword, phone_no], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Student name or email already exists');
                }
                return res.status(500).send('Database error');
            }
            res.redirect('/studentLogin.html');
        });
    });
};

// Controller to login a student
exports.loginStudent = (req, res) => {
    const { stud_name, password_stud } = req.body;

    if (!stud_name || !password_stud) {
        return res.status(400).send('All fields are required');
    }

    const query = `SELECT * FROM student WHERE stud_name = ?`;
    connection.query(query, [stud_name], (err, results) => {
        if (err) {
            return res.status(500).send('Database error');
        }
        if (results.length === 0) {
            return res.status(400).send('Student not found');
        }

        const student = results[0];
        bcrypt.compare(password_stud, student.password_stud, (err, isMatch) => {
            if (err) {
                return res.status(500).send('Server error');
            }
            if (!isMatch) {
                return res.status(400).send('Invalid password');
            }
            
            // Set the stud_id in the session
            req.session.stud_id = student.stud_id;
            console.log("Student ID set in session:", req.session.stud_id);

            res.redirect('/display.html');
        });
    });
};
