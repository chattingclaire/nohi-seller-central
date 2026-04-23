"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type OnboardingStep = 
  | "welcome"
  | "syncing"
  | "sync-complete"
  | "generating"
  | "generation-complete"
  | "theme-setup"
  | "theme-confirmed"
  | "brand-context"
  | "channel-control"
  | "analytics"
  | "complete"
  | null

interface OnboardingContextType {
  currentStep: OnboardingStep
  setCurrentStep: (step: OnboardingStep) => void
}

const OnboardingContext = createContext<OnboardingContextType>({
  currentStep: null,
  setCurrentStep: () => {},
})

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(null)

  return (
    <OnboardingContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  return useContext(OnboardingContext)
}
