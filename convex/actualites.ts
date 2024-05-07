import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { Id } from "./_generated/dataModel";

export const createActualite = mutation({
  args: {
    content: v.any(),
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

    return await ctx.db.insert("actualites", {
      content: args.content,
    });
  },
});

export const getActualites = query({
  handler: async (ctx) => {
    return await ctx.db.query("actualites").order("desc").collect();
  },
});

export const deleteActualite = mutation({
  args: {
    id: v.id("actualites"),
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

    await ctx.db.delete(args.id);
  },
});
