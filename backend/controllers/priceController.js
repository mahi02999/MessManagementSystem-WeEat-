const db = require('../db/connection');

exports.calculatePrice = (req, res) => {
    const { stud_id } = req.params;

    const query = `
        SELECT s.sub_duration, s.sub_plan, 
               CASE s.sub_plan
                   WHEN 'veg meal' THEN m.veg_meal_prices
                   WHEN 'nonveg meal' THEN m.non_veg_meal_prices
                   WHEN 'jain meal' THEN m.jain_meal_prices
               END AS meal_price
        FROM subscription s
        JOIN menu m ON s.mess_id = m.mess_id
        WHERE s.stud_id = ?
    `;

    db.query(query, [stud_id], (error, results) => {
        if (error) {
            console.error('Error calculating price:', error);
            return res.status(500).json({ message: 'Error calculating price' });
        }

        if (results.length > 0) {
            const { sub_duration, meal_price } = results[0];

            console.log('sub_duration:', sub_duration);
            console.log('meal_price:', meal_price);

            if (sub_duration && meal_price) {
                const total_price = sub_duration * meal_price;
                console.log('total_price:', total_price);
                res.json({ total_price });
            } else {
                console.error('Invalid subscription data: missing sub_duration or meal_price');
                res.status(500).json({ message: 'Invalid subscription data' });
            }
        } else {
            res.status(404).json({ message: 'Subscription not found' });
        }
    });
};
