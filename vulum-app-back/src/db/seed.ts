/**
 * Development Seed Script
 *
 * Seeds the database with initial data for development.
 * Safe to run multiple times (upserts where possible).
 *
 * Usage:
 *   npx ts-node src/db/seed.ts
 *   or
 *   npm run db:seed:v2
 *
 * Seeded data:
 * - Roles (admin, moderator, user)
 * - Categories (sample product categories)
 * - Plans (pricing tiers)
 */

import { db } from './client';
import { roles, categories, plans } from './schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    // ============================================
    // 1. Seed Roles
    // ============================================
    console.log('📝 Seeding roles...');

    const rolesData = [
      { roleName: 'super_admin' },
      { roleName: 'admin' },
      { roleName: 'manager' },
      { roleName: 'vendor' },
      { roleName: 'user' },
    ];

    for (const role of rolesData) {
      // Check if role already exists before inserting
      const existing = await db
        .select({ id: roles.id })
        .from(roles)
        .where(eq(roles.roleName, role.roleName))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(roles).values(role);
      }
    }

    console.log(`   ✅ Roles seeded: ${rolesData.map((r) => r.roleName).join(', ')}`);

    // ============================================
    // 2. Seed Categories
    // ============================================
    console.log('📂 Seeding categories...');

    // TODO: Verify actual V1 role names match these values before production migration

    const categoriesData = [
      { categoryName: 'Electronics', categoryDescription: 'Electronic devices and accessories' },
      { categoryName: 'Clothing', categoryDescription: 'Apparel and fashion items' },
      { categoryName: 'Home & Garden', categoryDescription: 'Home decor and garden supplies' },
      { categoryName: 'Sports', categoryDescription: 'Sports equipment and accessories' },
      { categoryName: 'Books', categoryDescription: 'Books and educational materials' },
    ];

    for (const category of categoriesData) {
      // Check if category already exists before inserting
      const existing = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.categoryName, category.categoryName))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(categories).values(category);
      }
    }

    console.log(`   ✅ Categories seeded: ${categoriesData.map((c) => c.categoryName).join(', ')}`);

    // ============================================
    // 3. Seed Plans
    // ============================================
    console.log('💳 Seeding plans...');

    const plansData = [
      {
        planName: 'Free',
        planDescription: 'Basic features for getting started',
        price: '0.00',
        billingCycle: 'none' as const,
      },
      {
        planName: 'Starter',
        planDescription: 'Essential features for small businesses',
        price: '9.99',
        billingCycle: 'monthly' as const,
      },
      {
        planName: 'Professional',
        planDescription: 'Advanced features for growing businesses',
        price: '29.99',
        billingCycle: 'monthly' as const,
      },
      {
        planName: 'Enterprise',
        planDescription: 'Custom features for large organizations',
        price: '99.99',
        billingCycle: 'monthly' as const,
      },
    ];

    for (const plan of plansData) {
      // Check if plan already exists before inserting
      const existing = await db
        .select({ id: plans.id })
        .from(plans)
        .where(eq(plans.planName, plan.planName))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(plans).values(plan);
      }
    }

    console.log(`   ✅ Plans seeded: ${plansData.map((p) => p.planName).join(', ')}`);

    // ============================================
    // Done
    // ============================================
    console.log('\n✅ Database seeding complete!');
    console.log('\n📋 Summary:');
    console.log(`   - ${rolesData.length} roles`);
    console.log(`   - ${categoriesData.length} categories`);
    console.log(`   - ${plansData.length} plans`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seed
seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
