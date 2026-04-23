"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type ChannelStatus = "active" | "inactive" | "disconnected" | "always-on" | "pro" | "coming"

interface ChannelState {
  [key: string]: ChannelStatus
}

interface ChannelStateContextType {
  channelStates: ChannelState
  setChannelStatus: (channelId: string, status: ChannelStatus) => void
  getChannelStatus: (channelId: string) => ChannelStatus
}

const defaultChannelStates: ChannelState = {
  "conversational-storefront": "coming",
  "chatgpt-acp": "always-on",
  "chatgpt-app": "pro",
  "gemini": "always-on",
  "google-ai": "always-on",
  "perplexity": "always-on",
  "reddit": "pro",
  "third-party": "active",
  "creator-agents": "pro",
  "copilot": "pro",
  "genspark": "pro",
  "kimi": "pro",
  "openclaw": "pro",
}

const ChannelStateContext = createContext<ChannelStateContextType | undefined>(undefined)

export function ChannelStateProvider({ children }: { children: ReactNode }) {
  const [channelStates, setChannelStates] = useState<ChannelState>(defaultChannelStates)

  const setChannelStatus = useCallback((channelId: string, status: ChannelStatus) => {
    setChannelStates(prev => ({
      ...prev,
      [channelId]: status
    }))
  }, [])

  const getChannelStatus = useCallback((channelId: string): ChannelStatus => {
    return channelStates[channelId] || "disconnected"
  }, [channelStates])

  return (
    <ChannelStateContext.Provider value={{ channelStates, setChannelStatus, getChannelStatus }}>
      {children}
    </ChannelStateContext.Provider>
  )
}

export function useChannelState() {
  const context = useContext(ChannelStateContext)
  if (context === undefined) {
    throw new Error("useChannelState must be used within a ChannelStateProvider")
  }
  return context
}
