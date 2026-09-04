/**
 * Stripe Routes
 *
 * Handles:
 * - POST /stripe/connect/onboard — Start Connect onboarding
 * - GET  /stripe/connect/status — Check Connect status
 * - POST /stripe/webhook — Receive Stripe webhooks (raw body)
 * - GET  /stripe/config — Get publishable key
 *
 * Webhook endpoint uses express.raw() middleware for signature verification.
 * All other endpoints use JSON body parsing.
 */

import { Router, Request, Response, NextFunction } from 'express';
import express from 'express';
import stripe, { stripeConfig } from '../../config/stripe';
import { authenticate } from '../../shared/middleware/authenticate';
import { db } from '../../db/client';
import { stripeConnectAccounts } from '../../db/schema';
import { eq } from 'drizzle-orm';
import * as stripeService from './stripe.service';
import { handleWebhookEvent } from './stripe.webhook';
import Stripe from 'stripe';

const router = Router();

// ============================================================
// Stripe Config — GET /stripe/config
// ============================================================

router.get(
  '/stripe/config',
  authenticate,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const config = stripeService.getStripeConfig();
      res.json(config);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// Connect Onboarding — POST /stripe/connect/onboard
// ============================================================

router.post(
  '/stripe/connect/onboard',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await stripeService.startOnboarding(userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// Connect Status — GET /stripe/connect/status
// ============================================================

router.get(
  '/stripe/connect/status',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const status = await stripeService.getConnectStatus(userId);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// Webhook — POST /stripe/webhook
//
// IMPORTANT: This route must use express.raw() for signature verification.
// It is registered separately in server.ts BEFORE the JSON parser.
// This route only handles the processing logic.
// ============================================================

router.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string | undefined;
    const endpointSecret = stripeConfig.webhookSecret;

    // 1. Validate signature
    if (!sig || !endpointSecret) {
      console.error('Missing stripe signature or webhook secret');
      return res.status(400).json({ error: 'Webhook config error' });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err?.message);
      return res.status(400).json({ error: `Webhook Error: ${err?.message}` });
    }

    // 2. Fast 200 response — process asynchronously
    res.status(200).json({ received: true });

    // 3. Process in background (fire-and-forget)
    handleWebhookEvent(event).catch((err) => {
      console.error('Background webhook processing error:', err);
    });
  }
);

export default router;
