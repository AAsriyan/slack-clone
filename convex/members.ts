import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

export const getMembers = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return [];

    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    const members = [];

    for (const member of data) {
      const user = await populateUser(ctx, member.userId);

      if (user) {
        members.push({
          ...member,
          user,
        });
      }
    }

    return members;
  },
});

export const getMemberById = query({
  args: {
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const { memberId } = args;

    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const member = await ctx.db.get(memberId);
    if (!member) return null;

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember) return null;

    const user = await populateUser(ctx, member.userId);

    if (!user) return null;

    return { ...member, user };
  },
});

export const currentMember = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return null;

    return member;
  },
});

export const updateMember = mutation({
  args: {
    memberId: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const { memberId, role } = args;

    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db.get(memberId);
    if (!member) {
      throw new Error("Member not found");
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember || currentMember.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(memberId, { role: role });

    return memberId;
  },
});

export const removeMember = mutation({
  args: {
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const { memberId } = args;

    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db.get(memberId);
    if (!member) {
      throw new Error("Member not found");
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember) {
      throw new Error("Unauthorized");
    }

    if (member.role === "admin") {
      throw new Error("Cannot remove admin member");
    }

    const isSelf = currentMember._id === memberId;
    const isSelfAdmin = isSelf && currentMember.role === "admin";

    if (isSelfAdmin) {
      throw new Error("Cannot remove yourself if you are an admin");
    }

    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("reactions")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), member._id),
            q.eq(q.field("memberTwoId"), member._id)
          )
        )
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }
    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }

    await ctx.db.delete(memberId);

    return memberId;
  },
});
