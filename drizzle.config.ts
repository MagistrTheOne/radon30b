import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  migrations: {
    prefix: 'timestamp',
  },
})