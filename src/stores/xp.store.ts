import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { LEVEL_THRESHOLDS } from '@/types';
import { getDatabase } from '@/lib/db';

interface XPState {
  totalXP: number;
  level: number;
  levelName: string;
  xpToNextLevel: number;
  isLoading: boolean;

  // Actions
  setXP: (xp: number) => void;
  addXP: (amount: number, reason: string, sourceId?: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

interface XPLogRow {
  id: string;
}

function shouldDedupe(reason: string, sourceId?: string): boolean {
  if (!sourceId) {
    return false;
  }

  return reason.startsWith('project_');
}

function calculateLevel(xp: number): { level: number; name: string; toNext: number } {
  let level = 0;
  let name = 'Novice';
  let nextThreshold = 250;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i].threshold) {
      level = i;
      name = LEVEL_THRESHOLDS[i].name;
      nextThreshold = LEVEL_THRESHOLDS[i + 1]?.threshold ?? Infinity;
    } else {
      break;
    }
  }

  return { level, name, toNext: nextThreshold - xp };
}

export const useXPStore = create<XPState>((set, get) => ({
  totalXP: 0,
  level: 0,
  levelName: 'Novice',
  xpToNextLevel: 250,
  isLoading: false,

  setXP: (xp: number) => {
    const { level, name, toNext } = calculateLevel(xp);
    set({
      totalXP: xp,
      level,
      levelName: name,
      xpToNextLevel: toNext,
    });
  },

  addXP: async (amount: number, reason: string, sourceId?: string) => {
    try {
      const db = await getDatabase();

      if (shouldDedupe(reason, sourceId)) {
        const existing = await db.select<XPLogRow>(
          'SELECT id FROM xp_log WHERE reason = ? AND source_id = ? LIMIT 1',
          [reason, sourceId]
        );

        if (existing.length > 0) {
          return false;
        }
      }

      const currentXP = get().totalXP;
      const newXP = currentXP + amount;

      // Optimistic update
      const { level, name, toNext } = calculateLevel(newXP);
      const previousLevel = get().level;

      set({
        totalXP: newXP,
        level,
        levelName: name,
        xpToNextLevel: toNext,
      });

      // Check for level up
      if (level > previousLevel) {
        console.log(`Level up! Now ${name} (Level ${level + 1})`);
      }

      await db.execute('UPDATE user_stats SET total_xp = ? WHERE id = 1', [newXP]);
      await db.execute(
        `INSERT INTO xp_log (id, amount, reason, source_type, source_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          nanoid(12),
          amount,
          reason,
          sourceId ? 'project' : 'system',
          sourceId ?? null,
          new Date().toISOString(),
        ]
      );

      return true;
    } catch (error) {
      console.error('Failed to add XP:', error);
      return false;
    }
  },

  refresh: async () => {
    set({ isLoading: true });

    try {
      const db = await getDatabase();
      const result = await db.select<{ total_xp: number }>(
        'SELECT total_xp FROM user_stats WHERE id = 1 LIMIT 1'
      );

      if (result.length > 0) {
        get().setXP(Number(result[0].total_xp) || 0);
      }
    } catch (error) {
      console.error('Failed to refresh XP:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
