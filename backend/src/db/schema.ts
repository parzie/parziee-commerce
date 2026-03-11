import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const categoryEnum = pgEnum('category', [
  'clothing',
  'electronics',
  'books',
  'furniture',
  'sports',
  'other',
]);

export const conditionEnum = pgEnum('condition', [
  'new',
  'like-new',
  'good',
  'fair',
]);

export const roleEnum = pgEnum('user_role', ['admin', 'seller', 'buyer']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: roleEnum('role').notNull().default('buyer'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  /** Price in cents (integer). Divide by 100 for display. */
  price: integer('price').notNull(),
  images: text('images').array().notNull().default([]),
  category: categoryEnum('category').notNull(),
  condition: conditionEnum('condition').notNull(),
  sold: boolean('sold').notNull().default(false),
  sellerId: uuid('seller_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type DbProduct = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type DbUser = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
