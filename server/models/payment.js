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
async function insertGymAdminPayment(admin_id, subscription_id, amount) {
    const [result] = await pool.query(`
        INSERT INTO gym_admin_payments (admin_id, subscription_id, amount) 
        VALUES (?,?,?)
        `, [admin_id, subscription_id, amount]);

    console.log("DB Query Result:", result); // Log result here
    return result; // Return only the result object
}


module.exports = {
    insertClientPayment,
    insertGymAdminPayment
};
