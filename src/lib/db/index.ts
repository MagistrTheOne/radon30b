import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Create the connection
const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

// Create postgres client with optimized connection pool
const client = postgres(connectionString, {
  prepare: false,
  max: 20, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
  ssl: 'require', // Require SSL for production
  transform: {
    undefined: null, // Transform undefined to null
  },
  onnotice: process.env.NODE_ENV === 'development' ? console.log : undefined,
})

// Create drizzle instance
export const db = drizzle(client, { 
  schema,
  logger: process.env.NODE_ENV === 'development'
})

// Export schema for convenience
export * from './schema'

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Closing database connections...')
  await client.end()
  console.log('✅ Database connections closed')
})

process.on('SIGTERM', async () => {
  console.log('🔄 Closing database connections...')
  await client.end()
  console.log('✅ Database connections closed')
})
