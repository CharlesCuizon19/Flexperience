const { getWorkoutOftheWeek, GetMemberInfo, retrieveTrainerchatLog} = require('../models/database');
const { getNotifications,getProposals,insertContract,getWorkoutoftheDay,getPlan, updateExerciseStatus,insertActivity, 
        getMealPlanId,getMealoftheDay, getWorkoutByDay, retrieveMealOfTheDay, getMealoftheWeek,updateMealStatus, getTrainerInformation,updatePlanStatus } = require('../models/members');

module.exports = {
    GetTodaysMeal: async (req, res) => {
        try {
            const { memberId, weekNo} = req.query;
            const users = await getWorkoutOftheWeek(memberId, weekNo);
            res.json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },    
    GetTodaysWorkout: async (req, res) => {
        try {
            const { member_id, plan_id } = req.query;
            const data = await getWorkoutoftheDay(member_id, plan_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getWorkoutByDay: async (req, res) => {
        try {
            const { member_id, date} = req.query;
            console.log("data------------")
            console.log("id: " + member_id + " date: " + date)
            const data = await getWorkoutByDay(member_id, date);
            res.json(data);
        } catch (error) {
            console.error("Error fetching workout of the day:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getMealoftheDay: async (req, res) => {
        try {
            const { member_id, plan_id } = req.query;
            const data = await getMealoftheDay(member_id, plan_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching meal of the day:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    updatePlanStatus: async (req, res) => {
        try {
            const { plan_id } = req.body;
            const data = await updatePlanStatus(plan_id);
            res.json(data);
        } catch (error) {
            console.error("Error updating plan status:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getMealoftheWeek: async (req, res) => {
        try {
            const { member_id, plan_id } = req.query;
            const data = await getMealoftheWeek(member_id, plan_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching meal of the week:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    retrieveMealOfTheDay: async (req, res) => {
        try {
            const { member_id, plan_id } = req.query;
            const data = await retrieveMealOfTheDay(member_id, plan_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching Meal Of The Day:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getMemberInfo: async (req, res) => {
        try {
            const { account_id } = req.query;
            console.log(account_id)
            const data = await GetMemberInfo(account_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    updateExerciseStatus: async (req, res) => {
        const { status_id, status } = req.body;
        try {
            await updateExerciseStatus(status, status_id);
            res.status(200).send("Workout exercise updated successfully");

        } catch (error) {
            console.error("Error updating workout template exercises:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    updateMealStatus: async (req, res) => {
        const { status_id, status } = req.body;
        try {
            await updateMealStatus(status, status_id);
            res.status(200).send("Meal updated successfully");

        } catch (error) {
            console.error("Error updating meal", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    retrieveTrainerchatLog: async (req, res) => {
        try {
            const { member_id } = req.query;
            console.log("received data: ", member_id)
            const data = await retrieveTrainerchatLog(member_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members chatlog:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getTrainerInformation: async (req, res) => {
        try {
            const { member_id } = req.query;
            const data = await getTrainerInformation(member_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members trainer:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    getNotifications: async (req, res) => {
        try {
            const { member_id } = req.query;
            console.log("received data: ", member_id)
            const data = await getNotifications(member_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members notifications:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getPlan: async (req, res) => {
        try {
            const { member_id } = req.query;
            console.log("received data: ", member_id)
            const data = await getPlan(member_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members plan ID:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getMealPlanId: async (req, res) => {
        try {
            const { member_id } = req.query;
            console.log("received data: ", member_id)
            const data = await getMealPlanId(member_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members plan ID:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getProposals: async (req, res) => {
        try {
            const { member_id, proposal_id } = req.query;
            const data = await getProposals(member_id, proposal_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members proposals:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    insertContract: async (req, res) => {
        try {
            const { proposal_id, weeks, status } = req.body;
            const data = await insertContract(proposal_id, weeks, status);
            res.status(200).json({ message: "Contract added successfully", contract_id:  data  });
        } catch (error) {
            console.error("Error adding contracts:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    
    insertActivity: async (req, res) => {
        try {
            const { member_id, trainer_id, message } = req.body;
            const data = await insertActivity(member_id, trainer_id, message);
            res.status(200).json({ message: "Activity added successfully", activity_id:  data  });
        } catch (error) {
            console.error("Error adding contracts:", error.message);
            res.status(500).send("Internal Server Error");
        }
    }
}