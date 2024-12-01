const db = require('./database');
const { pool } = require('./database');


const getVerifiedAdmins = async () => {
    const [rows] = await pool.query(
        `   SELECT 
                CONCAT(ga.lastname, ', ', ga.firstname) AS gym_admin,
                p.amount,
                (SELECT plan_name FROM subscriptions WHERE subscription_id = p.subscription_id) AS Subscription,
                DATE_ADD(p.payment_date, INTERVAL 1 MONTH) AS Upcoming_Payment_Date,
                CASE
                    WHEN NOW() <= CASE 
                                    WHEN p.subscription_id = 1 THEN DATE_ADD(p.payment_date, INTERVAL 1 MONTH)
                                    WHEN p.subscription_id = 2 THEN DATE_ADD(p.payment_date, INTERVAL 3 MONTH)
                                    WHEN p.subscription_id = 3 THEN DATE_ADD(p.payment_date, INTERVAL 1 YEAR)
                                END
                    THEN 'Active'
                    WHEN p.payment_date > NOW() THEN 'Inactive'
                    ELSE 'Inactive'
                END AS membership_status
            FROM gym_admin ga
            JOIN gym_admin_payments p ON p.admin_id = ga.admin_id;
`,);

    return rows;
};
const getAdminTrainers = async (gym_id) => {
    const [rows] = await pool.query(
        `SELECT 
            t.gym_id, 
            p.trainer_id AS trainer_id, 
            CONCAT(t.firstname, ' ', t.lastname) AS Name, 
            MONTH(m.payment_date) AS month, 
            YEAR(m.payment_date) AS year, 
            SUM(m.amount) AS total_amount, 
            SUM(m.amount) * 0.10 AS gym_commission, -- 10% commission column
            COUNT(m.payment_id) AS member_count
        FROM 
            member_payments m
        LEFT JOIN 
            contracts_table c ON c.contract_id = m.contract_id
        LEFT JOIN 
            proposals p ON p.proposal_id = c.proposal_id
        LEFT JOIN 
            trainers t ON t.trainer_id = p.trainer_id
        WHERE 
            t.gym_id = ?
            AND MONTH(m.payment_date) = MONTH(CURRENT_DATE)
            AND YEAR(m.payment_date) = YEAR(CURRENT_DATE)
        GROUP BY 
            YEAR(m.payment_date), MONTH(m.payment_date)
        ORDER BY 
            year, month;
`, [gym_id]);

    return rows;
};
const getTrainerssz = async (gym_id) => {
    const [rows] = await pool.query(
        `SELECT trainer_id, CONCAT(lastname, ', ', firstname) AS trainer_name,
        experience,
        rates
        FROM trainers
    WHERE gym_id = ?
`, [gym_id]);

    return rows;
};
async function searchFilter(input) {
    const [result] = await pool.query(`
        SELECT * FROM members
        WHERE member_id LIKE ?;
    `, [`${input}%`]);

    return [result]
}

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
const getActiveCustomers = async (gym_id) => {
    const [rows] = await pool.query(
        `SELECT 
            gym_id,
            name, 
            membership_type, 
            amount_paid, 
            DATE(date_created) AS date_started, 
            DATE(DATE_ADD(date_created, INTERVAL 1 MONTH)) AS date_end,
            CASE 
                WHEN CURRENT_DATE > DATE(DATE_ADD(date_created, INTERVAL 1 MONTH)) THEN 'Expired'
                ELSE 'Active'
            END AS registration_status
        FROM 
            member_registrations
        WHERE 
            gym_id = ?
        AND
            membership_type = 'Monthly'`,
        [gym_id]);

    return rows;
};
const getPaymentsLog = async (gym_id) => {
    const [rows] = await pool.query(
        `SELECT 
			mp.payment_id,
            mp.gym_id,
            CONCAT(m.firstname, ', ', m.lastname) AS member_name, 
            CONCAT(t.firstname, ', ', t.lastname) AS trainer_name, 
            mp.payment_method,
            amount, 
            DATE_FORMAT(mp.payment_date, '%M %d, %Y') AS formatted_payment_date,
            mp.payment_status
        FROM member_payments mp
        JOIN trainers t ON t.trainer_id = mp.trainer_id
        JOIN members m ON mp.member_id = m.member_id
        WHERE mp.gym_id = ?
        `,
        [gym_id]);

    return rows;
};
const getTrainersMembers = async (trainer_id) => {
    const [rows] = await pool.query(
        `SELECT CONCAT(m.firstname, ' ', m.lastname) AS member_name, 
            tc.plan_type,
            DATE_FORMAT(tc.start_date, '%M %d, %Y') AS start_date,
            DATE_FORMAT(DATE_ADD(tc.start_date, INTERVAL 1 MONTH), '%M %d, %Y') AS end_date
        FROM trainer_clients tc
        JOIN members m ON m.member_id = tc.member_id
        WHERE tc.trainer_id = ?;
        `,
        [trainer_id]);

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
async function insertTrainerClient(gym_id,trainer_id,member_id,plan_type) {
    const result = await pool.query(`
    INSERT INTO trainer_clients (gym_id,trainer_id,member_id,plan_type) 
    VALUES (?,?,?,?)
    `, [gym_id,trainer_id,member_id,plan_type])

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
    getTrainersMembers,
    insertTrainerClient,
    searchFilter,
    getTrainerssz,
    getAdminTrainers,
    getSalesById,
    getAdminGyms,
    insertMemberRegistration,
    insertPlan,
    getVerifiedAdmins,
    AddTrainerProfile,
    getActiveCustomers,
    getPaymentsLog
};
