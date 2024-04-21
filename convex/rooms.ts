import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getUser } from "./users";

export const createRoom = mutation({
  args: {
    name: v.string(),
    description: v.string(),
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

    return await ctx.db.insert("rooms", {
      name: args.name,
      description: args.description,
    });
  },
});

export const getRooms = query({
  handler: async (ctx) => {
    return await ctx.db.query("rooms").order("desc").collect();
  },
});

export const getRoom = query({
  args: {
    id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("id"), args.id))
      .unique();
  },
});

export const updateRoom = mutation({
  args: {
    id: v.id("rooms"),
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called getUser without authentication present");
    }

    // get user
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.type !== "admin")
      throw new ConvexError("You are not allowed to update a room");

    return await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
    });
  },
});

export const deleteRoom = mutation({
  args: {
    id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called getUser without authentication present");
    }

    // get user
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.type !== "admin")
      throw new ConvexError("You are not allowed to delete a room");

    return await ctx.db.delete(args.id);
  },
});
