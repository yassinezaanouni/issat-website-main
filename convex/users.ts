import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";

/**
 * Insert or update the user in a Convex table then return the document's ID.
 *
 * The `UserIdentity.tokenIdentifier` string is a stable and unique value we use
 * to look up identities.
 *
 * Keep in mind that `UserIdentity` has a number of optional fields, the
 * presence of which depends on the identity provider chosen. It's up to the
 * application developer to determine which ones are available and to decide
 * which of those need to be persisted. For Clerk the fields are determined
 * by the JWT token's Claims config.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Called storeUser without authentication present");
    }
    // Check if we've already stored this identity before.
    const user = await getUser(ctx, identity.tokenIdentifier);

    const userByEmail = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .unique();

    if (userByEmail && !userByEmail?.tokenIdentifier) {
      return await ctx.db.patch(userByEmail._id, {
        fullName: identity.name!,
        tokenIdentifier: identity.tokenIdentifier,
        pictureUrl: identity.pictureUrl,
        email: identity.email,
      });
    }

    if (!user) {
      // If it's a new identity, create a new `User`.
      return await ctx.db.insert("users", {
        fullName: identity.name!,
        tokenIdentifier: identity.tokenIdentifier,
        type: "",
        pictureUrl: identity.pictureUrl,
        email: identity.email,
      });
    }
    // If we've seen this identity before but the name has changed, patch the value.
    if (
      user.name !== identity.name ||
      user.pictureUrl !== identity.pictureUrl
    ) {
      await ctx.db.patch(user._id, {
        fullName: identity.name,
        pictureUrl: identity.pictureUrl,
      });
    }
    return user._id;
  },
});

export async function getUser(ctx: any, tokenIdentifier: string) {
  const user = await ctx.db
    .query("users")
    .filter((q: any) => q.eq(q.field("tokenIdentifier"), tokenIdentifier))
    .unique();

  if (!user) {
    return null;
  }

  return user;
}

export const getUsers = query({
  async handler(ctx) {
    return await ctx.db.query("users").collect();
  },
});

export const getMe = query({
  async handler(ctx, args) {
    if (args.isLoading) return;

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Called getUser without authentication present");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    if (!user) {
      return null;
    }

    return user;
  },
});

export const deleteUser = mutation({
  args: {
    idTable1: v.id("students") && v.id("profs"),
    idTable2: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.idTable1);
    await ctx.db.delete(args.idTable2);
  },
});

// Students
export const createStudent = mutation({
  args: {
    address: v.string(),
    phone: v.string(),
    gender: v.string(),
    birthDate: v.string(),
    city: v.string(),
    departmentId: v.string(),
    filliereId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Called getUser without authentication present");
    }
    const user = await getUser(ctx, identity.tokenIdentifier);
    if (!user) throw new ConvexError("User not found");
    const student = await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("user"), user._id))
      .unique();

    await ctx.db.patch(user._id, {
      type: "student",
    });
    if (!student) {
      return await ctx.db.insert("students", {
        user: user._id,
        gender: args.gender,
        birthDate: args.birthDate,
        address: args.address,
        phone: args.phone,
        city: args.city,
        departmentId: args.departmentId,
        filliereId: args.filliereId,
      });
    }
    throw new ConvexError("Student already exists");
  },
});

export const getStudentsGroup = query({
  args: {
    groupId: v.string(),
  },
  handler: async (ctx, args) => {
    const students = await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("groupId"), args.groupId))
      .collect();
    const users: any[] = [];
    await Promise.all(
      students.map(async (student) => {
        const user = await ctx.db.get(student.user);
        users.push({ ...user, ...student });
      }),
    );
    return users;
  },
});

export const getAllStudents = query({
  async handler(ctx) {
    const students = await ctx.db.query("students").collect();
    const users: any[] = [];
    await Promise.all(
      students.map(async (student) => {
        const user = await ctx.db.get(student.user);
        const filliereName = await ctx.db.get(student.filliereId);
        const departmentName = await ctx.db.get(student.departmentId);

        users.push({
          ...user,
          ...student,
          filliereName: filliereName.name,
          departmentName: departmentName.name,
        });
      }),
    );
    return users;
  },
});
