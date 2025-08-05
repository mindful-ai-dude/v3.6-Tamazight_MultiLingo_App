import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Core translation storage and real-time sync
  translations: defineTable({
    sourceText: v.string(),
    sourceLanguage: v.union(
      v.literal("tamazight"), 
      v.literal("arabic"), 
      v.literal("french"), 
      v.literal("english")
    ),
    targetLanguage: v.union(
      v.literal("tamazight"), 
      v.literal("arabic"), 
      v.literal("french"), 
      v.literal("english")
    ),
    translatedText: v.string(),
    translationMethod: v.union(
      v.literal("gemini"),     // Online AI translation
      v.literal("tflite"),     // Offline AI translation
      v.literal("user"),       // Human translation
      v.literal("community")   // Community verified
    ),
    context: v.optional(v.union(
      v.literal("emergency"),   // Emergency/medical context
      v.literal("government"),  // Official/legal context
      v.literal("general"),     // General conversation
      v.literal("cultural")     // Cultural/traditional context
    )),
    userId: v.optional(v.string()),
    timestamp: v.number(),
    isVerified: v.optional(v.boolean()),
    verificationCount: v.optional(v.number()),
    region: v.optional(v.string()), // Moroccan regional variants (Rif, Atlas, etc.)
    confidence: v.optional(v.number()), // AI confidence score 0-1
    audioUrl: v.optional(v.string()), // Pronunciation audio
    tifinghScript: v.optional(v.string()), // Tifinagh script version
    isEmergency: v.optional(v.boolean()), // Emergency priority flag
  })
    .index("by_source_language", ["sourceLanguage"])
    .index("by_target_language", ["targetLanguage"])
    .index("by_context", ["context"])
    .index("by_timestamp", ["timestamp"])
    .index("by_emergency", ["isEmergency"])
    .index("by_region", ["region"])
    .index("by_verification", ["isVerified"])
    .index("by_user_id", ["userId"]),

  // Emergency phrases for quick access during crises
  emergencyPhrases: defineTable({
    phrase: v.string(),
    language: v.string(),
    category: v.union(
      v.literal("medical"),      // Medical emergency
      v.literal("rescue"),       // Search and rescue
      v.literal("location"),     // Location/direction
      v.literal("safety"),       // Safety instructions
      v.literal("communication"), // Basic communication
      v.literal("earthquake"),   // Earthquake specific
      v.literal("flood"),        // Flood specific
      v.literal("fire")          // Fire emergency
    ),
    priority: v.number(), // 1-10 priority level
    audioUrl: v.optional(v.string()),
    tifinghScript: v.optional(v.string()),
    region: v.optional(v.string()),
    isOfficial: v.optional(v.boolean()), // Official emergency services phrase
    lastUsed: v.optional(v.number()),
    usageCount: v.optional(v.number()),
  })
    .index("by_language", ["language"])
    .index("by_category", ["category"])
    .index("by_priority", ["priority"])
    .index("by_region", ["region"]),

  // User sessions for real-time collaboration
  userSessions: defineTable({
    userId: v.string(),
    lastActive: v.number(),
    preferredLanguages: v.array(v.string()),
    location: v.optional(v.string()),
    isEmergencyResponder: v.optional(v.boolean()),
    currentMode: v.union(v.literal("online"), v.literal("offline")),
    deviceInfo: v.optional(v.string()),
    region: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_active", ["isActive"])
    .index("by_location", ["location"])
    .index("by_responder", ["isEmergencyResponder"]),

  // Real-time emergency broadcasts
  emergencyBroadcasts: defineTable({
    message: v.string(),
    sourceLanguage: v.string(),
    translations: v.array(v.object({
      language: v.string(),
      text: v.string(),
      audioUrl: v.optional(v.string()),
    })),
    location: v.string(),
    urgencyLevel: v.number(), // 1-5 urgency scale
    category: v.string(),
    broadcasterId: v.string(),
    timestamp: v.number(),
    expiresAt: v.optional(v.number()),
    isActive: v.boolean(),
    reachCount: v.optional(v.number()),
    acknowledgedBy: v.optional(v.array(v.string())),
  })
    .index("by_location", ["location"])
    .index("by_urgency", ["urgencyLevel"])
    .index("by_active", ["isActive"])
    .index("by_timestamp", ["timestamp"]),

  // Community translation verification
  translationVerifications: defineTable({
    translationId: v.id("translations"),
    userId: v.string(),
    isCorrect: v.boolean(),
    suggestedImprovement: v.optional(v.string()),
    expertise: v.optional(v.union(
      v.literal("native_speaker"),
      v.literal("linguist"),
      v.literal("emergency_responder"),
      v.literal("community_member")
    )),
    timestamp: v.number(),
    region: v.optional(v.string()),
  })
    .index("by_translation", ["translationId"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  // Cultural context and preservation
  culturalContext: defineTable({
    phrase: v.string(),
    language: v.string(),
    meaning: v.string(),
    culturalSignificance: v.string(),
    region: v.string(),
    occasion: v.optional(v.string()), // When it's used
    audioUrl: v.optional(v.string()),
    contributorId: v.string(),
    timestamp: v.number(),
    isVerified: v.optional(v.boolean()),
    category: v.union(
      v.literal("proverb"),
      v.literal("greeting"),
      v.literal("ceremony"),
      v.literal("traditional"),
      v.literal("historical")
    ),
  })
    .index("by_language", ["language"])
    .index("by_region", ["region"])
    .index("by_category", ["category"])
    .index("by_verified", ["isVerified"]),

  // Offline sync queue for when connectivity returns
  offlineSyncQueue: defineTable({
    userId: v.string(),
    action: v.union(
      v.literal("create_translation"),
      v.literal("verify_translation"),
      v.literal("emergency_broadcast"),
      v.literal("cultural_contribution")
    ),
    data: v.any(), // Flexible data storage for different action types
    timestamp: v.number(),
    priority: v.number(),
    processed: v.boolean(),
    retryCount: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_processed", ["processed"])
    .index("by_priority", ["priority"])
    .index("by_timestamp", ["timestamp"]),
});
