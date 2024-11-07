const { getMembers, getExercises,
    AddCustomWorkout, getStudCount,
    getTrainerCount, getAllMembers,
    getTemplates, AddTemplate, GetTrainerInfo, retrieveMemberChatLog, getTemplateId } = require('../models/database');
const { getAllTrainers, getGymTrainers, insertGymTrainers, insertWorkoutTemplates,
    insertWorkoutTemplateExercise, getGymTrainersById, updateWorkoutTemplateExercise,
    removeTemplateExercise, inputFilter, insertMealTemplates, insertMealTemplatesItems,
    insertMealTemplatesSteps, insertProposal, insertNotification,getStudents,assignWorkoutPlan,insertStudentWorkouts, getProgressOftheDay, getStudentActivity,
    assignMealPlan, insertStudentMeals, insertPremadeMeals, getPremadeMeals, getMealProgressOftheDay, insertPremadeMealImage } = require('../models/trainers');

module.exports = {

    getTrainerInfo: async (req, res) => {
        try {
            const { user_id } = req.query;
            console.log("query: " + user_id)
            const data = await GetTrainerInfo(user_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching trainer:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getStudents: async (req, res) => {
        try {
            const { trainer_id } = req.query;
            const data = await getStudents(trainer_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching trainer students:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getProgressOftheDay: async (req, res) => {
        try {
            const { trainer_id } = req.query;
            const data = await getProgressOftheDay(trainer_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching today's progress:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getMealProgressOftheDay: async (req, res) => {
        try {
            const { trainer_id } = req.query;
            const data = await getMealProgressOftheDay(trainer_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching today's meal progress:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getStudentActivity: async (req, res) => {
        try {
            const { trainer_id } = req.query;
            const data = await getStudentActivity(trainer_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching today's progress:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getTemplateId: async (req, res) => {
        try {
            const { template_name, table } = req.query;
            const data = await getTemplateId(template_name, table);
            res.json(data);
        } catch (error) {
            console.error("Error fetching id:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getPremadeMeals: async (req, res) => {
        try {
            const { trainer_id } = req.query;
            const data = await getPremadeMeals(trainer_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching pre-made meals:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    retrieveMemberChatLog: async (req, res) => {
        try {
            const { trainer_id } = req.query;
            console.log("received data: ", trainer_id)
            const data = await retrieveMemberChatLog(trainer_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getGymTrainer: async (req, res) => {
        try {
            const gym_id = req.query.gymid;
            console.log("received data: " + gym_id)
            const data = await getGymTrainers(gym_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getGymTrainersById: async (req, res) => {
        try {
            const { trainer_id } = req.query;
            console.log("received data: " + trainer_id)
            const data = await getGymTrainersById(trainer_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching trainer:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    getMembers: async (req, res) => {
        try {
            const data = await getMembers();
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getAllTrainers: async (req, res) => {
        try {
            const data = await getAllTrainers();
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getExercises: async (req, res) => {
        try {
            const data = await getExercises();
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    AddCustom: async (req, res) => {
        const { member_id, exercise_id, reps, sets, workout_date, status } = req.body;
        try {
            await AddCustomWorkout(member_id, exercise_id, reps, sets, workout_date, status);
            res.status(200).send("Workout added successfully"); // Correct way to send status and a message

        } catch (error) {
            console.error("Error adding user:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getCount: async (req, res) => {
        try {
            const data = await getStudCount();
            res.json(data);
        } catch (error) {
            console.error("Error fetching dataaa - ctr:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getTrainerCount: async (req, res) => {
        try {
            const data = await getTrainerCount();
            res.json(data);
        } catch (error) {
            console.error("Error fetching dataaa - ctr:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getAllMembers: async (req, res) => {
        try {
            const data = await getAllMembers();
            res.json(data);
        } catch (error) {
            console.error("Error fetching dataaa - ctr:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getTemplates: async (req, res) => {
        try {
            const { trainer_id, table } = req.query;
            console.log(`TABLE: " ${table}`)
            const data = await getTemplates(trainer_id, table);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    inputFilter: async (req, res) => {
        try {
            const { query, trainer_id } = req.query;
            const data = await inputFilter(query, trainer_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching templates:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    AddTemplate: async (req, res) => {
        const { trainer_id, name, desc } = req.body;
        try {
            await AddTemplate(trainer_id, name, desc);
            res.status(200).send("Template added successfully");

        } catch (error) {
            console.error("Error adding user:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    assignWorkoutPlan: async (req, res) => {
        const { trainer_id, member_id, template_id, status } = req.body;
        try {
            const plan_id = await assignWorkoutPlan(trainer_id, member_id, template_id, status);
            res.status(200).json({ message: "Template assigned successfully!", plan_id: plan_id });

        } catch (error) {
            console.error("Error assigning student:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    insertStudentWorkouts: async (req, res) => {
        const { plan_id, template_id } = req.body;
        try {
            const id = await insertStudentWorkouts(plan_id, template_id);
            res.status(200).json({ message: "Student workouts assigned successfully!", plan_id: id });

        } catch (error) {
            console.error("Error assigning student:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    assignMealPlan: async (req, res) => {
        const { trainer_id, member_id, meal_template_id, status } = req.body;
        console.log("meal plan controller data: ")
        console.log(trainer_id)
        console.log(member_id)
        console.log(meal_template_id)
        console.log(status)
        try {
            const plan_id = await assignMealPlan(trainer_id, member_id, meal_template_id, status);
            res.status(200).json({ message: "Meal Template assigned successfully!", plan_id: plan_id });

        } catch (error) {
            console.error("Error assigning student:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    insertStudentMeals: async (req, res) => {
        const { plan_id, meal_template_id } = req.body;
        console.log("meal plan meals controller data: ")
        console.log(plan_id)
        console.log(meal_template_id)
        try {
            const id = await insertStudentMeals(plan_id, meal_template_id);
            res.status(200).json({ message: "Student meals assigned successfully!", plan_id: id });

        } catch (error) {
            console.error("Error assigning student:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    createGymTrainer: async (req, res) => {
        const { gymid, firstname, lastname, bio, experience, rates, trainerType } = req.body;
        try {
            const trainerId = await insertGymTrainers(gymid, firstname, lastname, bio, experience, rates, trainerType);
            res.status(200).json({ message: "Trainer added successfully", trainerId: trainerId });

        } catch (error) {
            console.error("Error adding trainer:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    insertWorkoutTemplate: async (req, res) => {
        const { trainer_id, template_name, description } = req.body;
        try {
            await insertWorkoutTemplates(trainer_id, template_name, description);
            res.status(200).send("Workout template added successfully");

        } catch (error) {
            console.error("Error adding workout template:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    insertMealTemplate: async (req, res) => {
        const { trainer_id, template_name, description } = req.body;
        try {
            const templateId = await insertMealTemplates(trainer_id, template_name, description);
            res.status(200).json({ message: "Meal template added successfully", templateId: templateId });

        } catch (error) {
            console.error("Error adding meal template:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    insertWorkoutTemplateExercise: async (req, res) => {
        const { template_id, exercise_id, exercise_name, reps, sets, muscle_group, secondaryMuscle, week_no, day_no } = req.body;
        try {
            await insertWorkoutTemplateExercise(template_id, exercise_id, exercise_name, reps, sets, muscle_group, secondaryMuscle, week_no, day_no);
            res.status(200).send("Workout template exercises added successfully");

        } catch (error) {
            console.error("Error adding workout template exercises:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    insertMealTemplateItems: async (req, res) => {
        const { meal_template_id, pre_made_meal_id, classification, week_no, day_no } = req.body;
        try {
            // Capture the returned insertId
            const insertedMealItemId = await insertMealTemplatesItems(meal_template_id, pre_made_meal_id, classification, week_no, day_no);

            // Respond with a success message and the inserted ID
            res.status(200).json({ message: "Meal template item added successfully!", mealItemId: insertedMealItemId });

        } catch (error) {
            console.error("Error adding meal template items:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    insertPremadeMeals: async (req, res) => {
        const { trainer_id, meal_name, calories, carbs, fats, protein } = req.body;
        try {
            // Capture the returned insertId
            const pre_made_meal_id = await insertPremadeMeals(trainer_id, meal_name, calories, carbs, fats, protein);

            // Respond with a success message and the inserted ID
            res.status(200).json({ message: "Pre made meal added successfully!", pre_made_meal_id: pre_made_meal_id });

        } catch (error) {
            console.error("Error adding meal template items:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    insertPremadeMealImage: async (req, res) => {
        try {
            const { pre_made_meal_id, filename } = req.body;
            const data = await insertPremadeMealImage(pre_made_meal_id, filename);
            res.json(data);
        } catch (error) {
            console.error("Error posting meal image", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    insertMealTemplateSteps: async (req, res) => {
        const { pre_made_meal_id, step_number, instruction } = req.body;
        try {
            await insertMealTemplatesSteps(pre_made_meal_id, step_number, instruction);
            res.status(200).send("Meal template item steps added successfully!");

        } catch (error) {
            console.error("Error adding steps:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    updateWorkoutTemplateExercise: async (req, res) => {
        const { exercise_name, reps, sets, muscle_group, template_exercise_id } = req.body;
        try {
            await updateWorkoutTemplateExercise(exercise_name, reps, sets, muscle_group, template_exercise_id);
            res.status(200).send("Workout template exercises updated successfully");

        } catch (error) {
            console.error("Error updating workout template exercises:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    removeTemplateExercise: async (req, res) => {
        const { template_exercise_id } = req.query; // Change this line
        console.log("received data", template_exercise_id);
        try {
            await removeTemplateExercise(template_exercise_id);
            res.status(200).send("Workout template exercise deleted successfully");
        } catch (error) {
            console.error("Error deleting workout template exercise:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    insertProposal: async (req, res) => {
        const { trainer_id, member_id, planType, price, duration, status } = req.body;
        try {
            const proposal_id = await insertProposal(trainer_id, member_id, planType, price, duration, status);
            res.status(200).json({ message: "Proposal added successfully", proposal_id:  proposal_id  });

        } catch (error) {
            console.error("Error adding proposal:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    insertNotification: async (req, res) => {
        const { member_id, proposal_id, message } = req.body;
        try {
            const notification_id = await insertNotification(member_id, proposal_id, message);
            res.status(200).json({ message: "Notification added successfully", notif_id:  notification_id  });

        } catch (error) {
            console.error("Error adding notification:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },


}