"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { useOnboarding } from "@/lib/onboarding-context"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, ExternalLink, Sparkles, Package, BarChart3, Radio, Palette } from "lucide-react"
import Image from "next/image"

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

const ONBOARDING_STORAGE_KEY = "nohi-onboarding-complete"
const ONBOARDING_STEP_KEY = "nohi-onboarding-step"

export default function ConnectShopPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const { setCurrentStep } = useOnboarding()
  const [step, setStep] = useState<OnboardingStep | "status">("welcome")
  const [syncProgress, setSyncProgress] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [productCount] = useState(24)
  const [variantCount, setVariantCount] = useState(144)
  const [isLoading, setIsLoading] = useState(true)

  // Check if onboarding is already complete or restore progress
  useEffect(() => {
    const isComplete = localStorage.getItem(ONBOARDING_STORAGE_KEY)
    if (isComplete === "true") {
      setStep("status")
    } else {
      // Restore saved progress
      const savedStep = localStorage.getItem(ONBOARDING_STEP_KEY) as OnboardingStep | null
      if (savedStep && savedStep !== "welcome") {
        setStep(savedStep)
      }
    }
    setIsLoading(false)
  }, [])

  // Save step progress
  useEffect(() => {
    if (step !== "status" && step !== "welcome") {
      localStorage.setItem(ONBOARDING_STEP_KEY, step)
    }
    if (step === "complete") {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true")
      localStorage.removeItem(ONBOARDING_STEP_KEY)
      // After showing complete message, switch to status view
      const timer = setTimeout(() => {
        setStep("status")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [step])
  
  // Sync step to onboarding context for sidebar highlighting
  useEffect(() => {
    if (step !== "status") {
      setCurrentStep(step)
    } else {
      setCurrentStep(null)
    }
    return () => setCurrentStep(null)
  }, [step, setCurrentStep])

  // Sync animation
  useEffect(() => {
    if (step === "syncing") {
      const interval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStep("sync-complete"), 500)
            return 100
          }
          return prev + Math.random() * 8 + 2
        })
      }, 150)
      return () => clearInterval(interval)
    }
  }, [step])

  // Generation animation
  useEffect(() => {
    if (step === "generating") {
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setVariantCount(productCount * 6)
            setTimeout(() => setStep("generation-complete"), 500)
            return 100
          }
          const newProgress = prev + Math.random() * 5 + 1
          setVariantCount(Math.floor((newProgress / 100) * productCount * 6))
          return newProgress
        })
      }, 120)
      return () => clearInterval(interval)
    }
  }, [step, productCount])

  const t = {
    welcome: {
      title: language === "zh" ? "欢迎使用 Nohi" : "Welcome to Nohi",
      subtitle: language === "zh" 
        ? "让我们一起设置您的 Agentic Catalog，让 AI 智能体为您销售商品。" 
        : "Let's set up your Agentic Catalog so AI agents can sell your products.",
      start: language === "zh" ? "开始设置" : "Get Started",
    },
    syncing: {
      title: language === "zh" ? "同步商品信息" : "Syncing Product Data",
      subtitle: language === "zh" 
        ? "正在从您的 Shopify 商店获取商品信息..." 
        : "Fetching products from your Shopify store...",
      products: language === "zh" ? "个商品" : "products",
    },
    syncComplete: {
      title: language === "zh" ? "商品同步完成" : "Products Synced",
      subtitle: language === "zh" 
        ? `成功同步 ${productCount} 个商品` 
        : `Successfully synced ${productCount} products`,
      next: language === "zh" ? "生成 Agentic Catalog" : "Generate Agentic Catalog",
    },
    generating: {
      title: language === "zh" ? "生成 Agentic Catalog" : "Generating Agentic Catalog",
      subtitle: language === "zh" 
        ? "为每个商品创建 AI 意图变体..." 
        : "Creating AI intent variants for each product...",
      variants: language === "zh" ? "个意图变体" : "intent variants",
    },
    generationComplete: {
      title: language === "zh" ? "Agentic Catalog 已就绪" : "Agentic Catalog Ready",
      subtitle: language === "zh" 
        ? `已为 ${productCount} 个商品生成 ${variantCount} 个意图变体（每个商品 6 个初始变体）` 
        : `Generated ${variantCount} intent variants for ${productCount} products (6 initial variants per product)`,
      next: language === "zh" ? "继续" : "Continue",
    },
    themeSetup: {
      title: language === "zh" ? "启用 Nohi Storefront" : "Enable Nohi Storefront",
      subtitle: language === "zh" 
        ? "在您的 Shopify 主题中启用 Nohi Storefront，让 AI 智能体能够访问您的商品。" 
        : "Enable the Nohi Storefront in your Shopify theme to allow AI agents to access your products.",
      instruction: language === "zh" 
        ? "1. 点击下方按钮前往 Shopify 主题设置\n2. 找到 'App embeds' 或 '应用嵌入'\n3. 启用 'Nohi Storefront'\n4. 点击保存" 
        : "1. Click the button below to go to Shopify theme settings\n2. Find 'App embeds'\n3. Enable 'Nohi Storefront'\n4. Click Save",
      openShopify: language === "zh" ? "打开 Shopify 主题设置" : "Open Shopify Theme Settings",
      enabled: language === "zh" ? "Storefront 已启用" : "Storefront Enabled",
    },
    themeConfirmed: {
      title: language === "zh" ? "Storefront 已启用" : "Storefront Enabled",
      subtitle: language === "zh" 
        ? "太好了！您的商店现在可以被 AI 智能体发现了。" 
        : "Great! Your store is now discoverable by AI agents.",
      next: language === "zh" ? "继续" : "Continue",
    },
brandContext: {
      title: language === "zh" ? "品牌上下文" : "Brand Context",
      subtitle: language === "zh" 
        ? "添加品牌信息帮助 AI 更好地理解和推荐您的商品。" 
        : "Add brand information to help AI better understand and recommend your products.",
    },
    channelControl: {
      title: language === "zh" ? "渠道控制" : "Channel Control",
      subtitle: language === "zh" 
        ? "管理您的商品在不同 AI 渠道上的展示方式。" 
        : "Manage how your products appear across different AI channels.",
      next: language === "zh" ? "继续" : "Continue",
    },
    analytics: {
      title: language === "zh" ? "监控您的表现" : "Monitor Your Performance",
      subtitle: language === "zh" 
        ? "通过 Analytics 追踪您在 AI 渠道上的表现。" 
        : "Track your performance across AI channels with Analytics.",
      tip: language === "zh" 
        ? "提示：您也可以在 Shopify 后台的订单页面查看带有 'Nohi' 标签的订单" 
        : "Tip: You can also view orders tagged with 'Nohi' in your Shopify admin's Orders page",
      next: language === "zh" ? "完成设置" : "Finish Setup",
    },
    complete: {
      title: language === "zh" ? "设置完成！" : "You're All Set!",
      subtitle: language === "zh" 
        ? "恭喜！您的商店已准备好通过 AI 智能体销售商品了。" 
        : "Congratulations! Your store is ready to sell through AI agents.",
      dashboard: language === "zh" ? "前往仪表盘" : "Go to Dashboard",
    },
    status: {
      title: language === "zh" ? "Catalog 状态" : "Catalog Status",
      subtitle: language === "zh" ? "您的 Agentic Catalog 运行正常" : "Your Agentic Catalog is running smoothly",
      products: language === "zh" ? "已同步商品" : "Synced Products",
      variants: language === "zh" ? "意图变体" : "Intent Variants",
      lastSync: language === "zh" ? "上次同步" : "Last Synced",
      status: language === "zh" ? "状态" : "Status",
      active: language === "zh" ? "活跃" : "Active",
      restartOnboarding: language === "zh" ? "重新开始引导" : "Restart Onboarding",
    },
  }

  // Function to restart onboarding
  const restartOnboarding = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    localStorage.removeItem(ONBOARDING_STEP_KEY)
    setSyncProgress(0)
    setGenerationProgress(0)
    setVariantCount(0)
    setStep("welcome")
  }

  const renderStep = () => {
    switch (step) {
      case "welcome":
        return (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-semibold text-foreground">{t.welcome.title}</h1>
            <p className="text-muted-foreground mt-2 max-w-md">{t.welcome.subtitle}</p>
            <div className="mt-12 flex flex-col items-center gap-4">
              <button
                onClick={() => setStep("syncing")}
                className="size-24 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <ArrowRight className="size-10" />
              </button>
              <span className="text-sm font-medium text-foreground">{t.welcome.start}</span>
            </div>
          </div>
        )

      case "syncing":
        return (
          <div className="flex flex-col items-center text-center w-full max-w-md">
            <div className="size-16 rounded-full bg-foreground/5 flex items-center justify-center mb-6 animate-pulse">
              <Package className="size-8 text-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">{t.syncing.title}</h1>
            <p className="text-muted-foreground mt-2">{t.syncing.subtitle}</p>
            <div className="w-full mt-8">
              <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-foreground transition-all duration-150 rounded-full"
                  style={{ width: `${Math.min(syncProgress, 100)}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-3 tabular-nums">
                {Math.floor(syncProgress / 100 * productCount)} / {productCount} {t.syncing.products}
              </p>
            </div>
          </div>
        )

      case "sync-complete":
        return (
          <div className="flex flex-col items-center text-center">
            <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">{t.syncComplete.title}</h1>
            <p className="text-muted-foreground mt-2">{t.syncComplete.subtitle}</p>
            <Button 
              onClick={() => setStep("generating")} 
              className="mt-8 rounded-full px-8"
            >
              {t.syncComplete.next}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        )

      case "generating":
        // Abstract multi-column feed data based on merchant catalog template
        const feedColumns = [
          // Column 1: IDs and SKUs
          ["product_id", "variant_sku", "variant_barcode", "product_url", "variant_url", "product_id", "variant_sku", "variant_barcode"],
          // Column 2: Product info
          ["title", "short_description", "description", "brand", "product_type", "category", "tags", "title"],
          // Column 3: Variant options
          ["option1_name", "option1_value", "option2_name", "option2_value", "option3_name", "option3_value", "variant_title", "option1_name"],
          // Column 4: Pricing
          ["variant_price", "compare_at_price", "regular_price", "sale_price", "cost_per_item", "currency", "variant_price", "compare_at_price"],
          // Column 5: Inventory & Status
          ["inventory_qty", "inventory_status", "status", "catalog_visibility", "is_default", "variant_position", "inventory_qty", "status"],
          // Column 6: Attributes
          ["material", "feature", "ideal_for", "use_case", "target_audience", "trending", "repurchase_rate", "material"],
        ]
        
        const sampleValues = [
          ["PROD-0847", "SKU-BLK-M", "8901234567890", "nohi.co/p/847", "/v/847-1", "PROD-0291", "SKU-NAV-L", "8901234567891"],
          ["Classic Cotton Tee", "Soft organic cotton", "Premium quality...", "Nohi", "Apparel", "Tops", "summer,casual", "Linen Pants"],
          ["Color", "Black", "Size", "Medium", "Material", "Cotton", "Black / M / Cotton", "Color"],
          ["29.99", "39.99", "29.99", "24.99", "12.50", "USD", "79.99", "99.99"],
          ["156", "in_stock", "active", "visible", "true", "1", "42", "active"],
          ["100% Cotton", "Breathable", "Casual wear", "Daily use", "Adults 18-35", "true", "0.72", "Organic Linen"],
        ]
        
        return (
          <div className="flex flex-col items-center text-center w-full max-w-3xl">
            <h1 className="text-xl font-semibold text-foreground">{t.generating.title}</h1>
            <p className="text-muted-foreground mt-2">{t.generating.subtitle}</p>
            
            {/* Abstract multi-column feed animation */}
            <div className="w-full mt-8 relative h-48 overflow-hidden rounded-xl border border-border bg-secondary/20">
              {/* Top gradient mask */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
              {/* Bottom gradient mask */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
              
              {/* Multi-column scrolling feed */}
              <div className="flex h-full">
                {feedColumns.map((column, colIdx) => (
                  <div 
                    key={colIdx} 
                    className="flex-1 overflow-hidden border-r border-border/20 last:border-r-0"
                  >
                    <div 
                      className="animate-feed-scroll"
                      style={{ 
                        animationDuration: `${6 + colIdx * 1.5}s`,
                        animationDirection: colIdx % 2 === 0 ? 'normal' : 'reverse'
                      }}
                    >
                      {[...column, ...column].map((field, i) => (
                        <div key={i} className="px-2 py-2 border-b border-border/10">
                          <div className="text-[9px] text-muted-foreground/50 font-medium uppercase tracking-wider truncate">
                            {field}
                          </div>
                          <div className="text-[11px] text-foreground/80 font-mono truncate mt-0.5">
                            {sampleValues[colIdx][i % sampleValues[colIdx].length]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4 tabular-nums">
              {variantCount} {t.generating.variants}
            </p>
          </div>
        )

      case "generation-complete":
        return (
          <div className="flex flex-col items-center text-center">
            <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">{t.generationComplete.title}</h1>
            <p className="text-muted-foreground mt-2 max-w-md">{t.generationComplete.subtitle}</p>
            <Button 
              onClick={() => setStep("theme-setup")} 
              className="mt-8 rounded-full px-8"
            >
              {t.generationComplete.next}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        )

      case "theme-setup":
        return (
          <div className="flex flex-col items-center text-center w-full max-w-lg">
            {/* Network animation: center dot with 5 curved branches extending outward */}
            <div className="relative size-24 mb-6">
              <svg className="w-full h-full" viewBox="0 0 96 96">
                {/* Center dot */}
                <circle cx="48" cy="48" r="5" className="fill-foreground" />
                {/* Curved branches extending outward */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const angle = i * 72 - 90
                  const radians = angle * (Math.PI / 180)
                  const endX = 48 + Math.cos(radians) * 38
                  const endY = 48 + Math.sin(radians) * 38
                  // Control point for curve (offset perpendicular to the line)
                  const ctrlAngle = radians + Math.PI / 6
                  const ctrlX = 48 + Math.cos(ctrlAngle) * 20
                  const ctrlY = 48 + Math.sin(ctrlAngle) * 20
                  return (
                    <g key={i}>
                      {/* Curved line */}
                      <path
                        d={`M 48 48 Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                        className="stroke-foreground/30 fill-none animate-network-pulse"
                        strokeWidth="1.5"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                      {/* Outer dot */}
                      <circle
                        cx={endX}
                        cy={endY}
                        r="4"
                        className="fill-foreground"
                      />
                    </g>
                  )
                })}
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-foreground">{t.themeSetup.title}</h1>
            <p className="text-muted-foreground mt-2">{t.themeSetup.subtitle}</p>
            <div className="w-full mt-6 p-4 rounded-xl bg-secondary/50 text-left">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                {t.themeSetup.instruction}
              </pre>
            </div>
            <div className="flex flex-col gap-3 mt-8 w-full">
              <Button 
                variant="outline"
                onClick={() => window.open("https://admin.shopify.com/store/YOUR_STORE/themes/current/editor", "_blank")}
                className="rounded-full"
              >
                {t.themeSetup.openShopify}
                <ExternalLink className="ml-2 size-4" />
              </Button>
              
              {/* Combined status and continue button in one capsule */}
              <button
                onClick={() => setStep("theme-confirmed")} 
                className="flex items-center justify-between w-full px-5 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-400" />
                  <span className="text-sm font-medium">{t.themeSetup.enabled}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  {t.generationComplete.next}
                  <ArrowRight className="size-4" />
                </div>
              </button>
            </div>
          </div>
        )

      case "theme-confirmed":
        return (
          <div className="flex flex-col items-center text-center">
            <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">{t.themeConfirmed.title}</h1>
            <p className="text-muted-foreground mt-2">{t.themeConfirmed.subtitle}</p>
            <Button 
              onClick={() => setStep("brand-context")} 
              className="mt-8 rounded-full px-8"
            >
              {t.themeConfirmed.next}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        )

      case "brand-context":
        return (
          <div className="flex flex-col items-center text-center w-full max-w-lg">
            <div className="size-16 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
              <Palette className="size-8 text-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">{t.brandContext.title}</h1>
            <p className="text-muted-foreground mt-2">{t.brandContext.subtitle}</p>
            <Button 
              onClick={() => setStep("channel-control")} 
              className="mt-8 rounded-full px-8"
            >
              {t.generationComplete.next}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        )

      case "channel-control":
        return (
          <div className="flex flex-col items-center text-center w-full max-w-lg">
            <div className="size-16 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
              <Radio className="size-8 text-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">{t.channelControl.title}</h1>
            <p className="text-muted-foreground mt-2">{t.channelControl.subtitle}</p>
            <Button 
              onClick={() => setStep("analytics")} 
              className="mt-8 rounded-full px-8"
            >
              {t.channelControl.next}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        )

      case "analytics":
        return (
          <div className="flex flex-col items-center text-center w-full max-w-lg">
            <div className="size-16 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
              <BarChart3 className="size-8 text-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">{t.analytics.title}</h1>
            <p className="text-muted-foreground mt-2">{t.analytics.subtitle}</p>
            
            {/* Shopify Orders Screenshot */}
            <div className="w-full mt-6 rounded-xl overflow-hidden border border-border">
              <Image 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4xnBWP5GlGWGIENIdECmct84aMbgM1.png"
                alt="Shopify Orders with Nohi tag"
                width={600}
                height={300}
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3 px-4">{t.analytics.tip}</p>
            
            <Button 
              onClick={() => setStep("complete")} 
              className="mt-8 rounded-full px-8"
            >
              {t.analytics.next}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        )

      case "complete":
        return (
          <div className="flex flex-col items-center text-center">
            <div className="size-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="size-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">{t.complete.title}</h1>
            <p className="text-muted-foreground mt-2 max-w-md">{t.complete.subtitle}</p>
            <Button 
              onClick={() => router.push("/seller")} 
              className="mt-8 rounded-full px-8"
              size="lg"
            >
              {t.complete.dashboard}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        )

      case "status":
        return (
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">{t.status.title}</h1>
                <p className="text-muted-foreground mt-1">{t.status.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-600">{t.status.active}</span>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="rounded-2xl bg-secondary/50 p-5">
                <p className="text-2xl font-semibold text-foreground tabular-nums">{productCount}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.status.products}</p>
              </div>
              <div className="rounded-2xl bg-secondary/50 p-5">
                <p className="text-2xl font-semibold text-foreground tabular-nums">{variantCount}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.status.variants}</p>
              </div>
              <div className="rounded-2xl bg-secondary/50 p-5">
                <p className="text-2xl font-semibold text-foreground tabular-nums">
                  {language === "zh" ? "刚刚" : "Just now"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{t.status.lastSync}</p>
              </div>
              <div className="rounded-2xl bg-secondary/50 p-5">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-green-500" />
                  <p className="text-lg font-semibold text-foreground">{t.status.active}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.status.status}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                variant="ghost"
                onClick={restartOnboarding}
                className="rounded-full text-muted-foreground"
              >
                {t.status.restartOnboarding}
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Progress indicator - grouped steps for dots display
  const stepGroups = [
    ["welcome"],
    ["syncing", "sync-complete"],
    ["generating", "generation-complete"],
    ["theme-setup", "theme-confirmed"],
    ["brand-context"],
    ["channel-control"],
    ["analytics"],
    ["complete"]
  ]
  
  const getCurrentGroupIndex = () => {
    for (let i = 0; i < stepGroups.length; i++) {
      if (stepGroups[i].includes(step)) return i
    }
    return 0
  }
  
  const currentGroupIndex = getCurrentGroupIndex()

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <div className="size-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
      {/* Progress dots at top */}
      {step !== "welcome" && step !== "complete" && step !== "status" && (
        <div className="flex items-center gap-2 mb-12">
          {stepGroups.slice(1, -1).map((_, i) => (
            <div 
              key={i}
              className={`size-2 rounded-full transition-colors ${
                i < currentGroupIndex - 1 
                  ? "bg-foreground" 
                  : i === currentGroupIndex - 1 
                    ? "bg-foreground" 
                    : "bg-foreground/20"
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Main content */}
      <div className="w-full flex justify-center">
        {renderStep()}
      </div>
    </div>
  )
}
