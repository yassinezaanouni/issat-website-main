import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { Id } from "./_generated/dataModel";

export const addMatiere = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    profId: v.id("profs"),
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

    return await ctx.db.insert("matieres", {
      name: args.name,
      description: args.description,
      profId: args.profId,
    });
  },
});

export const updateMatiere = mutation({
  args: {
    id: v.id("matieres"),
    name: v.string(),
    description: v.string(),
    profId: v.id("profs"),
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

    const matiere = await ctx.db
      .query("matieres")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();

    if (!matiere) throw new ConvexError("Matiere not found");

    return await ctx.db.patch(matiere._id, {
      name: args.name,
      description: args.description,
      profId: args.profId,
    });
  },
});

export const deleteMatiere = mutation({
  args: {
    id: v.id("matieres"),
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

    return await ctx.db.delete(args.id);
  },
});

export const getMatieres = query({
  async handler(ctx) {
    return await ctx.db.query("matieres").collect();
  },
});

export const getMatiere = query({
  args: {
    id: v.id("matieres"),
  },
  async handler(ctx, args) {
    return await ctx.db
      .query("matieres")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();
  },
});
