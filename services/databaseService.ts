import * as SQLite from 'expo-sqlite';

// Database configuration
const DATABASE_NAME = 'tamazight_translations.db';
const DATABASE_VERSION = 1;

// Translation history interface
export interface TranslationHistory {
  id?: number;
  inputText: string;
  outputText: string;
  fromLanguage: string;
  toLanguage: string;
  timestamp: number;
  isFavorite: boolean;
  translationMode: 'online' | 'offline';
  context?: 'emergency' | 'government' | 'general';
}

// User preferences interface
export interface UserPreferences {
  id?: number;
  preferredMode: 'online' | 'offline';
  lastUsedFromLanguage: string;
  lastUsedToLanguage: string;
  enableHaptics: boolean;
  enableAudio: boolean;
  updatedAt: number;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * Initialize the database connection and create tables
   */
  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      
      // Enable foreign keys
      await this.db.execAsync('PRAGMA foreign_keys = ON;');
      
      // Create tables
      await this.createTables();
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  /**
   * Create database tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Translation history table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS translation_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        input_text TEXT NOT NULL,
        output_text TEXT NOT NULL,
        from_language TEXT NOT NULL,
        to_language TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        is_favorite INTEGER DEFAULT 0,
        translation_mode TEXT NOT NULL,
        context TEXT DEFAULT 'general',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // User preferences table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        preferred_mode TEXT DEFAULT 'offline',
        last_used_from_language TEXT DEFAULT 'Arabic (العربية)',
        last_used_to_language TEXT DEFAULT 'Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)',
        enable_haptics INTEGER DEFAULT 1,
        enable_audio INTEGER DEFAULT 1,
        updated_at INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_translation_timestamp 
      ON translation_history(timestamp DESC);
    `);

    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_translation_favorite 
      ON translation_history(is_favorite);
    `);

    // Insert default preferences if none exist
    const prefsCount = await this.db.getFirstAsync(
      'SELECT COUNT(*) as count FROM user_preferences'
    ) as { count: number };

    if (prefsCount.count === 0) {
      await this.insertDefaultPreferences();
    }
  }

  /**
   * Insert default user preferences
   */
  private async insertDefaultPreferences(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(`
      INSERT INTO user_preferences (
        preferred_mode, 
        last_used_from_language, 
        last_used_to_language,
        enable_haptics,
        enable_audio,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, ['offline', 'Arabic (العربية)', 'Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)', 1, 1, Date.now()]);
  }

  /**
   * Save a translation to history
   */
  async saveTranslation(translation: Omit<TranslationHistory, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(`
      INSERT INTO translation_history (
        input_text, output_text, from_language, to_language, 
        timestamp, is_favorite, translation_mode, context
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      translation.inputText,
      translation.outputText,
      translation.fromLanguage,
      translation.toLanguage,
      translation.timestamp,
      translation.isFavorite ? 1 : 0,
      translation.translationMode,
      translation.context || 'general'
    ]);

    return result.lastInsertRowId;
  }

  /**
   * Get translation history with optional filtering
   */
  async getTranslationHistory(
    limit: number = 50,
    favoritesOnly: boolean = false,
    searchTerm?: string
  ): Promise<TranslationHistory[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = `
      SELECT 
        id, input_text, output_text, from_language, to_language,
        timestamp, is_favorite, translation_mode, context
      FROM translation_history
      WHERE 1=1
    `;
    const params: any[] = [];

    if (favoritesOnly) {
      query += ' AND is_favorite = 1';
    }

    if (searchTerm) {
      query += ' AND (input_text LIKE ? OR output_text LIKE ?)';
      const searchPattern = `%${searchTerm}%`;
      params.push(searchPattern, searchPattern);
    }

    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(limit);

    const rows = await this.db.getAllAsync(query, params) as any[];

    return rows.map(row => ({
      id: row.id,
      inputText: row.input_text,
      outputText: row.output_text,
      fromLanguage: row.from_language,
      toLanguage: row.to_language,
      timestamp: row.timestamp,
      isFavorite: row.is_favorite === 1,
      translationMode: row.translation_mode,
      context: row.context
    }));
  }

  /**
   * Toggle favorite status of a translation
   */
  async toggleFavorite(translationId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(`
      UPDATE translation_history 
      SET is_favorite = CASE WHEN is_favorite = 1 THEN 0 ELSE 1 END
      WHERE id = ?
    `, [translationId]);
  }

  /**
   * Delete a translation from history
   */
  async deleteTranslation(translationId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM translation_history WHERE id = ?', [translationId]);
  }

  /**
   * Clear all translation history
   */
  async clearHistory(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM translation_history');
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(): Promise<UserPreferences | null> {
    if (!this.db) throw new Error('Database not initialized');

    const row = await this.db.getFirstAsync(`
      SELECT 
        id, preferred_mode, last_used_from_language, last_used_to_language,
        enable_haptics, enable_audio, updated_at
      FROM user_preferences 
      ORDER BY id DESC 
      LIMIT 1
    `) as any;

    if (!row) return null;

    return {
      id: row.id,
      preferredMode: row.preferred_mode,
      lastUsedFromLanguage: row.last_used_from_language,
      lastUsedToLanguage: row.last_used_to_language,
      enableHaptics: row.enable_haptics === 1,
      enableAudio: row.enable_audio === 1,
      updatedAt: row.updated_at
    };
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const updates: string[] = [];
    const params: any[] = [];

    if (preferences.preferredMode !== undefined) {
      updates.push('preferred_mode = ?');
      params.push(preferences.preferredMode);
    }

    if (preferences.lastUsedFromLanguage !== undefined) {
      updates.push('last_used_from_language = ?');
      params.push(preferences.lastUsedFromLanguage);
    }

    if (preferences.lastUsedToLanguage !== undefined) {
      updates.push('last_used_to_language = ?');
      params.push(preferences.lastUsedToLanguage);
    }

    if (preferences.enableHaptics !== undefined) {
      updates.push('enable_haptics = ?');
      params.push(preferences.enableHaptics ? 1 : 0);
    }

    if (preferences.enableAudio !== undefined) {
      updates.push('enable_audio = ?');
      params.push(preferences.enableAudio ? 1 : 0);
    }

    if (updates.length === 0) return;

    updates.push('updated_at = ?');
    params.push(Date.now());

    await this.db.runAsync(`
      UPDATE user_preferences 
      SET ${updates.join(', ')}
      WHERE id = (SELECT id FROM user_preferences ORDER BY id DESC LIMIT 1)
    `, params);
  }

  /**
   * Get database statistics
   */
  async getStatistics(): Promise<{
    totalTranslations: number;
    favoriteTranslations: number;
    onlineTranslations: number;
    offlineTranslations: number;
  }> {
    if (!this.db) throw new Error('Database not initialized');

    const stats = await this.db.getFirstAsync(`
      SELECT 
        COUNT(*) as total_translations,
        SUM(CASE WHEN is_favorite = 1 THEN 1 ELSE 0 END) as favorite_translations,
        SUM(CASE WHEN translation_mode = 'online' THEN 1 ELSE 0 END) as online_translations,
        SUM(CASE WHEN translation_mode = 'offline' THEN 1 ELSE 0 END) as offline_translations
      FROM translation_history
    `) as any;

    return {
      totalTranslations: stats.total_translations || 0,
      favoriteTranslations: stats.favorite_translations || 0,
      onlineTranslations: stats.online_translations || 0,
      offlineTranslations: stats.offline_translations || 0
    };
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
