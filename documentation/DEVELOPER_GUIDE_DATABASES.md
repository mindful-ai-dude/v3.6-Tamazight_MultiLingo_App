# 👩‍💻 Developer Guide: Dual Database System

## 🎯 **Quick Overview for Developers**

The Tamazight MultiLingo app uses **TWO databases simultaneously** to ensure reliable emergency communication:

```
📱 LOCAL (SQLite)     🌐 CLOUD (Convex)
├─ Instant access     ├─ Real-time sync
├─ Works offline      ├─ Collaborative
├─ Emergency ready    ├─ Community features
└─ Battery efficient  └─ Cultural preservation
```

## 🔧 **How to Use Both Databases**

### **1. For Emergency Translations (Offline-First)**

```typescript
// ALWAYS try SQLite first for emergency phrases
const emergencyPhrase = await databaseService.getEmergencyPhrase({
  language: 'tamazight',
  category: 'medical'
});

// If online, also save to Convex for community
if (isOnline) {
  await convex.mutation(api.emergency.updatePhraseUsage, {
    phraseId: emergencyPhrase.id
  });
}
```

### **2. For New Translations (Dual-Save)**

```typescript
const saveTranslation = async (translationData) => {
  // 1. ALWAYS save to SQLite first (instant, reliable)
  const localId = await databaseService.saveTranslation(translationData);
  
  // 2. If online, save to Convex (real-time sharing)
  if (isOnline) {
    try {
      const convexId = await convex.mutation(api.translations.saveTranslation, translationData);
      // Link local and cloud records
      await databaseService.updateConvexId(localId, convexId);
    } catch (error) {
      // Queue for later sync if Convex fails
      await databaseService.queueForSync({
        action: 'create_translation',
        data: translationData,
        priority: translationData.isEmergency ? 10 : 5
      });
    }
  } else {
    // Offline: queue for sync when connectivity returns
    await databaseService.queueForSync({
      action: 'create_translation', 
      data: translationData,
      priority: translationData.isEmergency ? 10 : 5
    });
  }
};
```

### **3. For Real-time Features (Convex-First)**

```typescript
// Real-time translation feed (only when online)
const TranslationFeed = () => {
  const recentTranslations = useQuery(api.translations.getRecentTranslations);
  
  if (!isOnline) {
    // Fallback to cached translations from SQLite
    const [cachedTranslations, setCachedTranslations] = useState([]);
    
    useEffect(() => {
      databaseService.getCachedTranslations().then(setCachedTranslations);
    }, []);
    
    return <CachedTranslationList translations={cachedTranslations} />;
  }
  
  return <LiveTranslationFeed translations={recentTranslations} />;
};
```

## 📊 **Database Decision Matrix**

| Use Case | SQLite | Convex | Both |
|----------|--------|--------|------|
| Emergency phrases | ✅ Primary | ⚪ Optional | 🔄 Sync |
| New translations | ✅ Cache | ✅ Share | ✅ Always |
| User preferences | ✅ Only | ❌ No | ❌ Local only |
| Real-time feed | ❌ No | ✅ Only | ❌ Online only |
| Community verification | ❌ No | ✅ Only | ❌ Online only |
| Cultural content | ✅ Cache | ✅ Source | 🔄 Sync |
| Offline queue | ✅ Only | ❌ No | ❌ Local only |

## 🔄 **Sync Strategy Implementation**

### **Automatic Sync on Connectivity**

```typescript
// Monitor connectivity and sync when restored
export const useConnectivitySync = () => {
  const [isOnline, setIsOnline] = useState(false);
  
  useEffect(() => {
    const handleConnectivityChange = async (state) => {
      setIsOnline(state.isConnected);
      
      if (state.isConnected) {
        // Connectivity restored - sync offline queue
        await syncOfflineQueue();
      }
    };
    
    NetInfo.addEventListener(handleConnectivityChange);
  }, []);
  
  const syncOfflineQueue = async () => {
    const queuedItems = await databaseService.getOfflineQueue();
    
    for (const item of queuedItems) {
      try {
        switch (item.action_type) {
          case 'create_translation':
            await convex.mutation(api.translations.saveTranslation, JSON.parse(item.data));
            break;
          case 'emergency_broadcast':
            await convex.mutation(api.emergency.createEmergencyBroadcast, JSON.parse(item.data));
            break;
        }
        
        await databaseService.markQueueItemProcessed(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item.id, error);
        await databaseService.incrementRetryCount(item.id);
      }
    }
  };
};
```

## 🆘 **Emergency Mode Implementation**

### **Instant Emergency Access**

```typescript
// Emergency mode prioritizes SQLite for instant access
export const useEmergencyMode = () => {
  const [emergencyPhrases, setEmergencyPhrases] = useState([]);
  
  useEffect(() => {
    // Pre-load critical emergency phrases on app start
    const loadEmergencyPhrases = async () => {
      const phrases = await databaseService.getEmergencyPhrases({
        priority: 8, // High priority only
        limit: 20
      });
      setEmergencyPhrases(phrases);
    };
    
    loadEmergencyPhrases();
  }, []);
  
  const broadcastEmergency = async (message, location, urgency) => {
    // 1. Immediate local storage
    await databaseService.saveEmergencyBroadcast({
      message,
      location, 
      urgency,
      timestamp: Date.now()
    });
    
    // 2. Try immediate Convex broadcast
    if (isOnline) {
      try {
        await convex.mutation(api.emergency.createEmergencyBroadcast, {
          message,
          location,
          urgencyLevel: urgency,
          broadcasterId: userId
        });
      } catch (error) {
        // Queue for retry if broadcast fails
        await databaseService.queueForSync({
          action: 'emergency_broadcast',
          data: { message, location, urgencyLevel: urgency },
          priority: 10 // Highest priority
        });
      }
    }
  };
  
  return { emergencyPhrases, broadcastEmergency };
};
```

## 📱 **Performance Best Practices**

### **1. SQLite Optimization**

```typescript
// Use indexes for fast queries
await databaseService.query(`
  SELECT * FROM cached_translations 
  WHERE source_language = ? AND target_language = ?
  ORDER BY created_at DESC LIMIT 50
`, [sourceLanguage, targetLanguage]);

// Batch operations for better performance
await databaseService.batchInsert('cached_translations', translationsArray);
```

### **2. Convex Optimization**

```typescript
// Use specific indexes for fast queries
const translations = useQuery(api.translations.getTranslationHistory, {
  sourceLanguage: 'english',
  targetLanguage: 'tamazight',
  limit: 50
});

// Paginate large datasets
const paginatedResults = usePaginatedQuery(
  api.translations.getRecentTranslations,
  { limit: 20 },
  { initialNumItems: 20 }
);
```

## 🔍 **Debugging Database Issues**

### **Check Database Status**

```typescript
// Debug helper to check both databases
export const debugDatabaseStatus = async () => {
  console.log('=== DATABASE STATUS ===');
  
  // SQLite status
  const sqliteStats = await databaseService.getStats();
  console.log('SQLite:', {
    translations: sqliteStats.translationCount,
    emergencyPhrases: sqliteStats.emergencyPhraseCount,
    queuedItems: sqliteStats.queuedItemCount
  });
  
  // Convex status (if online)
  if (isOnline) {
    const convexStats = await convex.query(api.translations.getTranslationStats);
    console.log('Convex:', convexStats);
  }
  
  console.log('===================');
};
```

### **Sync Status Monitoring**

```typescript
// Monitor sync queue status
export const useSyncStatus = () => {
  const [syncStatus, setSyncStatus] = useState({
    pending: 0,
    failed: 0,
    lastSync: null
  });
  
  useEffect(() => {
    const checkSyncStatus = async () => {
      const stats = await databaseService.getSyncStats();
      setSyncStatus(stats);
    };
    
    const interval = setInterval(checkSyncStatus, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return syncStatus;
};
```

## 🎯 **Key Takeaways for Developers**

### **✅ DO:**
- Always save emergency data to SQLite first
- Use Convex for real-time collaborative features
- Implement proper error handling for network failures
- Queue failed operations for retry
- Pre-cache critical emergency phrases

### **❌ DON'T:**
- Rely only on Convex for emergency features
- Block UI waiting for network operations
- Forget to handle offline scenarios
- Skip local caching for frequently accessed data
- Ignore sync queue management

### **🚀 Result:**
A robust, reliable emergency communication app that works perfectly in both connected and disconnected scenarios - exactly what's needed for disaster situations in remote Moroccan regions!

---

**💡 Remember: SQLite ensures the app ALWAYS works, Convex makes it COLLABORATIVE!**
