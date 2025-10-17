"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronDown, 
  ChevronRight, 
  Code, 
  Play, 
  CheckCircle, 
  XCircle,
  Clock,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FunctionCall {
  name: string
  arguments: Record<string, unknown>
  result?: unknown
  status?: 'pending' | 'success' | 'error'
  execution_time?: number
}

interface FunctionCallDisplayProps {
  functionCalls: FunctionCall[]
  className?: string
}

export function FunctionCallDisplay({ 
  functionCalls, 
  className 
}: FunctionCallDisplayProps) {
  const [expandedCalls, setExpandedCalls] = useState<Set<number>>(new Set())

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedCalls)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedCalls(newExpanded)
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
      default:
        return <Play className="w-4 h-4 text-blue-500" />
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">Выполнено</Badge>
      case 'error':
        return <Badge variant="destructive">Ошибка</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Выполняется</Badge>
      default:
        return <Badge variant="outline">Готово к выполнению</Badge>
    }
  }

  if (!functionCalls || functionCalls.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Zap className="w-4 h-4" />
        <span>Function Calls ({functionCalls.length})</span>
      </div>
      
      {functionCalls.map((call, index) => {
        const isExpanded = expandedCalls.has(index)
        
        return (
          <Card key={index} className="p-3">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <Code className="w-4 h-4 text-primary" />
                <span className="font-mono text-sm font-medium">
                  {call.name}
                </span>
                {getStatusIcon(call.status)}
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(call.status)}
                {call.execution_time && (
                  <span className="text-xs text-muted-foreground">
                    {call.execution_time}ms
                  </span>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="mt-3 space-y-3">
                {/* Аргументы функции */}
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">
                    Аргументы:
                  </h4>
                  <div className="bg-muted/50 rounded-md p-2">
                    <pre className="text-xs font-mono overflow-x-auto">
                      {JSON.stringify(call.arguments, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Результат выполнения */}
                {call.result !== undefined && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">
                      Результат:
                    </h4>
                    <div className={cn(
                      "rounded-md p-2",
                      call.status === 'error' 
                        ? "bg-red-500/10 border border-red-500/20" 
                        : "bg-green-500/10 border border-green-500/20"
                    )}>
                      <pre className="text-xs font-mono overflow-x-auto">
                        {typeof call.result === 'string' 
                          ? call.result 
                          : JSON.stringify(call.result, null, 2)
                        }
                      </pre>
                    </div>
                  </div>
                )}

                {/* Информация о функции */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Function: {call.name}</span>
                  {call.execution_time && (
                    <span>Время выполнения: {call.execution_time}ms</span>
                  )}
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
