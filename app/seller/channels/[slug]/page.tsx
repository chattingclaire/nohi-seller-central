"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useChannelState } from "@/lib/channel-state"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"

const channelData: Record<string, {
  name: string
  description: { en: string; zh: string }
  features: { en: string[]; zh: string[] }
  type: "always-on" | "toggleable" | "configurable"
}> = {
  "chatgpt-acp": {
    name: "ChatGPT ACP",
    description: {
      en: "Connect to ChatGPT's Agentic Commerce Protocol to enable purchases directly within ChatGPT conversations. This channel is always enabled for maximum reach.",
      zh: "连接ChatGPT的智能商务协议，在ChatGPT对话中直接启用购买功能。此渠道始终启用以获得最大覆盖范围。"
    },
    features: {
      en: ["In-chat purchases", "Product recommendations", "Order tracking"],
      zh: ["对话内购买", "产品推荐", "订单跟踪"]
    },
    type: "always-on"
  },
  "chatgpt-app": {
    name: "ChatGPT App",
    description: {
      en: "Make your products available through ChatGPT's mobile and desktop applications.",
      zh: "通过ChatGPT的移动端和桌面端应用提供您的产品。"
    },
    features: {
      en: ["Mobile commerce", "Voice shopping", "Visual product cards"],
      zh: ["移动商务", "语音购物", "可视化产品卡片"]
    },
    type: "configurable"
  },
  "gemini": {
    name: "Gemini",
    description: {
      en: "Enable product discovery and recommendations through Gemini AI assistant. This channel is always enabled.",
      zh: "通过Gemini AI助手实现产品发现和推荐。此渠道始终启用。"
    },
    features: {
      en: ["Gemini AI integration", "Smart recommendations", "Cross-platform reach"],
      zh: ["Gemini AI集成", "智能推荐", "跨平台覆盖"]
    },
    type: "always-on"
  },
  "google-ai": {
    name: "Google AI Mode",
    description: {
      en: "Enable your products to appear in Google's AI-powered search and shopping experiences. This channel is always enabled.",
      zh: "让您的产品出现在Google AI驱动的搜索和购物体验中。此渠道始终启用。"
    },
    features: {
      en: ["AI search results", "Shopping intent matching", "Rich product snippets"],
      zh: ["AI搜索结果", "购物意图匹配", "丰富的产品摘要"]
    },
    type: "always-on"
  },
  "perplexity": {
    name: "Perplexity",
    description: {
      en: "List your products on Perplexity's AI search engine for discovery by research-focused shoppers. This channel is always enabled.",
      zh: "在Perplexity的AI搜索引擎上列出您的产品，供研究型购物者发现。此渠道始终启用。"
    },
    features: {
      en: ["Research-driven discovery", "Detailed product info", "Comparison shopping"],
      zh: ["研究驱动的发现", "详细产品信息", "比较购物"]
    },
    type: "always-on"
  },
  "reddit": {
    name: "Reddit DPA",
    description: {
      en: "Connect with Reddit's Dynamic Product Ads to reach engaged community members.",
      zh: "连接Reddit的动态产品广告，触达活跃的社区成员。"
    },
    features: {
      en: ["Community targeting", "Interest-based ads", "Authentic engagement"],
      zh: ["社区定向", "兴趣广告", "真实互动"]
    },
    type: "toggleable"
  },
  "third-party": {
    name: "Third Party Agents",
    description: {
      en: "Enable access for third-party AI shopping agents and comparison tools.",
      zh: "为第三方AI购物智能体和比较工具启用访问权限。"
    },
    features: {
      en: ["Open API access", "Agent marketplace", "Custom integrations"],
      zh: ["开放API访问", "智能体市场", "自定义集成"]
    },
    type: "toggleable"
  },
  "creator-agents": {
    name: "Creator Agents",
    description: {
      en: "Reach audiences through creator and influencer AI agents. Enable your products to be recommended by AI shopping assistants built by creators.",
      zh: "通过创作者和影响者的AI智能体触达他们的受众。让您的产品被创作者构建的AI购物助手推荐。"
    },
    features: {
      en: ["Creator partnerships", "Influencer reach", "Authentic recommendations"],
      zh: ["创作者合作", "影响者触达", "真实推荐"]
    },
    type: "toggleable"
  },
  "copilot": {
    name: "Microsoft Copilot",
    description: {
      en: "Integrate your products into Microsoft Copilot shopping experiences across Windows, Edge, and Microsoft 365.",
      zh: "将您的产品整合到Windows、Edge和Microsoft 365的Copilot购物体验中。"
    },
    features: {
      en: ["Windows integration", "Edge shopping", "Enterprise reach"],
      zh: ["Windows集成", "Edge购物", "企业覆盖"]
    },
    type: "toggleable"
  },
  "genspark": {
    name: "Genspark",
    description: {
      en: "Enable product discovery through Genspark's AI-powered search and research platform.",
      zh: "通过Genspark的AI搜索和研究平台实现产品发现。"
    },
    features: {
      en: ["AI research", "Deep search", "Product comparisons"],
      zh: ["AI研究", "深度搜索", "产品对比"]
    },
    type: "toggleable"
  },
  "kimi": {
    name: "Kimi",
    description: {
      en: "Connect with Kimi, the popular AI assistant, to reach users in the Chinese market.",
      zh: "连接Kimi AI助手，触达中国市场的用户。"
    },
    features: {
      en: ["Chinese market", "Conversational commerce", "Local optimization"],
      zh: ["中国市场", "对话式商务", "本地化优化"]
    },
    type: "toggleable"
  },
  "openclaw": {
    name: "Openclaw",
    description: {
      en: "Join Openclaw's open agent network for decentralized product discovery and recommendations.",
      zh: "加入Openclaw的开放智能体网络，实现去中心化的产品发现和推荐。"
    },
    features: {
      en: ["Open network", "Decentralized", "Agent ecosystem"],
      zh: ["开放网络", "去中心化", "智能体生态"]
    },
    type: "toggleable"
  },
}

export default function ChannelPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  // Redirect to dedicated page for conversational-storefront
  useEffect(() => {
    if (slug === "conversational-storefront") {
      router.replace("/seller/channels/conversational-storefront")
    }
  }, [slug, router])
  
  // Show loading state while redirecting
  if (slug === "conversational-storefront") {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }
  
  const channel = channelData[slug]
  const { getChannelStatus, setChannelStatus } = useChannelState()
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [requestSent, setRequestSent] = useState(false)
  const { t, language } = useLanguage()

  if (!channel) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h1 className="text-xl font-semibold text-foreground">{t("channel.comingSoon")}</h1>
        <p className="text-sm text-muted-foreground text-center">
          {t("channel.comingSoonDesc")}
        </p>
      </div>
    )
  }

  const currentStatus = getChannelStatus(slug)
  const isEnabled = currentStatus === "active" || currentStatus === "always-on"
  const isActive = channel.type === "always-on" || isEnabled

  const handleToggle = (checked: boolean) => {
    setChannelStatus(slug, checked ? "active" : "inactive")
  }

  const description = language === "zh" ? channel.description.zh : channel.description.en
  const features = language === "zh" ? channel.features.zh : channel.features.en

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">{channel.name}</h1>
            <Badge 
              variant="default"
              className={cn(
                "text-xs",
                isActive ? "bg-green-600 text-white" : "bg-secondary text-muted-foreground"
              )}
            >
              {isActive ? t("channel.active") : t("channel.inactive")}
            </Badge>
            {channel.type === "always-on" && (
              <span className="text-xs text-muted-foreground">{t("channel.alwaysOn")}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>
      </div>

      {/* Status Section */}
      {channel.type === "always-on" ? (
        <div className="rounded-2xl bg-secondary/50 p-6">
          <div className="flex items-center gap-3">
            <span className="size-2.5 rounded-full bg-green-500" />
            <div>
              <h3 className="text-base font-medium text-foreground">{t("channel.channelAlwaysEnabled")}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t("channel.alwaysEnabledDesc")}
              </p>
            </div>
          </div>
        </div>
      ) : channel.type === "toggleable" ? (
        <div className="rounded-2xl bg-secondary/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={cn(
                "size-2.5 rounded-full",
                isEnabled ? "bg-green-500" : "bg-yellow-500"
              )} />
              <div>
                <h3 className="text-base font-medium text-foreground">{t("channel.channelStatus")}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t("channel.enableDisableChannel")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="channel-status" className="text-sm text-muted-foreground">
                {isEnabled ? t("channel.enabled") : t("channel.disabled")}
              </Label>
              <Switch 
                id="channel-status" 
                checked={isEnabled}
                onCheckedChange={handleToggle}
              />
            </div>
          </div>
        </div>
      ) : slug === "chatgpt-app" ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-secondary/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={cn(
                  "size-2.5 rounded-full",
                  currentStatus === "active" ? "bg-green-500" : 
                  currentStatus === "inactive" ? "bg-yellow-500" : "bg-red-500"
                )} />
                <div>
                  <h3 className="text-base font-medium text-foreground">{t("channel.channelStatus")}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t("channel.enableIntegration")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="channel-status" className="text-sm text-muted-foreground">
                  {isEnabled ? t("channel.enabled") : t("channel.disabled")}
                </Label>
                <Switch 
                  id="channel-status" 
                  checked={isEnabled}
                  onCheckedChange={handleToggle}
                />
              </div>
            </div>
          </div>

          {isEnabled && (
            <div className="rounded-2xl bg-secondary/50 p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-base font-medium text-foreground">{t("channel.appSelection")}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t("channel.appSelectionDesc")}
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all",
                      selectedApp === "custom"
                        ? "border-foreground ring-1 ring-foreground"
                        : "border-border hover:border-foreground/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedApp("custom")}
                        className="text-left"
                      >
                        <h4 className="text-sm font-medium text-foreground">{t("channel.customApp")}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{t("channel.customAppDesc")}</p>
                      </button>
                      {requestSent ? (
                        <span className="text-xs text-muted-foreground">{t("common.requestSent")}</span>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-full text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            setRequestSent(true)
                          }}
                        >
                          {t("common.request")}
                        </Button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled
                    className="rounded-xl bg-secondary/30 p-4 text-left opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{t("channel.nohiApp")}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{t("channel.nohiAppDesc")}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{t("channel.coming")}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-secondary/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={cn(
                "size-2.5 rounded-full",
                isEnabled ? "bg-green-500" : "bg-yellow-500"
              )} />
              <div>
                <h3 className="text-base font-medium text-foreground">{t("channel.channelStatus")}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t("channel.configureChannel")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="channel-status" className="text-sm text-muted-foreground">
                {isEnabled ? t("channel.enabled") : t("channel.disabled")}
              </Label>
              <Switch 
                id="channel-status" 
                checked={isEnabled}
                onCheckedChange={handleToggle}
              />
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">{t("channel.features")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-xl bg-secondary/30 p-4"
            >
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Preview - hide for google-ai */}
      {slug !== "google-ai" && (
        <div className="rounded-2xl bg-secondary/50 p-6">
          <h3 className="text-base font-medium text-foreground">{t("channel.channelAnalytics")}</h3>
          <p className="text-sm text-muted-foreground mt-0.5 mb-4">
            {t("channel.performanceMetrics")}
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{t("channel.views")}</span>
              <span className="text-2xl font-semibold text-foreground tabular-nums mt-1">
                {isActive ? "1,247" : "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{t("channel.orders")}</span>
              <span className="text-2xl font-semibold text-foreground tabular-nums mt-1">
                {isActive ? "42" : "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{t("channel.revenue")}</span>
              <span className="text-2xl font-semibold text-foreground tabular-nums mt-1">
                {isActive ? "$3,420" : "—"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {channel.type !== "always-on" && (
        <div className="flex gap-3">
          <Button className="rounded-full">
            {t("channel.saveChanges")}
          </Button>
          <Button variant="outline" className="rounded-full">
            {t("channel.viewDocs")}
          </Button>
        </div>
      )}
    </div>
  )
}
