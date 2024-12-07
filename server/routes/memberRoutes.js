const express = require("express");
const router = express.Router();
const path = require('path');
const memberController = require('../controllers/memberController');

router.get("/getWorkoutOftheWeek", memberController.GetTodaysMeal); 
router.get("/WorkoutOftheDay", memberController.GetTodaysWorkout); 
router.get("/getMealoftheDay", memberController.getMealoftheDay); 
router.get("/getMealoftheWeek", memberController.getMealoftheWeek); 
router.get("/retrieveMealOfTheDay", memberController.retrieveMealOfTheDay); 
router.get("/getTrainerInformation", memberController.getTrainerInformation); 
router.get("/getWorkoutByDay", memberController.getWorkoutByDay); 
router.get("/getMemberInfo", memberController.getMemberInfo); 
router.get("/retrieveTrainerChatLog", memberController.retrieveTrainerchatLog); 
router.get("/retrieveNotifications", memberController.getNotifications); 
router.get("/getPlan", memberController.getPlan); 
router.get("/getMealPlanId", memberController.getMealPlanId); 
router.get("/retrieveProposals", memberController.getProposals); 
router.post("/insertContracts", memberController.insertContract); 
router.post("/insertActivity", memberController.insertActivity); 
router.put("/updateExerciseStatus", memberController.updateExerciseStatus); 
router.put("/updateMealStatus", memberController.updateMealStatus); 
router.put("/updatePlanStatus", memberController.updatePlanStatus); 

module.exports = router;

