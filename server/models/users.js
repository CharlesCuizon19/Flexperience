const db = require('./database');
const { pool } = require('./database');

const createUser = async ({ username, password, usertype, email }) => {
    return db.query(
        'INSERT INTO user_accounts (username, password, user_type, email) VALUES (?,?,?, ?)',
        [username, password, usertype, email]
    );
};
const createGymAdmin = async ({ firstname, lastname, email }) => {
    return db.query(
        'INSERT INTO gym_admin (account_id,firstname, lastname, email) VALUES((SELECT account_id FROM user_accounts ORDER BY account_id desc LIMIT 1),?,?,?)',
        [firstname, lastname, email]
    );
};
const createMember = async ({ firstname, lastname, weight, bodytype, }) => {
    return db.query(
        'INSERT INTO members (account_id,firstname, lastname, weight, bodytype) VALUES((SELECT account_id FROM user_accounts ORDER BY account_id desc LIMIT 1),?,?,?,?)',
        [firstname, lastname, weight, bodytype]
    );
};
// Find one user by username
const findOne = async ({ username }) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM user_accounts WHERE username = ? LIMIT 1',
            [username]
        );
        // Since rows is an array, return the first element or null if no result found
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error querying database:", error.message);
        throw error;
    }
};

const getUserinfo = async ({ account_id }) => {
    const [rows] = await db.query(
        'SELECT * FROM gym_admin WHERE account_id = ? LIMIT 1',
        [account_id]
    );
    return rows[0]; // Return the first row (or undefined if no user was found)
};
const activateUser = async (userId) => {
    try {
        console.log("account id: " + userId)
        const result = await db.query(
            'UPDATE user_accounts SET emailVerified = ? WHERE account_id = ?',
            [true, userId]
        );
        
        // Log the result to see its structure
        console.log("Result from DB query:", result);

        // Check if any rows were affected and return accordingly
        return result[0]?.affectedRows > 0;  // Use optional chaining to avoid errors if result[0] is undefined
    } catch (error) {
        console.error("Error activating user email:", error.message);
        throw error;
    }
};


const findByEmail = async (email) => {
    try {
        console.log("received email: " + email)
        const [rows] = await pool.query(
            'SELECT * FROM user_accounts WHERE email = ? LIMIT 1',
            [email]
        );
        // Return the user if found, otherwise return null
        console.log(rows)
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error querying database:", error.message);
        throw error;
    }
};

module.exports = {
    findByEmail,
    activateUser,
    createUser,
    createGymAdmin,
    findOne,
    getUserinfo,
    createMember
};
