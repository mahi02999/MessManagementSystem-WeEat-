// backend/controllers/menuController.js
const db = require('../db/connection');

// Add or update menu for the mess
exports.addMenu = (req, res) => {
    const mess_id = req.session.mess_id;
    const { veg_meal_prices, non_veg_meal_prices, jain_meal_prices } = req.body;

    if (!mess_id) {
        return res.status(401).json({ message: 'Mess not authenticated' });
    }

    // First, get the mess_name using mess_id
    const getMessNameQuery = `SELECT mess_name FROM mess WHERE mess_id = ?`;
    db.query(getMessNameQuery, [mess_id], (err, results) => {
        if (err) {
            console.error('Error fetching mess name:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Mess not found' });
        }

        const mess_name = results[0].mess_name;

        // Check if a menu already exists for this mess
        const checkMenuQuery = `SELECT * FROM menu WHERE mess_id = ?`;
        db.query(checkMenuQuery, [mess_id], (err, menuResults) => {
            if (err) {
                console.error('Error checking menu existence:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (menuResults.length > 0) {
                // Menu exists, so update it
                const updateMenuQuery = `
                    UPDATE menu 
                    SET veg_meal_prices = ?, non_veg_meal_prices = ?, jain_meal_prices = ?
                    WHERE mess_id = ?
                `;
                db.query(updateMenuQuery, [veg_meal_prices, non_veg_meal_prices, jain_meal_prices, mess_id], (err) => {
                    if (err) {
                        console.error('Error updating menu item:', err);
                        return res.status(500).json({ message: 'Error updating menu item' });
                    }
                    res.status(200).json({ message: 'Menu item updated successfully!' });
                });
            } else {
                // No menu exists, so insert a new record
                const insertMenuQuery = `
                    INSERT INTO menu (mess_id, mess_name, veg_meal_prices, non_veg_meal_prices, jain_meal_prices)
                    VALUES (?, ?, ?, ?, ?)
                `;
                db.query(insertMenuQuery, [mess_id, mess_name, veg_meal_prices, non_veg_meal_prices, jain_meal_prices], (err) => {
                    if (err) {
                        console.error('Error inserting menu item:', err);
                        return res.status(500).json({ message: 'Error adding menu item' });
                    }
                    res.status(200).json({ message: 'Menu item added successfully!' });
                });
            }
        });
    });
};

// Get mess details
exports.getMessDetails = (req, res) => {
    const mess_id = req.session.mess_id;

    if (!mess_id) {
        return res.status(400).json({ message: 'Mess ID not found in session' });
    }

    const query = `SELECT mess_name FROM mess WHERE mess_id = ?`;
    db.query(query, [mess_id], (err, results) => {
        if (err) {
            console.error('Error fetching mess details:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            res.json({ mess_id, mess_name: results[0].mess_name });
        } else {
            res.status(404).json({ message: 'Mess not found' });
        }
    });
};
