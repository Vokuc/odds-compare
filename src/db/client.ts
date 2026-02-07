import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query(
  text: string,
  params?: unknown[]
): Promise<{ rows: any[]; rowCount: number | null }> {
  try {
    const client = getPool();
    const result = await client.query(text, params as any[]);
    return {
      rows: result.rows,
      rowCount: result.rowCount,
    };
  } catch (err: any) {
    console.error('DB query error:', err?.message || err);
    // Return empty result to allow app to continue rendering in dev
    return { rows: [], rowCount: 0 };
  }
}

export async function getClient() {
  const client = getPool();
  return client.connect();
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
