// backend/controllers/displayController.js
const db = require('../db/connection');

exports.getMenu = (req, res) => {
    const query = `
        SELECT m.mess_name, menu.veg_meal_prices, menu.non_veg_meal_prices, menu.jain_meal_prices
        FROM menu
        JOIN mess m ON menu.mess_id = m.mess_id
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching menu data:', error);
            return res.status(500).json({ message: 'Error fetching menu data' });
        }
        res.json(results);
    });
};
