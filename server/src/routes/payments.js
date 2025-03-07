// server/src/routes/payments.js
const express = require('express');
const PaymentController = require('../controllers/payments');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get subscription plans
router.get('/plans', PaymentController.getSubscriptionPlans);

// Create checkout session
router.post('/create-checkout-session', authenticate, PaymentController.createCheckoutSession);

// Stripe webhook
router.post('/webhook', PaymentController.handleWebhook);

// Get user subscription
router.get('/subscription', authenticate, PaymentController.getUserSubscription);

// Cancel subscription
router.post('/cancel-subscription', authenticate, PaymentController.cancelSubscription);

module.exports = router;