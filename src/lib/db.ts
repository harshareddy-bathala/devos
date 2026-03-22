type SQLDatabase = {
  select<T = unknown>(query: string, bindValues?: unknown[]): Promise<T[]>;
  execute(query: string, bindValues?: unknown[]): Promise<unknown>;
};

type SQLModule = {
  default?: {
    load: (connectionString: string) => Promise<SQLDatabase>;
  };
  Database?: {
    load: (connectionString: string) => Promise<SQLDatabase>;
  };
};

let databasePromise: Promise<SQLDatabase> | null = null;

async function createDatabaseConnection(): Promise<SQLDatabase> {
  const sqlModule = (await import('@tauri-apps/plugin-sql')) as unknown as SQLModule;
  const databaseLoader = sqlModule.default ?? sqlModule.Database;

  if (!databaseLoader?.load) {
    throw new Error('Tauri SQL plugin is not available.');
  }

  return databaseLoader.load('sqlite:devos.db');
}

export async function getDatabase(): Promise<SQLDatabase> {
  if (!databasePromise) {
    databasePromise = createDatabaseConnection();
  }

  return databasePromise;
}

export function safeJsonArray(input: string | null | undefined): string[] {
  if (!input) {
    return [];
  }

  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function toSqliteBool(value: boolean): number {
  return value ? 1 : 0;
}

export function fromSqliteBool(value: number): boolean {
  return value === 1;
}
