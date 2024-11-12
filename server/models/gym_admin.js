const db = require('./database');
const { pool } = require('./database');


const getVerifiedAdmins = async () => {
    const [rows] = await pool.query(
        `   SELECT 
            CONCAT(ga.lastname, ', ', ga.firstname) AS gym_admin,
            g.gym_name,
            g.street_address,
            (SELECT plan_name FROM subscriptions WHERE subscription_id = p.subscription_id) AS Subscription,
            CASE 
                WHEN p.subscription_id = 1 THEN DATE_ADD(p.payment_date, INTERVAL 1 MONTH)
                WHEN p.subscription_id = 2 THEN DATE_ADD(p.payment_date, INTERVAL 3 MONTH)
                WHEN p.subscription_id = 3 THEN DATE_ADD(p.payment_date, INTERVAL 1 YEAR)
            END AS Upcoming_Payment_Date,
            p.subscription_id,
            CASE
                WHEN NOW() <= CASE 
                                WHEN p.subscription_id = 1 THEN DATE_ADD(p.payment_date, INTERVAL 1 MONTH)
                                WHEN p.subscription_id = 2 THEN DATE_ADD(p.payment_date, INTERVAL 3 MONTH)
                                WHEN p.subscription_id = 3 THEN DATE_ADD(p.payment_date, INTERVAL 1 YEAR)
                            END 
                THEN 'Active'
                ELSE 'Inactive'
            END AS membership_status
        FROM gym_admin ga
        JOIN gyms g ON ga.admin_id = g.admin_id
        JOIN payments_table p ON p.gym_id = g.gym_id;
`,);

    return rows;
};
const getAdminGyms = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM gyms WHERE admin_id = ?`,
        [id]);

    return rows;
};
const getSalesById = async (gym_id) => {
    const [rows] = await pool.query(
        `   SELECT 
            gym_id,
            COUNT(name) as members_registered,
            YEAR(date_created) AS year,
            MONTH(date_created) AS month,
            SUM(amount_paid) AS total_amount_paid
        FROM 
            member_registrations
        WHERE
            gym_id = ?
        GROUP BY 
            gym_id,
            YEAR(date_created),
            MONTH(date_created)
        ORDER BY 
            year DESC, month DESC;
    `,
        [gym_id]);

    return rows;
};


async function AddTrainerProfile(trainer_id, filename) {
    const result = await pool.query(`
    INSERT INTO trainer_images (trainer_id, filename) 
    VALUES (?, ?)
    `, [trainer_id, filename])

    return result
}
async function insertPlan(planName, price, intervalUnit, Description) {
    const result = await pool.query(`
    INSERT INTO subscriptions (plan_name,price,duration_months,description) 
    VALUES (?,?,?,?)
    `, [planName, price, intervalUnit, Description])

    return result
}
async function insertMemberRegistration(gym_id, name, membership_type, amount_paid) {
    const result = await pool.query(`
    INSERT INTO member_registrations (gym_id, name,membership_type,amount_paid) 
    VALUES (?,?,?,?)
    `, [gym_id, name, membership_type, amount_paid])

    return result
}


module.exports = {
    getSalesById,
    getAdminGyms,
    insertMemberRegistration,
    insertPlan,
    getVerifiedAdmins,
    AddTrainerProfile
};
