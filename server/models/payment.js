const db = require('./database');
const { pool } = require('./database');

async function insertClientPayment(paymentId) {
    const [result] = await pool.query(`
        UPDATE member_payments
        SET payment_status = 'Transferred'
        WHERE payment_id = ?;

        `, [paymentId]);

    console.log("DB Query Result:", result); // Log result here
    return result; // Return only the result object
}
async function insertGymAdminPayment(paymentData) {
    try {
        const { admin_id, subscription_id, amount, isRenewal, daysRemaining } = paymentData; // Destructure the object
        console.log("RENEWAL VALUE: " + isRenewal)

        let query;
        let values;

        if (isRenewal == "true") {
            console.log("------ is renewal true")
            // Update existing payment record for renewal
            query = `
                UPDATE gym_admin_payments 
                SET subscription_id = ?, amount = ?, payment_date = DATE_ADD(NOW(), INTERVAL ? DAY)
                WHERE admin_id = ?
            `;
            values = [subscription_id, amount, daysRemaining, admin_id];
        } else {
            console.log("------ is renewal false")
            // Insert new payment record for the first-time subscription
            query = `
                INSERT INTO gym_admin_payments (admin_id, subscription_id, amount) 
                VALUES (?, ?, ?)
            `;
            values = [admin_id, subscription_id, amount];
        }

        const [result] = await pool.query(query, values);

        console.log("DB Query Result:", result); // Log result here
        return result;
    } catch (error) {
        console.error("Error managing gym admin payment:", error);
        throw error; // Re-throw the error so it can be handled by the calling code
    }
}
async function insertclientToGymAdminPayment(paymentData) {
    try {
        const { member_id, gym_id, trainer_id, payment_method, amount } = paymentData; // Destructure the object

        let query;
        let values;

        console.log("------ is renewal false")
        // Insert new payment record for the first-time subscription
        query = `
                INSERT INTO member_payments (member_id, gym_id, trainer_id, payment_method, amount) 
                VALUES (?,?,?,?,?)
            `;
        values = [member_id, gym_id, trainer_id, payment_method, amount];


        const [result] = await pool.query(query, values);

        console.log("DB Query Result:", result); // Log result here
        return result;
    } catch (error) {
        console.error("Error managing client payment:", error);
        throw error; // Re-throw the error so it can be handled by the calling code
    }
}




module.exports = {
    insertClientPayment,
    insertGymAdminPayment,
    insertclientToGymAdminPayment
};
