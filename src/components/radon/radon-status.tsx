"use client"

import { useState, useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw,
  Cpu,
  Zap,
  AlertTriangle,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface RadonStatus {
  status: 'online' | 'offline' | 'loading' | 'error'
  model_loaded?: boolean
  gpu_available?: boolean
  response_time?: number
  last_check?: string
  error?: string
}

export function RadonStatus() {
  const [status, setStatus] = useState<RadonStatus>({ status: 'loading' })
  const [isChecking, setIsChecking] = useState(false)
  const [uptime, setUptime] = useState<number>(0)
  const uptimeInterval = useRef<NodeJS.Timeout | null>(null)

  const checkStatus = async () => {
    setIsChecking(true)
    try {
      const response = await fetch('/api/radon/health')
      const data = await response.json()

      if (response.ok) {
        setStatus({
          status: 'online',
          model_loaded: data.model_loaded,
          gpu_available: data.gpu_available,
          response_time: data.response_time,
          last_check: new Date().toLocaleTimeString()
        })
        toast.success('Radon AI подключен')
      } else {
        setStatus({
          status: 'error',
          error: data.error || 'Unknown error',
          last_check: new Date().toLocaleTimeString()
        })
        toast.error('Ошибка подключения к Radon AI')
      }
    } catch (error) {
      setStatus({
        status: 'offline',
        error: error instanceof Error ? error.message : 'Network error',
        last_check: new Date().toLocaleTimeString()
      })
      toast.error('Radon AI недоступен')
    } finally {
      setIsChecking(false)
    }
  }

  // Автообновление статуса каждые 60 секунд
  useEffect(() => {
    checkStatus()
    const interval = setInterval(() => checkStatus(), 60000)
    return () => clearInterval(interval)
  }, [])

  // Подсчёт uptime
  useEffect(() => {
    if (status.status === 'online') {
      if (!uptimeInterval.current) {
        uptimeInterval.current = setInterval(() => setUptime(prev => prev + 1), 1000)
      }
    } else {
      if (uptimeInterval.current) {
        clearInterval(uptimeInterval.current)
        uptimeInterval.current = null
      }
      setUptime(0)
    }
  }, [status.status])

  const getStatusIcon = () => {
    switch (status.status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
    }
  }

  const getStatusBadge = () => {
    switch (status.status) {
      case 'online':
        return <Badge className="bg-green-500 text-white">Online</Badge>
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>
      case 'error':
        return <Badge className="bg-yellow-500 text-white">Error</Badge>
      default:
        return <Badge variant="secondary">Checking...</Badge>
    }
  }

  const uptimeFormatted = () => {
    const minutes = Math.floor(uptime / 60)
    const seconds = uptime % 60
    return `${minutes}м ${seconds}с`
  }

  return (
    <Card className="p-4 bg-card/60 backdrop-blur-sm border border-border/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">Radon AI Status</span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button
            variant="ghost"
            size="icon"
            onClick={checkStatus}
            disabled={isChecking}
            className="h-6 w-6"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status.status === 'online' && (
          <motion.div
            key="online"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                <span>Model:</span>
              </div>
              <Badge variant={status.model_loaded ? "default" : "secondary"}>
                {status.model_loaded ? 'Loaded' : 'Loading'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>GPU:</span>
              </div>
              <Badge variant={status.gpu_available ? "default" : "secondary"}>
                {status.gpu_available ? 'Available' : 'Unavailable'}
              </Badge>
            </div>

            {status.response_time && (
              <div className="flex items-center justify-between">
                <span>Response:</span>
                <span className="text-muted-foreground">{status.response_time} ms</span>
              </div>
            )}

            <div className="flex items-center justify-between text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Uptime:</span>
              </div>
              <span>{uptimeFormatted()}</span>
            </div>
          </motion.div>
        )}

        {status.status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-yellow-500"
          >
            {status.error && <>Error: {status.error}</>}
          </motion.div>
        )}

        {status.status === 'offline' && (
          <motion.div
            key="offline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500"
          >
            {status.error && <>Offline: {status.error}</>}
          </motion.div>
        )}
      </AnimatePresence>

      {status.last_check && (
        <div className="text-xs text-muted-foreground mt-3 text-right">
          Последняя проверка: {status.last_check}
        </div>
      )}
    </Card>
  )
}
