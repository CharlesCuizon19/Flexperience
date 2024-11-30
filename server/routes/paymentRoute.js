const express = require('express');
const router = express.Router();
const paypal = require('../services/paypal');

router.post('/pay', async (req, res) => {
    const { admin_id, planID, subscriptionName, price } = req.body;
    try {
        const { approvalLink } = await paypal.createSubscription(admin_id, gym_id, planID, subscriptionID, subscriptionName, days, price); // Pass the correct parameters
        console.log("------------")
        console.log(days)
        console.log(approvalLink)
        res.send({ approvalLink }); // Send the PayPal approval URL for the subscription
    } catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
});

router.post('/GymAdminPayment', async (req, res) => {
    const { admin_id, subscription_id, amount, planName, daysRemaining, isRenewal } = req.body;
    console.log(req.body)
    try {
        const url = await paypal.createPayment(admin_id, subscription_id, amount, planName, daysRemaining, isRenewal);
        console.log("route: " + url)
        res.send({url}); // Send the PayPal approval URL
    } catch (error) {
        res.send("ERROR: " + error.message);
    }
});

router.post('/clientToGymAdminPayment', async (req, res) => {
    const { member_id, gym_id, trainer_id, payment_method, amount } = req.body;
    console.log(req.body)
    try {
        const url = await paypal.clientToGymAdminPayment(member_id, gym_id, trainer_id, payment_method, amount);
        console.log("route: " + url)
        res.send({url}); // Send the PayPal approval URL
    } catch (error) {
        res.send("ERROR: " + error.message);
    }
});


router.post('/clientPayment', async (req, res) => {
    const { paymentId, price } = req.body;
    try {
        const url = await paypal.createClientToTrainerPayment(paymentId, price);
        console.log("URL")
        console.log(url)
        res.send(url); // Send the PayPal approval URL
    } catch (error) {
        res.send("ERROR: " + error.message);
    }
});

module.exports = router;
