import Redis from 'ioredis'

// Redis client configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
}

// Create Redis client
export const redis = new Redis(redisConfig)

// Event channels for pub/sub
export const CHANNELS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  MESSAGE_SENT: 'message.sent',
  MESSAGE_UPDATED: 'message.updated',
  MESSAGE_DELETED: 'message.deleted',
  CHAT_CREATED: 'chat.created',
  CHAT_UPDATED: 'chat.updated',
  CHAT_DELETED: 'chat.deleted',
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  SUBSCRIPTION_DELETED: 'subscription.deleted',
  FILE_UPLOADED: 'file.uploaded',
  FILE_DELETED: 'file.deleted',
} as const

// Redis pub/sub helper functions
export class RedisPubSub {
  private publisher: Redis
  private subscriber: Redis

  constructor() {
    this.publisher = new Redis(redisConfig)
    this.subscriber = new Redis(redisConfig)
  }

  // Publish event to channel
  async publish(channel: string, data: any): Promise<void> {
    try {
      await this.publisher.publish(channel, JSON.stringify(data))
    } catch (error) {
      console.error(`Error publishing to channel ${channel}:`, error)
    }
  }

  // Subscribe to channel
  async subscribe(channel: string, callback: (data: any) => void): Promise<void> {
    try {
      await this.subscriber.subscribe(channel)
      this.subscriber.on('message', (receivedChannel, message) => {
        if (receivedChannel === channel) {
          try {
            const data = JSON.parse(message)
            callback(data)
          } catch (error) {
            console.error(`Error parsing message from channel ${channel}:`, error)
          }
        }
      })
    } catch (error) {
      console.error(`Error subscribing to channel ${channel}:`, error)
    }
  }

  // Unsubscribe from channel
  async unsubscribe(channel: string): Promise<void> {
    try {
      await this.subscriber.unsubscribe(channel)
    } catch (error) {
      console.error(`Error unsubscribing from channel ${channel}:`, error)
    }
  }

  // Close connections
  async close(): Promise<void> {
    await Promise.all([
      this.publisher.quit(),
      this.subscriber.quit()
    ])
  }
}

// Cache helper functions
export class RedisCache {
  private client: Redis

  constructor() {
    this.client = redis
  }

  // Set cache with TTL
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value)
      if (ttlSeconds) {
        await this.client.setex(key, ttlSeconds, serialized)
      } else {
        await this.client.set(key, serialized)
      }
    } catch (error) {
      console.error(`Error setting cache key ${key}:`, error)
    }
  }

  // Get from cache
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error(`Error getting cache key ${key}:`, error)
      return null
    }
  }

  // Delete from cache
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key)
    } catch (error) {
      console.error(`Error deleting cache key ${key}:`, error)
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      console.error(`Error checking cache key ${key}:`, error)
      return false
    }
  }

  // Set multiple keys
  async mset(keyValuePairs: Record<string, any>): Promise<void> {
    try {
      const serializedPairs: string[] = []
      for (const [key, value] of Object.entries(keyValuePairs)) {
        serializedPairs.push(key, JSON.stringify(value))
      }
      await this.client.mset(...serializedPairs)
    } catch (error) {
      console.error('Error setting multiple cache keys:', error)
    }
  }

  // Get multiple keys
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await this.client.mget(...keys)
      return values.map(value => value ? JSON.parse(value) : null)
    } catch (error) {
      console.error('Error getting multiple cache keys:', error)
      return keys.map(() => null)
    }
  }
}

// Export instances
export const pubSub = new RedisPubSub()
export const cache = new RedisCache()

// Health check
export async function checkRedisHealth(): Promise<boolean> {
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error('Redis health check failed:', error)
    return false
  }
}

// Graceful shutdown
export async function closeRedisConnections(): Promise<void> {
  try {
    await Promise.all([
      redis.quit(),
      pubSub.close()
    ])
  } catch (error) {
    console.error('Error closing Redis connections:', error)
  }
}
