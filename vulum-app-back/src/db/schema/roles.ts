import { pgTable, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const roles = pgTable('roles', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  roleName: varchar('role_name', { length: 50 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));
