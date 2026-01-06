// Simple in-memory KV mock for development (replaces @vercel/kv)
const store = new Map<string, { value: string; expiresAt?: number }>();

export const kvMock = {
  get: async (key: string): Promise<string | null> => {
    const item = store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      store.delete(key);
      return null;
    }
    return item.value;
  },

  set: async (key: string, value: string, options?: { ex?: number }): Promise<void> => {
    store.set(key, {
      value,
      expiresAt: options?.ex ? Date.now() + options.ex * 1000 : undefined,
    });
  },

  del: async (key: string | string[]): Promise<number> => {
    const keys = Array.isArray(key) ? key : [key];
    let deleted = 0;
    for (const k of keys) {
      if (store.has(k)) {
        store.delete(k);
        deleted++;
      }
    }
    return deleted;
  },

  incr: async (key: string): Promise<number> => {
    const item = store.get(key);
    const current = item ? parseInt(item.value, 10) : 0;
    const newValue = current + 1;
    store.set(key, { value: String(newValue), expiresAt: item?.expiresAt });
    return newValue;
  },

  expire: async (key: string, seconds: number): Promise<number> => {
    const item = store.get(key);
    if (!item) return 0;
    item.expiresAt = Date.now() + seconds * 1000;
    return 1;
  },

  sadd: async (key: string, ...members: string[]): Promise<number> => {
    const item = store.get(key);
    let set: Set<string>;

    if (item) {
      try {
        const parsed = JSON.parse(item.value);
        if (Array.isArray(parsed)) {
          set = new Set(parsed);
        } else {
          set = new Set(); // Should not happen if strictly used as set
        }
      } catch {
        set = new Set();
      }
    } else {
      set = new Set();
    }

    let added = 0;
    for (const member of members) {
      if (!set.has(member)) {
        set.add(member);
        added++;
      }
    }

    store.set(key, { value: JSON.stringify(Array.from(set)), expiresAt: item?.expiresAt });
    return added;
  },

  srem: async (key: string, ...members: string[]): Promise<number> => {
    const item = store.get(key);
    if (!item) return 0;

    let set: Set<string>;
    try {
      const parsed = JSON.parse(item.value);
      if (Array.isArray(parsed)) {
        set = new Set(parsed);
      } else {
        return 0;
      }
    } catch {
      return 0;
    }

    let removed = 0;
    for (const member of members) {
      if (set.has(member)) {
        set.delete(member);
        removed++;
      }
    }

    store.set(key, { value: JSON.stringify(Array.from(set)), expiresAt: item.expiresAt });
    return removed;
  },

  smembers: async (key: string): Promise<string[]> => {
    const item = store.get(key);
    if (!item) return [];

    try {
      const parsed = JSON.parse(item.value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  }
};
