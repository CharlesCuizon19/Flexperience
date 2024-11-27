const db = require('./database');
const { pool } = require('./database');

async function insertClientPayment(contract_id, amount) {
    const [result] = await pool.query(`
        INSERT INTO member_payments (contract_id, amount) 
        VALUES (?,?)
        `, [contract_id, amount]);

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




module.exports = {
    insertClientPayment,
    insertGymAdminPayment
};
