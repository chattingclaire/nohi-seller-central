"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, CheckCircle2, Circle, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

export default function GettingStartedPage() {
  const { language } = useLanguage()

  const t = {
    title: language === "zh" ? "入门指南" : "Getting Started Guide",
    subtitle: language === "zh" 
      ? "了解通过 AI 智能体销售的基础知识" 
      : "Learn the basics of selling through AI agents",
    
    intro: {
      title: language === "zh" ? "什么是 Nohi？" : "What is Nohi?",
      description: language === "zh"
        ? "Nohi 是您进入智能体商务时代的入口。我们将您的品牌和产品连接到 AI 购物智能体，这些智能体代表消费者发现、推荐和购买产品。通过 Nohi，您可以触达在 ChatGPT、Gemini、Perplexity 等平台上购物的用户。"
        : "Nohi is your gateway to the agentic commerce era. We connect your brand and products to AI shopping agents that discover, recommend, and purchase products on behalf of consumers. With Nohi, you can reach shoppers on ChatGPT, Gemini, Perplexity, and more.",
    },

    steps: {
      title: language === "zh" ? "快速开始步骤" : "Quick Start Steps",
      items: [
        {
          number: 1,
          title: language === "zh" ? "连接您的商品目录" : "Connect Your Catalog",
          description: language === "zh"
            ? "从 Shopify、WooCommerce 或其他平台导入您的产品数据。Nohi 会自动生成 AI 优化的产品描述。"
            : "Import your product data from Shopify, WooCommerce, or other platforms. Nohi automatically generates AI-optimized product descriptions.",
          href: "/seller/catalog/connectors",
          done: false,
        },
        {
          number: 2,
          title: language === "zh" ? "配置品牌上下文" : "Configure Brand Context",
          description: language === "zh"
            ? "添加品牌故事、视觉风格和产品特色，帮助 AI 更好地理解和推荐您的品牌。"
            : "Add your brand story, visual style, and product highlights to help AI better understand and recommend your brand.",
          href: "/seller/brand-context",
          done: false,
        },
        {
          number: 3,
          title: language === "zh" ? "选择分发渠道" : "Choose Distribution Channels",
          description: language === "zh"
            ? "决定在哪些 AI 平台上展示您的产品。部分渠道自动启用，其他渠道可按需配置。"
            : "Decide which AI platforms to showcase your products on. Some channels are always-on, others can be configured as needed.",
          href: "/seller/channels/chatgpt-acp",
          done: false,
        },
        {
          number: 4,
          title: language === "zh" ? "监控表现" : "Monitor Performance",
          description: language === "zh"
            ? "追踪来自各 AI 渠道的流量、转化和收入。了解哪些智能体为您带来最多价值。"
            : "Track traffic, conversions, and revenue from each AI channel. Understand which agents bring you the most value.",
          href: "/seller/analytics",
          done: false,
        },
      ],
    },

    concepts: {
      title: language === "zh" ? "核心概念" : "Core Concepts",
      items: [
        {
          title: language === "zh" ? "智能体商务" : "Agentic Commerce",
          description: language === "zh"
            ? "一种新的商业模式，AI 智能体作为购物者的代理，主动搜索、比较和购买产品。"
            : "A new commerce paradigm where AI agents act as proxies for shoppers, actively searching, comparing, and purchasing products.",
        },
        {
          title: language === "zh" ? "智能目录" : "Agentic Catalog",
          description: language === "zh"
            ? "为 AI 理解优化的产品目录，包含意图变体、语义标签和结构化属性。"
            : "A product catalog optimized for AI understanding, including intent variants, semantic tags, and structured attributes.",
        },
        {
          title: language === "zh" ? "品牌上下文" : "Brand Context",
          description: language === "zh"
            ? "帮助 AI 理解您品牌独特价值的额外信息，如品牌故事、目标受众和差异化要素。"
            : "Additional information that helps AI understand your brand's unique value, such as brand story, target audience, and differentiators.",
        },
        {
          title: language === "zh" ? "渠道控制" : "Channel Control",
          description: language === "zh"
            ? "管理您的产品在不同 AI 平台上的展示方式和可见性。"
            : "Manage how your products appear and their visibility across different AI platforms.",
        },
      ],
    },

    channels: {
      title: language === "zh" ? "支持的渠道" : "Supported Channels",
      alwaysOn: language === "zh" ? "始终启用" : "Always-on",
      configurable: language === "zh" ? "可配置" : "Configurable",
      items: [
        { name: "ChatGPT ACP", type: "always-on" },
        { name: "Gemini", type: "always-on" },
        { name: "Google AI Mode", type: "always-on" },
        { name: "Perplexity", type: "always-on" },
        { name: "Third Party Agents", type: "configurable" },
        { name: "ChatGPT App", type: "pro" },
        { name: "Reddit DPA", type: "pro" },
      ],
    },

    faq: {
      title: language === "zh" ? "常见问题" : "FAQ",
      items: [
        {
          q: language === "zh" ? "Nohi 如何收费？" : "How does Nohi pricing work?",
          a: language === "zh"
            ? "Nohi 基础版免费使用。Pro 版提供更多渠道和高级功能，按月订阅收费。"
            : "Nohi Basic is free to use. Pro offers more channels and advanced features with a monthly subscription.",
        },
        {
          q: language === "zh" ? "我的产品数据安全吗？" : "Is my product data secure?",
          a: language === "zh"
            ? "是的，我们使用行业标准加密保护您的数据，并且永远不会将您的数据出售给第三方。"
            : "Yes, we use industry-standard encryption to protect your data and never sell your data to third parties.",
        },
        {
          q: language === "zh" ? "需要技术背景吗？" : "Do I need technical expertise?",
          a: language === "zh"
            ? "不需要。Nohi 设计为无代码平台，任何人都可以在几分钟内完成设置。"
            : "No. Nohi is designed as a no-code platform that anyone can set up in minutes.",
        },
      ],
    },

    cta: {
      title: language === "zh" ? "准备开始了吗？" : "Ready to get started?",
      button: language === "zh" ? "连接您的商品目录" : "Connect Your Catalog",
    },
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {/* Introduction */}
      <section className="rounded-2xl bg-secondary/50 p-6 md:p-8">
        <h2 className="text-lg font-semibold text-foreground">{t.intro.title}</h2>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {t.intro.description}
        </p>
      </section>

      {/* Quick Start Steps */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">{t.steps.title}</h2>
        <div className="flex flex-col gap-3">
          {t.steps.items.map((step) => (
            <Link
              key={step.number}
              href={step.href}
              className="group rounded-2xl bg-secondary/50 p-5 flex items-start gap-4 transition-colors hover:bg-secondary/70"
            >
              <div className={cn(
                "size-8 rounded-full flex items-center justify-center shrink-0 text-sm font-medium",
                step.done 
                  ? "bg-green-500 text-white" 
                  : "bg-foreground/10 text-foreground"
              )}>
                {step.done ? <CheckCircle2 className="size-4" /> : step.number}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground group-hover:underline">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* Core Concepts */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">{t.concepts.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {t.concepts.items.map((concept) => (
            <div
              key={concept.title}
              className="rounded-2xl bg-secondary/50 p-5"
            >
              <h3 className="text-sm font-medium text-foreground">{concept.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {concept.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Channels */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">{t.channels.title}</h2>
        <div className="rounded-2xl bg-secondary/50 p-5">
          <div className="flex flex-wrap gap-2">
            {t.channels.items.map((channel) => (
              <div
                key={channel.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border"
              >
                <span className={cn(
                  "size-1.5 rounded-full",
                  channel.type === "always-on" ? "bg-green-500" :
                  channel.type === "pro" ? "bg-foreground/30" : "bg-yellow-500"
                )} />
                <span className="text-xs text-foreground">{channel.name}</span>
                {channel.type === "always-on" && (
                  <span className="text-[10px] text-muted-foreground">{t.channels.alwaysOn}</span>
                )}
                {channel.type === "pro" && (
                  <span className="text-[10px] text-muted-foreground uppercase">Pro</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">{t.faq.title}</h2>
        <div className="flex flex-col gap-3">
          {t.faq.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-secondary/50 p-5"
            >
              <h3 className="text-sm font-medium text-foreground">{item.q}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-foreground/5 p-6 md:p-8 flex flex-col items-center text-center">
        <h2 className="text-lg font-semibold text-foreground">{t.cta.title}</h2>
        <Button asChild className="mt-4 rounded-full px-6">
          <Link href="/seller/catalog/connectors">
            {t.cta.button}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
