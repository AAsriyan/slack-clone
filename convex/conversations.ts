import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createOrGetConversation = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const { workspaceId, memberId } = args;

    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
      )
      .unique();

    const otherMember = await ctx.db.get(memberId);

    if (!currentMember || !otherMember) {
      throw new Error("Member not found");
    }

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("memberOneId"), currentMember._id),
            q.eq(q.field("memberTwoId"), otherMember._id)
          ),
          q.and(
            q.eq(q.field("memberOneId"), otherMember._id),
            q.eq(q.field("memberTwoId"), currentMember._id)
          )
        )
      )
      .unique();

    if (existingConversation) {
      return existingConversation._id;
    }

    const newConversation = await ctx.db.insert("conversations", {
      workspaceId,
      memberOneId: currentMember._id,
      memberTwoId: otherMember._id,
    });

    return newConversation;
  },
});
