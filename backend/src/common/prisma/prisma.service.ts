import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool | null = null;

  constructor() {
    try {
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set');
      }

      // Check if DATABASE_URL is PostgreSQL (not SQLite)
      const databaseUrl = process.env.DATABASE_URL;
      const isPostgreSQL = databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://');

      if (isPostgreSQL) {
        // Use PostgreSQL adapter for Prisma 7
        const pool = new Pool({ connectionString: databaseUrl });
        const adapter = new PrismaPg(pool);
        
        super({
          adapter,
          log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        });
        
        // Assign pool after super() call
        this.pool = pool;
      } else {
        // For SQLite, Prisma 7 handles it differently
        // SQLite doesn't need an adapter in the same way
        super({
          log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        });
      }
    } catch (error) {
      console.error('PrismaService constructor error:', error);
      throw error;
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    // Close the PostgreSQL pool if it exists
    if (this.pool) {
      await this.pool.end();
    }
  }

  /**
   * Clean database for testing purposes
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) =>
        typeof key === 'string' && key[0] !== '_' && key !== 'constructor',
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as keyof this];
        if (model && typeof model === 'object' && 'deleteMany' in model) {
          return (model as any).deleteMany();
        }
      }),
    );
  }
}
