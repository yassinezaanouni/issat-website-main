import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { Id } from "./_generated/dataModel";

export const addCourse = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    matiereId: v.id("matieres"),
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called getUser without authentication present");
    }

    // get user
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.type !== "admin")
      throw new ConvexError("You are not allowed to create a course");

    return await ctx.db.insert("courses", {
      name: args.name,
      description: args.description,
      matiereId: args.matiereId,
      roomId: args.roomId,
    });
  },
});

export const updateCourse = mutation({
  args: {
    id: v.id("courses"),
    name: v.string(),
    description: v.string(),
    matiereId: v.id("matieres"),
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called getUser without authentication present");
    }

    // get user
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.type !== "admin")
      throw new ConvexError("You are not allowed to create a course");

    const course = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();

    if (!course) throw new ConvexError("Course not found");

    return await ctx.db.patch(course._id, {
      name: args.name,
      description: args.description,
      matiereId: args.matiereId,
      roomId: args.roomId,
    });
  },
});

export const deleteCourse = mutation({
  args: {
    id: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called getUser without authentication present");
    }

    // get user
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (user.type !== "admin")
      throw new ConvexError("You are not allowed to create a course");

    const course = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .unique();

    if (!course) throw new ConvexError("Course not found");

    return await ctx.db.delete(course._id);
  },
});

export const getCourses = query({
  async handler(ctx) {
    return await ctx.db.query("courses").collect();
  },
});

export const getCoursesPopulate = query({
  async handler(ctx) {
    const courses = await ctx.db.query("courses").collect();
    const matieres = await ctx.db.query("matieres").collect();
    const rooms = await ctx.db.query("rooms").collect();
    const profs = await ctx.db.query("profs").collect();

    return courses.map((course) => {
      let matiere = matieres.find((m) => m._id === course.matiereId);
      const room = rooms.find((r) => r._id === course.roomId);

      if (matiere) {
        const prof = profs.find((p) => p._id === matiere.profId);
        matiere = { ...matiere, prof };
      }

      return {
        ...course,
        matiere,
        room,
      };
    });
  },
});
