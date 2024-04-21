import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { Id } from "./_generated/dataModel";

export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    level: v.number(),
    filliereId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called getUser without authentication present");
    }

    // get user
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.type !== "admin")
      throw new ConvexError("You are not allowed to create a group");

    return await ctx.db.insert("groups", {
      name: args.name,
      description: args.description,
      level: args.level,
      filliereId: args.filliereId,
    });
  },
});

export const getGroups = query({
  handler: async (ctx) => {
    return await ctx.db.query("groups").order("desc").collect();
  },
});

export const getFilliereGroups = query({
  args: {
    filliereId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("groups")
      .filter((q) => q.eq(q.field("filliereId"), args.filliereId))
      .collect();
  },
});

export const getDepartments = query({
  handler: async (ctx) => {
    return await ctx.db.query("departments").collect();
  },
});

export const getfillieres = query({
  handler: async (ctx) => {
    return await ctx.db.query("fillieres").collect();
  },
});

export const getFilliereByGroup = query({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId);
    if (!group) return null;
    return await ctx.db.get(group.filliereId);
  },
});

// add a student to a group
export const updateStudentGroup = mutation({
  args: {
    studentId: v.id("students"),
    groupId: v.id("groups"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called getUser without authentication present");
    }

    // get user
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.type !== "admin")
      throw new ConvexError("You are not allowed to add a student to a group");

    return await ctx.db.patch(args.studentId, {
      groupId: args.groupId,
    });
  },
});

export const getGroup = query({
  args: {
    groupId: v.optional(v.id("groups")),
  },
  handler: async (ctx, args) => {
    if (!args.groupId) return null;
    return await ctx.db.get(args.groupId);
  },
});

export const deleteGroup = mutation({
  args: {
    id: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called getUser without authentication present");
    }

    // get user
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.type !== "admin")
      throw new ConvexError("You are not allowed to delete a group");

    return await ctx.db.delete(args.id);
  },
});
