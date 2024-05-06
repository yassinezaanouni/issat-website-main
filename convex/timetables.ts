import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { Id } from "./_generated/dataModel";

export const addTimeTable = mutation({
  args: {
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
      throw new ConvexError("You are not allowed to create a course");

    return await ctx.db.insert("timetables", {
      groupId: args.groupId,
    });
  },
});

export const getGroupTimeTable = mutation({
  args: {
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    let timeTable;
    timeTable = await ctx.db
      .query("timetables")
      .filter((q) => q.eq(q.field("groupId"), args.groupId))
      .unique();

    if (!timeTable)
      timeTable = await ctx.db.insert("timetables", {
        groupId: args.groupId,
      });
    return timeTable;
  },
});

export const addTimeTableItem = mutation({
  args: {
    timeTableId: v.id("timetables"),
    item: v.any(),
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

    // push item to courses
    const timeTable = await ctx.db.get(args.timeTableId);
    if (!timeTable) throw new ConvexError("TimeTable not found");
    const courses = timeTable.courses || [];

    delete args.item._creationTime;
    args.item.id = args.item._id;
    delete args.item._id;

    delete args.item.matiere._creationTime;
    delete args.item.room._creationTime;
    delete args.item.matiere._id;
    delete args.item.room._id;
    delete args.item.matiere.prof._creationTime;
    delete args.item.matiere.prof._id;

    return await ctx.db.patch(args.timeTableId, {
      courses: [...courses, args.item],
    });
  },
});
