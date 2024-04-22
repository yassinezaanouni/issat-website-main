import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getUser } from "./users";

export const addProf = mutation({
  args: {
    email: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called getUser without authentication present");
    }

    // get user
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.type !== "admin")
      throw new ConvexError("You are not allowed to create a room");

    const NewUserId = await ctx.db.insert("users", {
      email: args.email,
      type: args.type,
    });

    return await ctx.db.insert("profs", {
      type: args.type,
      user: NewUserId,
    });
  },
});

export const updateProf = mutation({
  args: {
    id: v.id("profs"),
    email: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called getUser without authentication present");
    }

    // get user
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.type !== "admin")
      throw new ConvexError("You are not allowed to create a room");

    const prof = await ctx.db
      .query("profs")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();

    if (!prof) throw new ConvexError("Prof not found");

    return await ctx.db.patch(prof._id, {
      type: args.type,
    });
  },
});

export const getProfs = query({
  handler: async (ctx) => {
    return await ctx.db.query("profs").order("desc").collect();
  },
});

export const getProf = query({
  args: {
    id: v.id("profs"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profs")
      .filter((q) => q.eq(q.field("id"), args.id))
      .unique();
  },
});
