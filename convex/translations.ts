import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get recent translations with real-time updates
export const getRecentTranslations = query({
  args: {
    limit: v.optional(v.number()),
    context: v.optional(v.union(v.literal("emergency"), v.literal("government"), v.literal("general"), v.literal("cultural"))),
  },
  handler: async (ctx, args) => {
    let results;

    if (args.context) {
      results = await ctx.db
        .query("translations")
        .withIndex("by_context", (q) => q.eq("context", args.context!))
        .order("desc")
        .take(args.limit ?? 50);
    } else {
      results = await ctx.db
        .query("translations")
        .order("desc")
        .take(args.limit ?? 50);
    }

    return results;
  },
});

// Get translations by language pair
export const getTranslationHistory = query({
  args: {
    sourceLanguage: v.union(v.literal("tamazight"), v.literal("arabic"), v.literal("french"), v.literal("english")),
    targetLanguage: v.union(v.literal("tamazight"), v.literal("arabic"), v.literal("french"), v.literal("english")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("translations")
      .withIndex("by_source_language", (q) =>
        q.eq("sourceLanguage", args.sourceLanguage)
      )
      .filter((q) => q.eq(q.field("targetLanguage"), args.targetLanguage))
      .order("desc")
      .take(args.limit ?? 100);
  },
});

// Get user's personal translation history
export const getUserTranslationHistory = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("translations")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 100);
  },
});

// Get emergency translations (high priority)
export const getEmergencyTranslations = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("translations")
      .withIndex("by_emergency", (q) => q.eq("isEmergency", true))
      .order("desc")
      .take(args.limit ?? 20);
  },
});

// Save new translation with real-time sync
export const saveTranslation = mutation({
  args: {
    sourceText: v.string(),
    sourceLanguage: v.union(v.literal("tamazight"), v.literal("arabic"), v.literal("french"), v.literal("english")),
    targetLanguage: v.union(v.literal("tamazight"), v.literal("arabic"), v.literal("french"), v.literal("english")),
    translatedText: v.string(),
    translationMethod: v.union(v.literal("gemini"), v.literal("tflite"), v.literal("user"), v.literal("community")),
    context: v.optional(v.union(v.literal("emergency"), v.literal("government"), v.literal("general"), v.literal("cultural"))),
    userId: v.optional(v.string()),
    confidence: v.optional(v.number()),
    region: v.optional(v.string()),
    tifinghScript: v.optional(v.string()),
    isEmergency: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const translationId = await ctx.db.insert("translations", {
      sourceText: args.sourceText,
      sourceLanguage: args.sourceLanguage,
      targetLanguage: args.targetLanguage,
      translatedText: args.translatedText,
      translationMethod: args.translationMethod,
      context: args.context,
      userId: args.userId,
      timestamp: Date.now(),
      isVerified: false,
      verificationCount: 0,
      confidence: args.confidence,
      region: args.region,
      tifinghScript: args.tifinghScript,
      isEmergency: args.isEmergency ?? false,
    });

    return {
      id: translationId,
      message: "Translation saved successfully!",
      timestamp: Date.now(),
    };
  },
});

// Verify translation (community verification)
export const verifyTranslation = mutation({
  args: {
    translationId: v.id("translations"),
    userId: v.string(),
    isCorrect: v.boolean(),
    suggestedImprovement: v.optional(v.string()),
    expertise: v.optional(v.union(v.literal("native_speaker"), v.literal("linguist"), v.literal("emergency_responder"), v.literal("community_member"))),
  },
  handler: async (ctx, args) => {
    // Add verification record
    await ctx.db.insert("translationVerifications", {
      translationId: args.translationId,
      userId: args.userId,
      isCorrect: args.isCorrect,
      suggestedImprovement: args.suggestedImprovement,
      expertise: args.expertise,
      timestamp: Date.now(),
    });

    // Update translation verification count
    const translation = await ctx.db.get(args.translationId);
    if (translation) {
      const currentCount = translation.verificationCount || 0;
      await ctx.db.patch(args.translationId, {
        verificationCount: currentCount + 1,
        isVerified: currentCount + 1 >= 3, // Verified after 3 confirmations
      });
    }

    return {
      message: "Translation verification recorded!",
      timestamp: Date.now(),
    };
  },
});

// Search translations by text
export const searchTranslations = query({
  args: {
    searchText: v.string(),
    language: v.optional(v.union(v.literal("tamazight"), v.literal("arabic"), v.literal("french"), v.literal("english"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results;

    if (args.language) {
      results = await ctx.db
        .query("translations")
        .withIndex("by_source_language", (q) =>
          q.eq("sourceLanguage", args.language!)
        )
        .take(args.limit ?? 50);
    } else {
      results = await ctx.db.query("translations").take(args.limit ?? 50);
    }

    // Simple text search (in production, you'd use Convex's search features)
    return results.filter(translation =>
      translation.sourceText.toLowerCase().includes(args.searchText.toLowerCase()) ||
      translation.translatedText.toLowerCase().includes(args.searchText.toLowerCase())
    );
  },
});

// Get translations by region (for dialect variations)
export const getTranslationsByRegion = query({
  args: {
    region: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("translations")
      .withIndex("by_region", (q) => q.eq("region", args.region))
      .order("desc")
      .take(args.limit ?? 30);
  },
});

// Get translation statistics
export const getTranslationStats = query({
  args: {},
  handler: async (ctx) => {
    const allTranslations = await ctx.db.query("translations").collect();
    
    const stats = {
      total: allTranslations.length,
      verified: allTranslations.filter(t => t.isVerified).length,
      emergency: allTranslations.filter(t => t.isEmergency).length,
      byLanguage: {} as Record<string, number>,
      byMethod: {} as Record<string, number>,
      byRegion: {} as Record<string, number>,
    };

    // Calculate statistics
    allTranslations.forEach(translation => {
      // By source language
      stats.byLanguage[translation.sourceLanguage] = 
        (stats.byLanguage[translation.sourceLanguage] || 0) + 1;
      
      // By translation method
      stats.byMethod[translation.translationMethod] = 
        (stats.byMethod[translation.translationMethod] || 0) + 1;
      
      // By region
      if (translation.region) {
        stats.byRegion[translation.region] = 
          (stats.byRegion[translation.region] || 0) + 1;
      }
    });

    return stats;
  },
});
