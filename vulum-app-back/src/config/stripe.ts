import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

console.log(process.env.STRIPE_SECRET_KEY, 'stripe secret');

export default stripe;
