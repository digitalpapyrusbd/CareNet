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
};
