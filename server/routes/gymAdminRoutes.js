const express = require("express");
const router = express.Router();
const gymAdmin = require('../controllers/gymAdminController');

router.get("/getGymAdminInfo", gymAdmin.GetGymAdminInfo); 
router.get("/getAdminGyms", gymAdmin.getAdminGyms); 
router.get("/getVerifiedAdmins", gymAdmin.getVerifiedAdmins); 
router.get("/getSales", gymAdmin.getSales); 
router.get("/getActiveCustomers", gymAdmin.getActiveCustomers); 
router.get("/getSalesById", gymAdmin.getSalesById); 
router.get("/getAdminTrainers", gymAdmin.getAdminTrainers); 
router.get("/getTrainerSales", gymAdmin.getTrainerSales); 
router.post("/insertTrainerImage", gymAdmin.AddTrainerProfile); 
router.post("/insertPlan", gymAdmin.insertPlan); 
router.post("/insertMemberRegistration", gymAdmin.insertMemberRegistration); 


module.exports = router;

