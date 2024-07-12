import { pgTable, text, timestamp, time } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  username: text("username").notNull().unique(),
  role: text("role"),
  phoneNumber: text("phone_number"),
  profileImg: text("profile_img"),
  password_hash: text("password_hash").notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at").notNull(),
});

export const attendanceTable = pgTable("attendances", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  checkInTimeMorning: time("check_in_time_morning", { withTimezone: false }),
  checkOutTimeMorning: time("check_out_time_morning", { withTimezone: false }),
  checkInTimeAfternoon: time("check_in_time_afternoon", {
    withTimezone: false,
  }),
  checkOutTimeAfternoon: time("check_out_time_afternoon", {
    withTimezone: false,
  }),
  date: text("date"),
});
