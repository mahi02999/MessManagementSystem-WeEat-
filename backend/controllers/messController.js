const connection = require('../db/connection'); // Import your DB connection
const bcrypt = require('bcrypt');

exports.registerMess = (req, res) => {
    console.log(req.body); // Log the incoming request body
    const { mess_name, location, contact_no, password } = req.body;

    if (!mess_name || !location || !contact_no || !password) {
        return res.status(400).send('All fields are required');
    }

    // Hash the password before storing it
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).send('Server error');

        const query = `INSERT INTO mess (mess_name, location, contact_no, password) VALUES (?, ?, ?, ?)`;
        connection.query(query, [mess_name, location, contact_no, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Mess name already exists');
                }
                return res.status(500).send('Database error');
            }
            res.redirect('/messLogin.html');
        });
    });
};
exports.loginMess = (req, res) => {
    console.log(req.body);
    const { mess_name, password } = req.body;

    if (!mess_name || !password) {
        return res.status(400).send('All fields are required');
    }

    const query = `SELECT * FROM mess WHERE mess_name = ?`;
    connection.query(query, [mess_name], (err, results) => {
        if (err) {
            return res.status(500).send('Database error');
        }
        if (results.length === 0) {
            return res.status(400).send('Mess not found');
        }

        const mess = results[0];
        bcrypt.compare(password, mess.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send('Server error');
            }
            if (!isMatch) {
                return res.status(400).send('Invalid password');
            }

            // Store mess_id and mess_name in session
            req.session.mess_id = mess.mess_id;
            req.session.mess_name = mess.mess_name;

            res.redirect('/addMenu.html');
        });
    });
};


