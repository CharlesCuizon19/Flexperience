const { getParkInfo } = require('../models/database');
const { createTokens, validateToken, verifyToken } = require('../middlewares/JWT');
const { sendEmail } = require('../services/emailService'); // Import the email service
const bcrypt = require('bcrypt');
const users = require('../models/users'); // Import the users model
const nodemailer = require('nodemailer');

// Utility function to send email
const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER, // Use environment variable
            pass: process.env.EMAIL_PASS, // Use environment variable
        },
    });

    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        text: `Please verify your email by clicking on the link: ${verificationUrl}`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    // Register new user
    Register: async (req, res) => {
        try {
            const { username, password, usertype, email } = req.body;

            const hash = await bcrypt.hash(password, 10);

            await users.createUser({
                username,
                password: hash,
                usertype,
                email,
                emailVerified: false, // Default to false
            });

            res.status(201).json({ message: "User successfully registered!" });
        } catch (error) {
            console.error("Register Error:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // Create gym admin
    createGymAdmin: async (req, res) => {
        try {
            const { firstname, lastname, email } = req.body;

            await users.createGymAdmin({ firstname, lastname, email });

            res.status(201).json({ message: "Gym admin successfully created!" });
        } catch (error) {
            console.error("Create Gym Admin Error:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // Register new member
    createMembers: async (req, res) => {
        try {
            const { firstname, lastname, weight, bodytype, email, username, password } = req.body;

            // Assuming you have a method to add the user to your database
            const newUser = await users.createMember({ firstname, lastname, weight, bodytype, email, username, password });

            // Create a token for email verification
            const verificationToken = createTokens({ email }); // Assuming you create a token with email as the payload

            // Construct the verification URL
            const verificationUrl = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;

            // Send verification email
            await sendEmail(
                email,
                'Verify Your Email',
                `Thank you for signing up! Please verify your email by clicking on the link below: \n\n ${verificationUrl}`
            );

            res.status(201).json({
                message: 'Gym member successfully created! Verification email sent.',
            });
        } catch (error) {
            console.error("Create Members Error:", error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Verify email route
    verifyEmail: async (req, res) => {
        const { token } = req.query;
    
        try {
            // Verify the token and extract user info (e.g., email)
            const decodedToken = verifyToken(token);  // Assuming you have a verifyToken function in your JWT service
    
            if (!decodedToken) {
                return res.status(400).send('Invalid or expired verification token.');
            }
    
            // Find the user by email or token info (whatever you're using to identify the user)
            const user = await users.findByEmail(decodedToken.email);
    
            if (!user) {
                return res.status(404).send('User not found.');
            }
    
            // Update the user’s email verified status in your database
            await users.activateUser(user.account_id);
    
            // Redirect to the desired URL after successful email verification
            res.redirect('https://flexperience.pro');
        } catch (error) {
            console.error('Verification Error:', error);
            res.status(400).send('Invalid or expired verification link.');
        }
    },    

    // Login user
    Login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await users.findOne({ username });

            if (!user) {
                return res.status(400).json({ error: "User doesn't exist" });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(400).json({ error: "Wrong username and password combination" });
            }

            const accessToken = createTokens(user);

            res.status(200).json({
                message: `Logged in successfully!`,
                accessToken,
                userType: user.user_type,
            });
        } catch (error) {
            console.error("Login Error:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};
