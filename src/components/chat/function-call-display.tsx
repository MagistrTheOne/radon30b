"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronRight,
  Code,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface FunctionCall {
  name: string
  arguments: Record<string, unknown>
  result?: unknown
  status?: "pending" | "success" | "error"
  execution_time?: number
}

interface FunctionCallDisplayProps {
  functionCalls: FunctionCall[]
  className?: string
}

export function FunctionCallDisplay({ functionCalls, className }: FunctionCallDisplayProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const n = new Set(prev)
      n.has(i) ? n.delete(i) : n.add(i)
      return n
    })
  }

  const icon = {
    success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    error: <XCircle className="w-4 h-4 text-rose-500" />,
    pending: <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />,
    default: <Play className="w-4 h-4 text-blue-500" />,
  }

  const badge = {
    success: (
      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
        Выполнено
      </Badge>
    ),
    error: <Badge variant="destructive">Ошибка</Badge>,
    pending: (
      <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
        Выполняется
      </Badge>
    ),
    default: <Badge variant="outline">Готово</Badge>,
  }

  if (!functionCalls?.length) return null

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Zap className="w-4 h-4" />
        <span>Function Calls ({functionCalls.length})</span>
      </div>

      {functionCalls.map((call, i) => {
        const open = expanded.has(i)
        const st = call.status ?? "default"

        return (
          <Card
            key={i}
            className={cn(
              "p-3 bg-card/60 backdrop-blur-sm border-border/40 transition-all duration-300",
              open && "ring-1 ring-primary/10"
            )}
          >
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggle(i)}
            >
              <div className="flex items-center gap-2">
                {open ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <Code className="w-4 h-4 text-primary" />
                <span className="font-mono text-sm font-medium">{call.name}</span>
                {icon[st as keyof typeof icon]}
              </div>

              <div className="flex items-center gap-2">
                {badge[st as keyof typeof badge]}
                {call.execution_time && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {call.execution_time} ms
                  </span>
                )}
              </div>
            </div>

            <div
              className={cn(
                "grid transition-all overflow-hidden",
                open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden space-y-3">
                <section>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">
                    Аргументы:
                  </h4>
                  <pre className="bg-muted/40 rounded-md p-2 text-xs font-mono whitespace-pre-wrap break-all">
                    {JSON.stringify(call.arguments, null, 2)}
                  </pre>
                </section>

                {call.result !== undefined && (
                  <section>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">
                      Результат:
                    </h4>
                    <pre
                      className={cn(
                        "rounded-md p-2 text-xs font-mono whitespace-pre-wrap break-all",
                        call.status === "error"
                          ? "bg-rose-500/10 border border-rose-500/20"
                          : "bg-emerald-500/10 border border-emerald-500/20"
                      )}
                    >
                      {typeof call.result === "string"
                        ? call.result
                        : JSON.stringify(call.result, null, 2)}
                    </pre>
                  </section>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Function: {call.name}</span>
                  {call.execution_time && (
                    <span>{call.execution_time} ms</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
