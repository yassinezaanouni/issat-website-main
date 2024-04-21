import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const roles = v.union(
  v.literal("student"),
  v.literal("teacher"),
  v.literal("admin"),
);

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    fullName: v.string(),
    type: roles,
    pictureUrl: v.string(),
    email: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  admins: defineTable({
    name: v.string(),
    pictureUrl: v.string(),
    tokenIdentifier: v.string(),
  }),
  departments: defineTable({
    description: v.string(),
    name: v.string(),
  }),
  fillieres: defineTable({
    department: v.id("departments"),
    description: v.string(),
    name: v.string(),
  }),
  groups: defineTable({
    description: v.string(),
    filliereId: v.id("fillieres"),
    level: v.float64(),
    name: v.string(),
  }),
  students: defineTable({
    address: v.string(),
    birthDate: v.string(),
    city: v.string(),
    gender: v.string(),
    departmentId: v.id("departments"),
    filliereId: v.id("fillieres"),
    groupId: v.id("groups"),
    phone: v.string(),
    user: v.id("users"),
  }),
});
