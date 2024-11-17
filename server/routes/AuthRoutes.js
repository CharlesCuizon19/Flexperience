const express = require("express");
const router = express.Router();
const path = require('path');
const AuthController = require('../controllers/authController');
const { createTokens, validateToken } = require('../middlewares/JWT')
const validation = require('../middlewares/validation')
const userSchema = require('../validations/userValidations')
const gymAdminSchema = require('../validations/gymAdminValidations')

router.post("/Register", validation(userSchema), AuthController.Register);
router.post("/RegisterAdmin",validation(gymAdminSchema), AuthController.createGymAdmin);
router.post("/RegisterMember", AuthController.createMembers);
router.get('/verify-email', AuthController.verifyEmail);
router.post("/Login", AuthController.Login);


module.exports = router;

