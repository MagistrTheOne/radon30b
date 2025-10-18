
import axios from 'axios'

// Для Next.js API routes используем относительные пути
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  // Token will be added by Clerk middleware
  return config
})

// Для Next.js API routes используем fetch вместо axios
export const nextApiClient = {
  get: async <T>(url: string): Promise<{ data: T }> => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Request failed')
    }
    
    const data = await response.json()
    return { data }
  },
  
  post: async <T>(url: string, body?: unknown): Promise<{ data: T }> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Request failed')
    }
    
    const data = await response.json()
    return { data }
  },
  
  put: async <T>(url: string, body?: unknown): Promise<{ data: T }> => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Request failed')
    }
    
    const data = await response.json()
    return { data }
  },
  
  delete: async (url: string): Promise<void> => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Request failed')
    }
  }
}

export default apiClient
