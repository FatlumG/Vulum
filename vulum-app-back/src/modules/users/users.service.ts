/**
 * Users Service
 *
 * Handles user-related business logic.
 * Uses Drizzle ORM + PostgreSQL.
 * Preserves V1 API response contract exactly.
 *
 * Key responsibility:
 * - dashboardStats: Compute counters via COUNT() (V1 used denormalized columns)
 * - getProfile: Return specific fields matching V1 shape
 * - getMonthlyStats: Compute monthly aggregates from related entities
 * - updateUser: Update user fields
 */

import { db } from '../../db/client';
import { users, roles, products, orders, sales, favorites, pendings } from '../../db/schema';
import { eq, count, sql, and, gte, lt } from 'drizzle-orm';
import { NotFoundError, ForbiddenError } from '../../shared/errors';

// ============================================================
// Dashboard Stats
//
// V1 returned: { totalUsers, user: { id, sales, products, orders, favorites, pendings, first_name, last_name } }
// V2 computes counters via COUNT() queries
// ============================================================

export async function dashboardStats(userId: number) {
  // 1. Verify user exists
  const userResult = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const user = userResult[0];

  if (!user) {
    throw new NotFoundError('User', userId);
  }

  // 2. Count total users
  const [totalUsersResult] = await db
    .select({ count: count() })
    .from(users);

  // 3. Compute counters via COUNT() — replaces V1 denormalized columns
  const [productCount] = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.createdBy, userId));

  const [orderCount] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.createdBy, userId));

  const [saleCount] = await db
    .select({ count: count() })
    .from(sales)
    .where(eq(sales.userId, userId));

  const [favoriteCount] = await db
    .select({ count: count() })
    .from(favorites)
    .where(eq(favorites.userId, userId));

  const [pendingCount] = await db
    .select({ count: count() })
    .from(pendings)
    .where(eq(pendings.userId, userId));

  // 4. Return shape matching V1 exactly
  return {
    totalUsers: totalUsersResult.count,
    user: {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      sales: saleCount.count,
      products: productCount.count,
      orders: orderCount.count,
      favorites: favoriteCount.count,
      pendings: pendingCount.count,
    },
  };
}

// ============================================================
// Profile
//
// V1 returned: { id, first_name, last_name, profile_photo_url, role_name }
// ============================================================

export async function getProfile(userId: number) {
  const result = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      profilePhotoUrl: users.profilePhotoUrl,
      roleName: roles.roleName,
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, userId))
    .limit(1);

  const user = result[0];

  if (!user) {
    throw new NotFoundError('User', userId);
  }

  // Return shape matching V1 exactly
  return {
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    profile_photo_url: user.profilePhotoUrl,
    role_name: user.roleName,
  };
}

// ============================================================
// Monthly Stats
//
// V1 returned: [{ month, monthName, sales, products, pendings }]
// Computed from related entities by month
// ============================================================

export async function getMonthlyStats(userId: number, year: number = new Date().getFullYear()) {
  // Verify user exists
  const userResult = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!userResult.length) {
    throw new NotFoundError('User', userId);
  }

  // Initialize monthly data array
  const monthlyData = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    monthName: new Date(year, index).toLocaleString('default', { month: 'short' }),
    sales: 0,
    products: 0,
    pendings: 0,
  }));

  // Count sales by month
  const salesByMonth = await db
    .select({
      month: sql<number>`EXTRACT(MONTH FROM ${sales.soldAt})`.as('month'),
      count: count(),
    })
    .from(sales)
    .where(
      and(
        eq(sales.userId, userId),
        gte(sales.soldAt, new Date(year, 0, 1)),
        lt(sales.soldAt, new Date(year + 1, 0, 1))
      )
    )
    .groupBy(sql`EXTRACT(MONTH FROM ${sales.soldAt})`);

  // Count products by month
  const productsByMonth = await db
    .select({
      month: sql<number>`EXTRACT(MONTH FROM ${products.createdAt})`.as('month'),
      count: count(),
    })
    .from(products)
    .where(
      and(
        eq(products.createdBy, userId),
        gte(products.createdAt, new Date(year, 0, 1)),
        lt(products.createdAt, new Date(year + 1, 0, 1))
      )
    )
    .groupBy(sql`EXTRACT(MONTH FROM ${products.createdAt})`);

  // Count pendings by month
  const pendingsByMonth = await db
    .select({
      month: sql<number>`EXTRACT(MONTH FROM ${pendings.createdAt})`.as('month'),
      count: count(),
    })
    .from(pendings)
    .where(
      and(
        eq(pendings.userId, userId),
        gte(pendings.createdAt, new Date(year, 0, 1)),
        lt(pendings.createdAt, new Date(year + 1, 0, 1))
      )
    )
    .groupBy(sql`EXTRACT(MONTH FROM ${pendings.createdAt})`);

  // Populate monthly data
  salesByMonth.forEach((row) => {
    const monthIndex = Number(row.month) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      monthlyData[monthIndex].sales = row.count;
    }
  });

  productsByMonth.forEach((row) => {
    const monthIndex = Number(row.month) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      monthlyData[monthIndex].products = row.count;
    }
  });

  pendingsByMonth.forEach((row) => {
    const monthIndex = Number(row.month) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      monthlyData[monthIndex].pendings = row.count;
    }
  });

  return monthlyData;
}

// ============================================================
// Update User
// ============================================================

export async function updateUser(
  userId: number,
  data: {
    first_name?: string;
    last_name?: string;
    bio?: string;
    phone?: string;
    address?: string;
    profile_photo_url?: string;
  }
) {
  const updateData: Record<string, any> = {};

  if (data.first_name !== undefined) updateData.firstName = data.first_name;
  if (data.last_name !== undefined) updateData.lastName = data.last_name;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.profile_photo_url !== undefined) updateData.profilePhotoUrl = data.profile_photo_url;

  if (Object.keys(updateData).length === 0) {
    throw new Error('No fields to update');
  }

  const [updated] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      bio: users.bio,
      phone: users.phone,
      address: users.address,
      profilePhotoUrl: users.profilePhotoUrl,
      roleId: users.roleId,
    });

  if (!updated) {
    throw new NotFoundError('User', userId);
  }

  return updated;
}

// ============================================================
// Get User by ID (full user with role and plan)
// ============================================================

export async function getUserById(userId: number) {
  const result = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      bio: users.bio,
      phone: users.phone,
      address: users.address,
      profilePhotoUrl: users.profilePhotoUrl,
      roleId: users.roleId,
      roleName: roles.roleName,
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, userId))
    .limit(1);

  const user = result[0];

  if (!user) {
    throw new NotFoundError('User', userId);
  }

  return user;
}

// ============================================================
// Get Users by Search
//
// V1 returned: [{ id, username, first_name, last_name, email, phone, role_name }]
// ============================================================

export async function getUsersBySearch(search?: string) {
  const query = db
    .select({
      id: users.id,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
      roleName: roles.roleName,
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id));

  // Note: For Phase 2, search is not implemented with full-text search.
  // This returns all users. Full-text search can be added later with
  // PostgreSQL's tsvector or trgm extension.
  const result = await query;

  return result.map((user) => ({
    id: user.id,
    username: user.username,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    phone: user.phone,
    role_name: user.roleName,
  }));
}
