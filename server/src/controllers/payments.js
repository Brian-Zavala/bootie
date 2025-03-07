// server/src/controllers/payments.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// Subscription plans
const PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Access to all beginner courses',
    price: 9.99,
    stripePriceId: 'price_basic', // Replace with actual Stripe price ID
    features: [
      'Access to all beginner courses',
      'Community forum access',
      'Email support'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    description: 'Access to all courses and premium features',
    price: 19.99,
    stripePriceId: 'price_premium', // Replace with actual Stripe price ID
    features: [
      'Access to all courses (beginner, intermediate, advanced)',
      'Certificate generation',
      'Priority support',
      'Downloadable resources',
      'No ads'
    ]
  }
};

// Get subscription plans
exports.getSubscriptionPlans = async (req, res) => {
  try {
    res.json({ plans: Object.values(PLANS) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create checkout session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;
    
    // Check if plan exists
    const plan = PLANS[planId];
    
    if (!plan) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }
    
    // Get or create customer
    let user = await User.findById(userId);
    let customerId = user.subscription.stripeCustomerId;
    
    if (!customerId) {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: userId.toString()
        }
      });
      
      customerId = customer.id;
      
      // Save customer ID to user
      user.subscription.stripeCustomerId = customerId;
      await user.save();
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/subscription/cancel`,
      metadata: {
        userId: userId.toString(),
        planId
      }
    });
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Handle Stripe webhook
exports.handleWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the checkout session completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Get customer and subscription details
      const userId = session.metadata.userId;
      const planId = session.metadata.planId;
      const subscriptionId = session.subscription;
      
      // Get subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Calculate end date (for display purposes)
      const startDate = new Date(subscription.current_period_start * 1000);
      const endDate = new Date(subscription.current_period_end * 1000);
      
      // Update user subscription
      await User.findByIdAndUpdate(userId, {
        subscription: {
          status: planId,
          startDate,
          endDate,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: subscriptionId
        }
      });
    }
    
    // Handle subscription updated/cancelled events
    if (event.type === 'customer.subscription.updated' || 
        event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      
      // Find user by customer ID
      const user = await User.findOne({
        'subscription.stripeSubscriptionId': subscription.id
      });
      
      if (user) {
        // Update subscription status
        if (subscription.status === 'active') {
          const planId = subscription.items.data[0].price.metadata.planId || 'basic';
          
          user.subscription.status = planId;
          user.subscription.startDate = new Date(subscription.current_period_start * 1000);
          user.subscription.endDate = new Date(subscription.current_period_end * 1000);
        } else if (subscription.status === 'canceled') {
          // Let the user access until the end of the period
          // or set to free immediately
          user.subscription.status = 'free';
        }
        
        await user.save();
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user subscription
exports.getUserSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user subscription
    const user = await User.findById(userId);
    
    // Check if subscription is valid
    const now = new Date();
    const subscriptionValid = user.subscription.endDate && user.subscription.endDate > now;
    
    // Include plan details
    const planDetails = user.subscription.status !== 'free' && user.subscription.status !== 'none'
      ? PLANS[user.subscription.status]
      : null;
    
    res.json({
      subscription: {
        status: user.subscription.status,
        startDate: user.subscription.startDate,
        endDate: user.subscription.endDate,
        valid: subscriptionValid,
        plan: planDetails
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription' });
    }
    
    // Cancel subscription in Stripe
    await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });
    
    res.json({ message: 'Subscription will be canceled at the end of the billing period' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};