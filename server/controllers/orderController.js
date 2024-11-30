const { addPaymentRecord: addPaymentRecordToDb, addSubscriptionRecord } = require('../models/database');
const { insertClientPayment, insertGymAdminPayment, insertclientToGymAdminPayment } = require('../models/payment');

module.exports = {
    handleAddPaymentRecord: async (admin_id, gym_id, subscription_id, amount, payment_status) => {
        try {
            const result = await addPaymentRecordToDb(admin_id, gym_id, subscription_id, amount, payment_status);

            console.log("Database result:", result); // Log the result

            // Check if result is in expected format
            if (result && result.affectedRows > 0) {
                return { success: true, message: "Payment record added successfully" };
            } else {
                return { success: false, message: "Failed to add payment record" };
            }
        } catch (error) {
            console.error("Error adding payment record:", error);
            throw new Error("Internal Server Error");
        }
    },
    handleClientPayment: async (contract_id, amount) => {
        try {
            const result = await insertClientPayment(contract_id, amount);

            console.log("Database result:", result); // Log the result

            // Check if result is in expected format
            if (result && result.affectedRows > 0) {
                return { success: true, message: "Client Payment record added successfully" };
            } else {
                return { success: false, message: "Failed to add client payment record" };
            }
        } catch (error) {
            console.error("Error adding client payment record:", error);
            throw new Error("Internal Server Error");
        }
    },
    insertGymAdminPayment: async (admin_id, subscription_id, amount) => {
        try {
            const result = await insertGymAdminPayment(admin_id, subscription_id, amount);

            console.log("Database result:", result); // Log the result

            // Check if result is in expected format
            if (result && result.affectedRows > 0) {
                return { success: true, message: "Gym admin Payment record added successfully" };
            } else {
                return { success: false, message: "Failed to add gym admin payment record" };
            }
        } catch (error) {
            console.error("Error adding gym admin payment record:", error);
            throw new Error("Internal Server Error");
        }
    },
    insertclientToGymAdminPayment: async (member_id, gym_id, trainer_id, payment_method, amount) => {
        try {
            const result = await insertclientToGymAdminPayment(member_id, gym_id, trainer_id, payment_method, amount);

            console.log("Database result:", result); // Log the result

            // Check if result is in expected format
            if (result && result.affectedRows > 0) {
                return { success: true, message: "Client Payment record added successfully" };
            } else {
                return { success: false, message: "Failed to add client payment record" };
            }
        } catch (error) {
            console.error("Error adding gym admin payment record:", error);
            throw new Error("Internal Server Error");
        }
    },

    addSubscriptionRecord: async (admin_id, gym_id, subscription_id, days) => {
        try {

            const result = await addSubscriptionRecord(admin_id, gym_id, subscription_id, days);

        } catch (error) {
            console.error("Error adding subscription record:", error);
            throw error; // Re-throw the error to be caught by the controller
        }
    }


};
