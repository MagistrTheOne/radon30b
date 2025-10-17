import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Создаем подключение к PostgreSQL
const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

// Создаем клиент postgres
const client = postgres(connectionString, {
  prepare: false,
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
})

// Создаем Drizzle клиент
export const db = drizzle(client, { schema })

// Экспортируем схему для использования в других файлах
export * from './schema'
