import { query } from "./_generated/server";

// Simple test query to verify Convex connection
export const hello = query({
  args: {},
  handler: async () => {
    return {
      message: "🚀 Convex is connected to Tamazight MultiLingo App!",
      timestamp: Date.now(),
      status: "success"
    };
  },
});

// Test query for emergency communication
export const emergencyStatus = query({
  args: {},
  handler: async () => {
    return {
      message: "Emergency communication system ready! 🆘",
      features: [
        "Real-time translation sync",
        "Emergency broadcasting",
        "Offline-to-online sync",
        "Cultural preservation database"
      ],
      timestamp: Date.now()
    };
  },
});
