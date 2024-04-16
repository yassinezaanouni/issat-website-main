import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";

export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    level: v.number(),
    filiereId: v.string(),
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
      filiereId: args.filiereId,
    });
  },
});

export const getGroups = query({
  handler: async (ctx) => {
    return await ctx.db.query("groups").order("desc").collect();
  },
});

export const getDepartments = query({
  handler: async (ctx) => {
    return await ctx.db.query("departments").collect();
  },
});

export const getFilieres = query({
  handler: async (ctx) => {
    return await ctx.db.query("filieres").collect();
  },
});
