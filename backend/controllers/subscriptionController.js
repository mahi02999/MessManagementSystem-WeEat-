const db = require('../db/connection');

exports.addSubscription = (req, res) => {
    const { mess_name, sub_plan, sub_duration } = req.body;
    const stud_id = req.session.stud_id;

    console.log("Student ID from session:", stud_id);
    console.log("Mess Name:", mess_name);
    console.log("Subscription Plan:", sub_plan);
    console.log("Subscription Duration:", sub_duration);

    // Check if `stud_id`, `mess_name`, and `sub_duration` are present
    if (!stud_id || !mess_name || !sub_duration) {
        return res.status(400).json({ message: 'Student ID, Mess Name, or Subscription Duration is missing' });
    }

    // Get mess_id from mess_name
    const getMessIdQuery = 'SELECT mess_id FROM mess WHERE mess_name = ?';
    db.query(getMessIdQuery, [mess_name], (err, results) => {
        if (err) {
            console.error('Database error fetching mess ID:', err);
            return res.status(500).json({ message: 'Database error fetching mess ID' });
        }

        if (results.length === 0) {
            console.error('No mess found with the given mess_name:', mess_name);
            return res.status(404).json({ message: 'Mess not found with the provided name' });
        }

        const mess_id = results[0].mess_id;

        // Map sub_plan to the corresponding column in `menu` table
        const mealPriceColumn = {
            "veg meal": "veg_meal_prices",
            "nonveg meal": "non_veg_meal_prices",
            "jain meal": "jain_meal_prices"
        }[sub_plan];

        if (!mealPriceColumn) {
            return res.status(400).json({ message: 'Invalid subscription plan selected' });
        }

        // Fetch meal price based on selected sub_plan and mess_id
        const getMealPriceQuery = `SELECT ${mealPriceColumn} AS meal_price FROM menu WHERE mess_id = ?`;
        db.query(getMealPriceQuery, [mess_id], (err, priceResults) => {
            if (err) {
                console.error('Database error fetching meal price:', err);
                return res.status(500).json({ message: 'Database error fetching meal price' });
            }

            if (priceResults.length === 0) {
                console.error('No meal price found for the selected plan and mess');
                return res.status(404).json({ message: 'Meal price not found' });
            }

            const meal_price = priceResults[0].meal_price;
            const total_price = meal_price * sub_duration;

            console.log("Meal Price:", meal_price);
            console.log("Total Price:", total_price);

            // Insert subscription details into the subscription table
            const insertSubscriptionQuery = `
                INSERT INTO subscription (stud_id, mess_id, sub_plan, sub_duration, total_price)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(insertSubscriptionQuery, [stud_id, mess_id, sub_plan, sub_duration, total_price], (err, result) => {
                if (err) {
                    console.error('Error inserting subscription:', err);
                    return res.status(500).json({ message: 'Error adding subscription' });
                }

                res.status(200).json({ stud_id, total_price });
            });
        });
    });
};
