import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get emergency phrases by category and language
export const getEmergencyPhrases = query({
  args: {
    language: v.string(),
    category: v.optional(v.union(v.literal("medical"), v.literal("rescue"), v.literal("location"), v.literal("safety"), v.literal("communication"), v.literal("earthquake"), v.literal("flood"), v.literal("fire"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let phrases;

    if (args.category) {
      phrases = await ctx.db
        .query("emergencyPhrases")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .take(args.limit ?? 20);
      // Filter by language if category was specified
      return phrases.filter(phrase => phrase.language === args.language);
    } else {
      phrases = await ctx.db
        .query("emergencyPhrases")
        .withIndex("by_language", (q) => q.eq("language", args.language))
        .take(args.limit ?? 20);
    }

    return phrases.sort((a, b) => b.priority - a.priority);
  },
});

// Get high priority emergency phrases
export const getCriticalEmergencyPhrases = query({
  args: { 
    language: v.string(),
    minPriority: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const minPriority = args.minPriority ?? 8;
    
    return await ctx.db
      .query("emergencyPhrases")
      .withIndex("by_language", (q) => q.eq("language", args.language))
      .filter((q) => q.gte(q.field("priority"), minPriority))
      .order("desc")
      .take(10);
  },
});

// Create emergency broadcast
export const createEmergencyBroadcast = mutation({
  args: {
    message: v.string(),
    sourceLanguage: v.string(),
    location: v.string(),
    urgencyLevel: v.number(),
    category: v.string(),
    broadcasterId: v.string(),
    translations: v.optional(v.array(v.object({
      language: v.string(),
      text: v.string(),
      audioUrl: v.optional(v.string()),
    }))),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const broadcastId = await ctx.db.insert("emergencyBroadcasts", {
      message: args.message,
      sourceLanguage: args.sourceLanguage,
      translations: args.translations || [],
      location: args.location,
      urgencyLevel: args.urgencyLevel,
      category: args.category,
      broadcasterId: args.broadcasterId,
      timestamp: Date.now(),
      expiresAt: args.expiresAt,
      isActive: true,
      reachCount: 0,
      acknowledgedBy: [],
    });

    return {
      id: broadcastId,
      message: "Emergency broadcast created successfully!",
      timestamp: Date.now(),
    };
  },
});

// Get active emergency broadcasts by location
export const getActiveEmergencyBroadcasts = query({
  args: {
    location: v.optional(v.string()),
    urgencyLevel: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("emergencyBroadcasts")
      .withIndex("by_active", (q) => q.eq("isActive", true));
    
    const broadcasts = await query.order("desc").take(50);
    
    // Filter by location and urgency if specified
    let filtered = broadcasts;
    
    if (args.location) {
      filtered = filtered.filter(b => 
        b.location === args.location || 
        b.location === "general" ||
        args.location === "general"
      );
    }
    
    if (args.urgencyLevel) {
      filtered = filtered.filter(b => b.urgencyLevel >= args.urgencyLevel!);
    }
    
    // Filter out expired broadcasts
    const now = Date.now();
    filtered = filtered.filter(b => !b.expiresAt || b.expiresAt > now);
    
    return filtered.sort((a, b) => b.urgencyLevel - a.urgencyLevel);
  },
});

// Acknowledge emergency broadcast
export const acknowledgeEmergencyBroadcast = mutation({
  args: {
    broadcastId: v.id("emergencyBroadcasts"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) {
      throw new Error("Broadcast not found");
    }

    const acknowledgedBy = broadcast.acknowledgedBy || [];
    if (!acknowledgedBy.includes(args.userId)) {
      await ctx.db.patch(args.broadcastId, {
        acknowledgedBy: [...acknowledgedBy, args.userId],
        reachCount: (broadcast.reachCount || 0) + 1,
      });
    }

    return {
      message: "Emergency broadcast acknowledged",
      timestamp: Date.now(),
    };
  },
});

// Update emergency phrase usage
export const updatePhraseUsage = mutation({
  args: {
    phraseId: v.id("emergencyPhrases"),
  },
  handler: async (ctx, args) => {
    const phrase = await ctx.db.get(args.phraseId);
    if (phrase) {
      await ctx.db.patch(args.phraseId, {
        usageCount: (phrase.usageCount || 0) + 1,
        lastUsed: Date.now(),
      });
    }

    return {
      message: "Phrase usage updated",
      timestamp: Date.now(),
    };
  },
});

// Get emergency statistics
export const getEmergencyStats = query({
  args: {},
  handler: async (ctx) => {
    const phrases = await ctx.db.query("emergencyPhrases").collect();
    const broadcasts = await ctx.db.query("emergencyBroadcasts").collect();
    const activeBroadcasts = broadcasts.filter(b => b.isActive);

    return {
      totalPhrases: phrases.length,
      phrasesByCategory: phrases.reduce((acc, phrase) => {
        acc[phrase.category] = (acc[phrase.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      phrasesByLanguage: phrases.reduce((acc, phrase) => {
        acc[phrase.language] = (acc[phrase.language] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalBroadcasts: broadcasts.length,
      activeBroadcasts: activeBroadcasts.length,
      broadcastsByUrgency: broadcasts.reduce((acc, broadcast) => {
        acc[broadcast.urgencyLevel] = (acc[broadcast.urgencyLevel] || 0) + 1;
        return acc;
      }, {} as Record<number, number>),
      mostUsedPhrases: phrases
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 5)
        .map(p => ({
          phrase: p.phrase,
          language: p.language,
          category: p.category,
          usageCount: p.usageCount || 0,
        })),
    };
  },
});

// Deactivate expired broadcasts (cleanup function)
export const deactivateExpiredBroadcasts = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const activeBroadcasts = await ctx.db
      .query("emergencyBroadcasts")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    let deactivatedCount = 0;
    
    for (const broadcast of activeBroadcasts) {
      if (broadcast.expiresAt && broadcast.expiresAt <= now) {
        await ctx.db.patch(broadcast._id, { isActive: false });
        deactivatedCount++;
      }
    }

    return {
      message: `Deactivated ${deactivatedCount} expired broadcasts`,
      deactivatedCount,
      timestamp: now,
    };
  },
});
