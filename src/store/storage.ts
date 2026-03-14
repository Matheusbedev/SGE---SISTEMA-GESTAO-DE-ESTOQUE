const KEYS = {
  produtos: 'sge:produtos',
  estoque: 'sge:estoque',
  movimentacoes: 'sge:movimentacoes',
  fornecedores: 'sge:fornecedores',
  alertas: 'sge:alertas',
  auth: 'sge:auth',
} as const;

export type StorageKey = keyof typeof KEYS;

function getKey(entity: StorageKey): string {
  return KEYS[entity];
}

export function getAll<T>(entity: StorageKey): T[] {
  try {
    const raw = localStorage.getItem(getKey(entity));
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export function saveAll<T>(entity: StorageKey, items: T[]): void {
  try {
    localStorage.setItem(getKey(entity), JSON.stringify(items));
  } catch (e) {
    console.error(`Failed to save ${entity}:`, e);
  }
}

export function getById<T extends { id: string }>(entity: StorageKey, id: string): T | null {
  const items = getAll<T>(entity);
  return items.find((item) => item.id === id) ?? null;
}

export function save<T extends { id: string }>(entity: StorageKey, item: T): void {
  const items = getAll<T>(entity);
  const idx = items.findIndex((i) => i.id === item.id);
  if (idx >= 0) {
    items[idx] = item;
  } else {
    items.push(item);
  }
  saveAll(entity, items);
}

export function remove(entity: StorageKey, id: string): void {
  const items = getAll<{ id: string }>(entity);
  saveAll(entity, items.filter((i) => i.id !== id));
}

export function clear(entity: StorageKey): void {
  localStorage.removeItem(getKey(entity));
}
