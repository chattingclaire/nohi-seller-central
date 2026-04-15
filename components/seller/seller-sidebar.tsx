"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useChannelState } from "@/lib/channel-state"
import { useLanguage } from "@/lib/language-context"
import { useOnboarding } from "@/lib/onboarding-context"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight, Home, Package, Layers, Radio, BarChart3 } from "lucide-react"

export function SellerSidebar() {
  const pathname = usePathname()
  const { getChannelStatus } = useChannelState()
  const { t, language } = useLanguage()
  const { currentStep } = useOnboarding()
  const isBrandContext = pathname.startsWith("/seller/brand-context")
  const isAgenticCatalog = pathname.startsWith("/seller/catalog")
  const isChannelControl = pathname.startsWith("/seller/channels")
  
  // Determine which nav item should glow based on onboarding step
  const shouldGlow = (navId: string) => {
    if (!currentStep) return false
    switch (navId) {
      case "catalog":
        return ["syncing", "sync-complete", "generating", "generation-complete", "theme-setup", "theme-confirmed"].includes(currentStep)
      case "brand-context":
        return currentStep === "brand-context"
      case "channel-control":
        return currentStep === "channel-control"
      case "analytics":
        return currentStep === "analytics"
      default:
        return false
    }
  }

  const brandContextSubPages = [
    { title: t("nav.details"), href: "/seller/brand-context/details" },
    { title: t("nav.guardrails"), href: "/seller/brand-context/guardrails" },
    { title: t("nav.visualStyle"), href: "/seller/brand-context/visual-style" },
    { title: t("nav.brandStory"), href: "/seller/brand-context/brand-story" },
    { title: t("nav.postsUgc"), href: "/seller/brand-context/posts-ugc" },
    { title: t("nav.fulfillment"), href: "/seller/brand-context/fulfillment" },
  ]

  const ownSupplyItems = [
    { title: t("nav.connectShop"), href: "/seller/catalog/connectors" },
  ]

  // Free channels
  const freeChannelItems = [
    { title: t("nav.conversationalStorefront"), href: "/seller/channels/conversational-storefront", id: "conversational-storefront" },
    { title: "Google AI Mode", href: "/seller/channels/google-ai", id: "google-ai" },
  ]

  // Other channel IDs for lookup
  const channelControlItems = [
    { title: "ChatGPT ACP", href: "/seller/channels/chatgpt-acp", id: "chatgpt-acp" },
    { title: "ChatGPT App", href: "/seller/channels/chatgpt-app", id: "chatgpt-app" },
    { title: "Gemini", href: "/seller/channels/gemini", id: "gemini" },
    { title: "Perplexity", href: "/seller/channels/perplexity", id: "perplexity" },
    { title: "Reddit DPA", href: "/seller/channels/reddit", id: "reddit" },
    { title: t("nav.thirdPartyAgents"), href: "/seller/channels/third-party", id: "third-party" },
    { title: t("nav.creatorAgents"), href: "/seller/channels/creator-agents", id: "creator-agents" },
    { title: "Microsoft Copilot", href: "/seller/channels/copilot", id: "copilot" },
    { title: "Genspark", href: "/seller/channels/genspark", id: "genspark" },
    { title: "Kimi", href: "/seller/channels/kimi", id: "kimi" },
    { title: "Openclaw", href: "/seller/channels/openclaw", id: "openclaw" },
  ]

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/seller" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground drop-shadow-sm">
            Nohi
          </span>
          <span className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-widest group-data-[collapsible=icon]:hidden">
            {t("nav.seller")}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Home */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/seller"}
                  tooltip={t("nav.home")}
                >
                  <Link href="/seller">
                    <Home className="size-4 shrink-0 hidden group-data-[collapsible=icon]:block" />
                    <span className="group-data-[collapsible=icon]:hidden">{t("nav.home")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Agentic Catalog - Collapsible */}
              <Collapsible
                defaultOpen={isAgenticCatalog}
                className="group/collapsible"
              >
                <SidebarMenuItem className={shouldGlow("catalog") ? "animate-nav-glow" : ""}>
                  {/* Icon link for collapsed state */}
                  <div className="hidden group-data-[collapsible=icon]:block">
                    <SidebarMenuButton
                      asChild
                      isActive={isAgenticCatalog}
                      tooltip={t("nav.agenticCatalog")}
                    >
                      <Link href="/seller/catalog/own-supply">
                        <Package className="size-4 shrink-0" />
                      </Link>
                    </SidebarMenuButton>
                  </div>
                  {/* Collapsible trigger for expanded state */}
                  <CollapsibleTrigger asChild className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuButton
                      isActive={isAgenticCatalog}
                      tooltip={t("nav.agenticCatalog")}
                    >
                      <span className="flex-1 truncate">{t("nav.agenticCatalog")}</span>
                      <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {ownSupplyItems.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === item.href}
                          >
                            <Link href={item.href}>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Brand Context - Collapsible */}
              <Collapsible
                defaultOpen={isBrandContext}
                className="group/collapsible"
              >
                <SidebarMenuItem className={shouldGlow("brand-context") ? "animate-nav-glow" : ""}>
                  {/* Icon link for collapsed state */}
                  <div className="hidden group-data-[collapsible=icon]:block">
                    <SidebarMenuButton
                      asChild
                      isActive={isBrandContext}
                      tooltip={t("nav.brandContext")}
                    >
                      <Link href="/seller/brand-context">
                        <Layers className="size-4 shrink-0" />
                      </Link>
                    </SidebarMenuButton>
                  </div>
                  {/* Collapsible trigger for expanded state */}
                  <CollapsibleTrigger asChild className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuButton
                      isActive={isBrandContext}
                      tooltip={t("nav.brandContext")}
                    >
                      <span className="flex-1 truncate">{t("nav.brandContext")}</span>
                      <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {brandContextSubPages.map((sub) => (
                        <SidebarMenuSubItem key={sub.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === sub.href}
                          >
                            <Link href={sub.href}>
                              <span>{sub.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Channel Control - Collapsible */}
              <Collapsible
                defaultOpen={isChannelControl}
                className="group/collapsible"
              >
                <SidebarMenuItem className={shouldGlow("channel-control") ? "animate-nav-glow" : ""}>
                  {/* Icon link for collapsed state - rendered outside collapsible trigger */}
                  <div className="hidden group-data-[collapsible=icon]:block">
                    <SidebarMenuButton
                      asChild
                      isActive={isChannelControl}
                      tooltip={t("nav.channelControl")}
                    >
                      <Link href="/seller/channels/conversational-storefront">
                        <Radio className="size-4 shrink-0" />
                      </Link>
                    </SidebarMenuButton>
                  </div>
                  {/* Collapsible trigger for expanded state */}
                  <CollapsibleTrigger asChild className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuButton
                      isActive={isChannelControl}
                      tooltip={t("nav.channelControl")}
                    >
                      <span className="flex-1 truncate">{t("nav.channelControl")}</span>
                      <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* Free Section - Glass Card */}
                      <div className="mx-1 mb-2 rounded-lg bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 p-1">
                        <SidebarMenuSubItem>
                          <span className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                            Free
                          </span>
                        </SidebarMenuSubItem>
                        {freeChannelItems.map((item) => {
                          const status = getChannelStatus(item.id)
                          const dotColor = 
                            status === "active" || status === "always-on" ? "bg-green-500" :
                            status === "inactive" ? "bg-yellow-500" :
                            status === "disconnected" ? "bg-red-500" : null
                          
                          return (
                            <SidebarMenuSubItem key={item.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === item.href}
                                className={status === "coming" ? "opacity-50" : ""}
                              >
                                <Link href={status === "coming" ? "#" : item.href}>
                                  <span className="flex items-center gap-2 flex-1">
                                    {dotColor && (
                                      <span className={cn("size-1.5 rounded-full shrink-0", dotColor)} />
                                    )}
                                    <span className="truncate">{item.title}</span>
                                    {status === "coming" && (
                                      <span className="text-[10px] text-muted-foreground ml-auto">
                                        {t("channel.coming")}
                                      </span>
                                    )}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </div>

                      {/* Other Channels */}
                      {channelControlItems.map((item) => {
                        const status = getChannelStatus(item.id)
                        const dotColor = 
                          status === "active" || status === "always-on" ? "bg-green-500" :
                          status === "inactive" ? "bg-yellow-500" :
                          status === "disconnected" ? "bg-red-500" : null
                        
                        return (
                          <SidebarMenuSubItem key={item.href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === item.href}
                              className={status === "pro" ? "opacity-50" : ""}
                            >
                              <Link href={status === "pro" ? "#" : item.href}>
                                <span className="flex items-center gap-2 flex-1">
                                  {dotColor && (
                                    <span className={cn("size-1.5 rounded-full shrink-0", dotColor)} />
                                  )}
                                  <span className="truncate">{item.title}</span>
                                  {status === "pro" && (
                                    <span className="text-[10px] text-muted-foreground ml-auto">
                                      {t("channel.pro")}
                                    </span>
                                  )}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Analytics */}
              <SidebarMenuItem className={shouldGlow("analytics") ? "animate-nav-glow" : ""}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/seller/analytics"}
                  tooltip={t("nav.analytics")}
                >
                  <Link href="/seller/analytics">
                    <BarChart3 className="size-4 shrink-0 hidden group-data-[collapsible=icon]:block" />
                    <span className="group-data-[collapsible=icon]:hidden">{t("nav.analytics")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
        <Link 
          href="/seller/settings"
          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent cursor-pointer"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-xs font-semibold">
            N
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              {t("common.demo")}
            </span>
            <span className="text-xs text-sidebar-foreground/50 truncate">
              {t("common.freePlan")}
            </span>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
