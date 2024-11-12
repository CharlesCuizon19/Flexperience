const db = require('./database');
const { pool } = require('./database');

const getNotifications = async (member_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM notifications WHERE member_id = ? ORDER BY created_at DESC',
        [member_id]
    );
    return rows.length > 0 ? [rows] : null;
};
const getPlan = async (member_id) => {
    const [rows] = await pool.query(
        'SELECT plan_id, trainer_id FROM member_workout_plan WHERE member_id = ?',
        [member_id]
    );
    return rows.length > 0 ? rows : null;
};
const getMealPlanId = async (member_id) => {
    const [rows] = await pool.query(
        'SELECT plan_id, trainer_id FROM member_meal_plan WHERE member_id = ?',
        [member_id]
    );
    return rows.length > 0 ? rows : null;
};
const getProposals = async (member_id, proposal_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM proposals WHERE member_id = ? AND proposal_id = ?',
        [member_id, proposal_id]
    );
    return rows.length > 0 ? [rows] : null;
};
const getWorkoutByDay = async (member_id, date) => {
    const [rows] = await pool.query(
        `SELECT *
            FROM (
                SELECT 
                    m.plan_id, 
                    (SELECT firstname FROM members WHERE member_id = m.member_id) AS name,
                    m.trainer_id, 
                    m.member_id, 
                    m.template_id, 
                    t.exercise_name,
                    t.repetitions,
    	            t.sets,
    	            t.target_muscle_group, 
                    DATE(m.date_started) AS date_started, 
                    t.week_no, 
                    t.day_no,
                    DATE_ADD(DATE(m.date_started), INTERVAL ((t.week_no - 1) * 7 + (t.day_no - 1)) DAY) AS workout_date
                FROM 
                    member_workout_plan m
                LEFT JOIN 
                    template_exercises t ON t.template_id = m.template_id
                WHERE 
                    m.member_id = ?
            ) AS workout_plans
            WHERE 
                workout_date = ?;
            `,
        [member_id, date]
    );
    return rows.length > 0 ? [rows] : null;
};

const getWorkoutoftheDay = async (member_id, plan_id) => {
    const [rows] = await pool.query(
        `WITH CTE_CURRENT_DAY AS (
        SELECT 
            m.member_id,
            template_id,
            m.date_started,
            CASE 
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 1 AND DATEDIFF(CURRENT_DATE, m.date_started) < 7 THEN 1
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 7 AND DATEDIFF(CURRENT_DATE, m.date_started) < 14 THEN 2
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 14 AND DATEDIFF(CURRENT_DATE, m.date_started) < 21 THEN 3
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 21 AND DATEDIFF(CURRENT_DATE, m.date_started) < 28 THEN 4
                ELSE 0
            END AS Week_Number,
            -- Reset Day_number to always be between 1 and 7
            MOD(DATEDIFF(CURRENT_DATE, m.date_started), 7) + 1 AS Day_number
        FROM 
            member_workout_plan m
    	WHERE m.member_id = ?
        ),
        CTE_WORKOUT AS (
            SELECT 
                me.member_id,
                (SELECT CONCAT(lastname, ', ', firstname) FROM members WHERE member_id = me.member_id) AS member_name,
                mes.status_id,
                mes.plan_id,
                wte.exercise_id,
                wte.exercise_name,
                wte.repetitions,
                wte.sets,
            	wte.target_muscle_group,
            	wte.secondaryMuscles,
                wte.week_no,
                wte.day_no,
                mes.status,
                me.date_started,
                mes.updated_at,
            	c.Week_Number,
            	c.Day_number
            FROM 
                member_workout_plan_status mes
            JOIN 
                template_exercises wte ON mes.template_exercise_id = wte.template_exercise_id
            JOIN 
                member_workout_plan me ON me.plan_id = mes.plan_id
            JOIN 
                CTE_CURRENT_DAY c ON c.template_id = wte.template_id	
            WHERE 
                mes.plan_id = ?
            AND 
                c.Day_number = wte.day_no
            AND
                c.Week_Number = wte.week_no
        )
        SELECT * FROM CTE_WORKOUT;
        `,
        [member_id, plan_id]
    );
    return rows.length > 0 ? [rows] : null;
};
const getMealoftheDay = async (member_id, plan_id) => {
    const [rows] = await pool.query(
        `WITH CTE_CURRENT_DAY AS (
        SELECT 
            m.member_id,
            meal_template_id,
            m.date_started,
            CASE 
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 1 AND DATEDIFF(CURRENT_DATE, m.date_started) < 7 THEN 1
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 7 AND DATEDIFF(CURRENT_DATE, m.date_started) < 14 THEN 2
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 14 AND DATEDIFF(CURRENT_DATE, m.date_started) < 21 THEN 3
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 21 AND DATEDIFF(CURRENT_DATE, m.date_started) < 28 THEN 4
                ELSE 0
            END AS Week_Number,
            -- Reset Day_number to always be between 1 and 7
            MOD(DATEDIFF(CURRENT_DATE, m.date_started), 7) + 1 AS Day_number
        FROM 
            member_meal_plan m
    	WHERE m.member_id = ?
        ),
        CTE_MEAL AS (
            SELECT 
                me.member_id,
                (SELECT CONCAT(lastname, ', ', firstname) FROM members WHERE member_id = me.member_id) AS member_name,
                mes.status_id,
                mes.plan_id,
                wte.template_item_id,
                pm.filename,
                p.meal_name,
                p.calories,
                p.carbs,
                p.fats,
            	p.protein,
                wte.classification,
                wte.week_no,
                wte.day_no,
                mes.status,
                me.date_started,
                mes.updated_at,
            	c.Week_Number,
            	c.Day_number
            FROM 
                member_meal_status mes
            JOIN 
                meal_template_items wte ON mes.template_item_id = wte.template_item_id
            JOIN 
                member_meal_plan me ON me.plan_id = mes.plan_id
            JOIN 
                CTE_CURRENT_DAY c ON c.meal_template_id = wte.meal_template_id
			JOIN
				pre_made_meals p ON p.pre_made_meal_id = wte.pre_made_meal_id
            JOIN 
                pre_made_meal_images pm ON pm.pre_made_meal_id = p.pre_made_meal_id	
            WHERE 
                mes.plan_id = ?
            AND 
                c.Day_number = wte.day_no
            AND
                c.Week_Number = wte.week_no
        )
        SELECT * FROM CTE_MEAL
        ORDER BY status_id;
        `,
        [member_id, plan_id]
    );
    return rows.length > 0 ? [rows] : null;
};
const getMealoftheWeek = async (member_id, plan_id) => {
    const [rows] = await pool.query(
        `WITH CTE_CURRENT_DAY AS (
            SELECT 
                m.member_id,
                meal_template_id,
                m.date_started,
                CASE 
                    WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 1 AND DATEDIFF(CURRENT_DATE, m.date_started) < 7 THEN 1
                    WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 7 AND DATEDIFF(CURRENT_DATE, m.date_started) < 14 THEN 2
                    WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 14 AND DATEDIFF(CURRENT_DATE, m.date_started) < 21 THEN 3
                    WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 21 AND DATEDIFF(CURRENT_DATE, m.date_started) < 28 THEN 4
                    ELSE 0
                END AS Week_Number,
                MOD(DATEDIFF(CURRENT_DATE, m.date_started), 7) + 1 AS Day_number
            FROM 
                member_meal_plan m
            WHERE m.member_id = ?
        ),
        CTE_MEAL AS (
            SELECT 
                me.member_id,
                (SELECT CONCAT(lastname, ', ', firstname) FROM members WHERE member_id = me.member_id) AS member_name,
                mes.status_id,
                mes.plan_id,
                wte.template_item_id,
                pm.filename,
                p.meal_name,
                p.carbs,
                p.fats,
                p.protein,
                p.ingredients,
                wte.classification,
                wte.week_no,
                wte.day_no,
                DATE(DATE_ADD(me.date_started, INTERVAL ((wte.week_no - 1) * 7 + (wte.day_no - 1)) DAY)) AS meal_date,
                
                -- Group steps into an array
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'step_number', ms.step_number,
                        'instruction', ms.instruction
                    )
                ) AS steps

            FROM 
                member_meal_status mes
            JOIN 
                meal_template_items wte ON mes.template_item_id = wte.template_item_id
            JOIN 
                member_meal_plan me ON me.plan_id = mes.plan_id
            JOIN 
                CTE_CURRENT_DAY c ON c.meal_template_id = wte.meal_template_id
            JOIN
                pre_made_meals p ON p.pre_made_meal_id = wte.pre_made_meal_id
            JOIN 
                meal_item_steps ms ON ms.pre_made_meal_id = p.pre_made_meal_id
            JOIN 
                pre_made_meal_images pm ON pm.pre_made_meal_id = p.pre_made_meal_id
            WHERE 
                mes.plan_id = ?
            AND
                c.Week_Number = wte.week_no
            GROUP BY 
                me.member_id, mes.status_id, mes.plan_id, wte.template_item_id, pm.filename,
                p.meal_name, p.carbs, p.fats, p.protein, p.ingredients, wte.classification,
                wte.week_no, wte.day_no, meal_date
        )
        SELECT * 
        FROM CTE_MEAL
        ORDER BY week_no, day_no, status_id;
        `,
        [member_id, plan_id]
    );
    return rows.length > 0 ? [rows] : null;
};
const retrieveMealOfTheDay = async (member_id, plan_id) => {
    const [rows] = await pool.query(
        `WITH CTE_CURRENT_DAY AS (
        SELECT 
            m.member_id,
            m.meal_template_id,
            m.date_started,
            CASE 
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 1 AND DATEDIFF(CURRENT_DATE, m.date_started) < 7 THEN 1
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 7 AND DATEDIFF(CURRENT_DATE, m.date_started) < 14 THEN 2
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 14 AND DATEDIFF(CURRENT_DATE, m.date_started) < 21 THEN 3
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 21 AND DATEDIFF(CURRENT_DATE, m.date_started) < 28 THEN 4
                ELSE 0
            END AS Week_Number,
            MOD(DATEDIFF(CURRENT_DATE, m.date_started), 7) + 1 AS Day_number
        FROM 
            member_meal_plan m
        WHERE m.member_id = ?
    ),
    CTE_MEAL AS (
        SELECT 
            me.member_id,
            (SELECT CONCAT(lastname, ', ', firstname) FROM members WHERE member_id = me.member_id) AS member_name,
            mes.status_id,
            mes.plan_id,
            wte.template_item_id,
       		pm.filename,
            p.meal_name,
            p.carbs,
            p.fats,
            p.protein,
            p.ingredients,
            ms.step_number,
            ms.instruction,
            wte.classification
        FROM 
            member_meal_status mes
        JOIN 
            meal_template_items wte ON mes.template_item_id = wte.template_item_id
        JOIN 
            member_meal_plan me ON me.plan_id = mes.plan_id
        JOIN 
            CTE_CURRENT_DAY c ON c.meal_template_id = wte.meal_template_id
        JOIN 
            pre_made_meals p ON p.pre_made_meal_id = wte.pre_made_meal_id
        JOIN 
            meal_item_steps ms ON ms.pre_made_meal_id = p.pre_made_meal_id
        JOIN 
        	pre_made_meal_images pm ON pm.pre_made_meal_id = p.pre_made_meal_id
        WHERE 
            mes.plan_id = ?
        AND 
            c.Day_number = wte.day_no
        AND 
            c.Week_Number = wte.week_no
    )
    SELECT * 
    FROM CTE_MEAL
    ORDER BY template_item_id, step_number;
        `,
        [member_id, plan_id]
    );
    return rows.length > 0 ? [rows] : null;
};

const insertContract = async (proposal_id, weeks, status) => {
    const [response] = await pool.query(
        `INSERT INTO contracts_table (proposal_id, start_date, end_date, status) 
         VALUES (?, NOW(), DATE_ADD(NOW(), INTERVAL ${weeks} WEEK), ?);`,
        [proposal_id, status]
    );
    return response.insertId;  // This will return the auto-incremented ID
};
const insertActivity = async (member_id, trainer_id, message) => {
    const [response] = await pool.query(
        `INSERT INTO student_activity (member_id, trainer_id, message) 
         VALUES (?,?,?);`,
        [member_id, trainer_id, message]
    );
    return response.insertId;  // This will return the auto-incremented ID
};

const updateExerciseStatus = async (status, status_id) => {
    const [rows] = await pool.query(
        'UPDATE member_workout_plan_status SET status = ? WHERE status_id = ?;',
        [status, status_id]
    );
    return rows.length > 0 ? rows : null;
};
const updateMealStatus = async (status, status_id) => {
    const [rows] = await pool.query(
        'UPDATE member_meal_status SET status = ? WHERE status_id = ?;',
        [status, status_id]
    );
    return rows.length > 0 ? rows : null;
};


module.exports = {
    updateMealStatus,
    getMealoftheWeek,
    retrieveMealOfTheDay,
    getWorkoutByDay,
    insertActivity,
    updateExerciseStatus,
    getPlan,
    getMealPlanId,
    getWorkoutoftheDay,
    getMealoftheDay,
    getNotifications,
    getProposals,
    insertContract
};
