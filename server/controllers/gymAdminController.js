const { GetGymAdminInfo, getSales, getTrainerSales } = require('../models/database');
const { getVerifiedAdmins,AddTrainerProfile,insertPlan, insertMemberRegistration, getAdminGyms, getSalesById, getActiveCustomers } = require('../models/gym_admin');

module.exports = {
    GetGymAdminInfo: async (req, res) => {
        try {
            const { account_id } = req.query;
            const data = await GetGymAdminInfo(account_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getAdminGyms: async (req, res) => {
        try {
            const { id } = req.query;
            const data = await getAdminGyms(id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching admin gyms:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getSales: async (req, res) => {
        try {
            const data = await getSales();
            res.json(data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getActiveCustomers: async (req, res) => {
        try {
            const { gym_id } = req.query;
            const data = await getActiveCustomers(gym_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching customer data:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getSalesById: async (req, res) => {
        try {
            const { gym_id } = req.query;
            const data = await getSalesById(gym_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching gyms sales:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getTrainerSales: async (req, res) => {
        try {
            const data = await getTrainerSales();
            res.json(data);
        } catch (error) {
            console.error("Error fetching trainer sales data:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    
    getVerifiedAdmins: async (req, res) => {
        try {
            const data = await getVerifiedAdmins();
            res.json(data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    AddTrainerProfile: async (req, res) => {
        try {
            const { trainer_id, filename } = req.body;
            console.log("Received data on the server[trainer image]:", req.body);
            const data = await AddTrainerProfile(trainer_id, filename);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error", error.message);
        }
    },

    insertPlan: async (req, res) => {
        try {
            const { plan_name,price,duration_months,description } = req.body;
            console.log("received data")
            console.log(req.body)
            const data = await insertPlan(plan_name,price,duration_months,description);
            res.json(data);
        } catch (error) {
            console.error("Error adding plan:", error);
            res.status(500).send("Internal Server Error", error.message);
        }
    },

    insertMemberRegistration: async (req, res) => {
        try {
            const { gym_id, name, membership_type, amount_paid} = req.body;
            console.log("RECEIVED DATA: ")
            console.log(req.body)
            const data = await insertMemberRegistration(gym_id, name,membership_type,amount_paid);
            res.json(data);
        } catch (error) {
            console.error("Error registering member:", error.message);
            res.status(500).send("Internal Server Error", error.message);
        }
    }

}