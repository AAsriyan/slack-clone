import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workspaces").collect();
  },
});

export const createWorkspace = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { name } = args;
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    const joinCode = crypto.randomUUID().slice(0, 6);

    const workspaceId = await ctx.db.insert("workspaces", {
      name,
      userId,
      joinCode,
    });

    return workspaceId;
  },
});

export const getWorkspaceById = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.get(args.workspaceId);
  },
});
