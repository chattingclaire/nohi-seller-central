"use client"

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import {
  Bar, BarChart, Line, LineChart,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Cell, Pie, PieChart, Tooltip,
} from "recharts"
import { Button } from "@/components/ui/button"
import {
  RefreshCw, Filter, Columns3, TriangleAlert,
  ChevronDown, Circle, Search, SlidersHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Data ────────────────────────────────────────────────────────────────────

const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"]

const aiSessionsData = [
  { month: "Nov", sessions: 0 },
  { month: "Dec", sessions: 0 },
  { month: "Jan", sessions: 0 },
  { month: "Feb", sessions: 2 },
  { month: "Mar", sessions: 29 },
  { month: "Apr", sessions: 4 },
]

const ordersData = [
  { month: "Nov", orders: 0 },
  { month: "Dec", orders: 0 },
  { month: "Jan", orders: 0 },
  { month: "Feb", orders: 0.1 },
  { month: "Mar", orders: 2 },
  { month: "Apr", orders: 0 },
]

const conversionData = [
  { month: "Nov", rate: 0 },
  { month: "Dec", rate: 0 },
  { month: "Jan", rate: 0 },
  { month: "Feb", rate: 0 },
  { month: "Mar", rate: 6.7 },
  { month: "Apr", rate: 0 },
]

const trafficSources = [
  { name: "Others",  value: 50, color: "#171717" },
  { name: "ChatGPT", value: 44, color: "#737373" },
  { name: "Gemini",  value: 6,  color: "#d4d4d4" },
]

const listingPerformance = [
  { name: "Classic Cotton Tee",    views: 842, favourites: 56, sales: 18 },
  { name: "Organic Linen Pants",   views: 621, favourites: 43, sales: 14 },
  { name: "Relaxed Fit Hoodie",    views: 518, favourites: 38, sales: 11 },
  { name: "Minimal Tote Bag",      views: 392, favourites: 27, sales: 8  },
  { name: "Merino Wool Scarf",     views: 284, favourites: 19, sales: 5  },
]

const CURRENCIES = ["EUR - €", "USD - $", "GBP - £", "CNY - ¥"]

// ─── Shared chart style ───────────────────────────────────────────────────────

const axisProps = {
  tick: { fontSize: 12, fill: "#737373" },
  axisLine: false as const,
  tickLine: false as const,
}

const gridProps = {
  strokeDasharray: "3 3" as const,
  vertical: false as const,
  stroke: "#e5e5e5",
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-secondary/50 p-5 flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-3xl font-bold text-foreground tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{sub}</span>
    </div>
  )
}

// ─── Chart card ───────────────────────────────────────────────────────────────

function ChartCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-secondary/50 p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      {children}
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ language }: { language: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative size-32 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-blue-50 dark:bg-blue-950/30" />
        <svg viewBox="0 0 120 100" className="relative size-28" fill="none">
          <circle cx="38" cy="52" r="24" stroke="#93c5fd" strokeWidth="10" fill="none" strokeDasharray="70 80" strokeLinecap="round" />
          <circle cx="38" cy="52" r="24" stroke="#f97316" strokeWidth="10" fill="none" strokeDasharray="30 120" strokeDashoffset="-70" strokeLinecap="round" />
          <rect x="68" y="62" width="8" height="22" rx="2" fill="#60a5fa" />
          <rect x="80" y="48" width="8" height="36" rx="2" fill="#34d399" />
          <rect x="92" y="38" width="8" height="46" rx="2" fill="#60a5fa" />
          <path d="M55 42 Q72 20 95 30" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M93 26 L95 30 L91 31" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="60" cy="18" r="2" fill="#fbbf24" />
          <circle cx="108" cy="42" r="1.5" fill="#f472b6" />
          <circle cx="20" cy="30" r="1.5" fill="#60a5fa" />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-2 text-center max-w-sm">
        <p className="text-sm font-semibold text-foreground">
          {language === "zh" ? "欢迎使用数据分析" : "Welcome to Analytics"}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {language === "zh"
            ? "数据分析帮助您了解广告效果，为 Campaign 决策提供依据。目前暂无直播 Campaign，准备好后即可创建第一个。"
            : "Analytics lets you see and understand how your ads perform to make informed decisions on your campaigns. Right now, it's empty, as you don't have any live campaigns. If you're ready, create your first one right now."}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="rounded-full px-6">
          {language === "zh" ? "了解更多" : "Learn more about Analytics"}
        </Button>
        <Button asChild className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/seller/campaigns">
            {language === "zh" ? "查看 Campaign" : "View campaigns"}
          </Link>
        </Button>
      </div>
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ language }: { language: string }) {
  return (
    <div className="flex flex-col gap-6">
      {/* 4 stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Clicks"     value="3"    sub="No prior data" />
        <StatCard label="AI Sessions"      value="34"   sub="No prior data" />
        <StatCard label="Total Orders"     value="2"    sub="No prior data" />
        <StatCard label="Conversion Rate"  value="5.9%" sub="No prior data" />
      </div>

      {/* AI Sessions + Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="AI Sessions"
          desc={language === "zh" ? "每月 AI 推荐访问量" : "Monthly AI-referred visits to your store"}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={aiSessionsData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} ticks={[0, 8, 16, 24, 32]} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e5e5" }}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
              />
              <Bar dataKey="sessions" fill="#171717" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Orders"
          desc={language === "zh" ? "总订单数量" : "Total number of orders placed."}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ordersData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} ticks={[0, 0.5, 1, 1.5, 2]} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e5e5" }} />
              <Line type="monotone" dataKey="orders" stroke="#171717" strokeWidth={2} dot={{ r: 4, fill: "#171717", stroke: "#fff", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Conversion Rate + Traffic Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Conversion Rate"
          desc={language === "zh" ? "完成购买的购物者百分比。" : "Percentage of agent shoppers who made a purchase."}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={conversionData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} ticks={[0, 2, 4, 6, 8]} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e5e5" }} />
              <Line type="monotone" dataKey="rate" stroke="#171717" strokeWidth={2} dot={{ r: 4, fill: "#171717", stroke: "#fff", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Traffic Sources"
          desc={language === "zh" ? "您的购物者来自哪里。" : "Where your agent shoppers come from."}
        >
          <div className="flex items-center gap-8">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={82}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90} endAngle={-270}
                >
                  {trafficSources.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {trafficSources.map((s) => (
                <div key={s.name} className="flex items-center gap-2.5 min-w-[120px]">
                  <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-foreground w-20">{s.name}</span>
                  <span className="text-sm font-semibold text-foreground tabular-nums">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Revenue card */}
      <div className="rounded-2xl bg-secondary/50 p-6 flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          {language === "zh" ? "收入（过去 30 天）" : "Revenue (last 30 days)"}
        </h3>
        <span className="text-4xl font-bold text-foreground tabular-nums">$0</span>
        <p className="text-sm text-muted-foreground">
          {language === "zh" ? "仅统计 AI 推荐的会话。" : "From AI-referred sessions only."}
        </p>
      </div>

      {/* Listing performance */}
      <div className="rounded-2xl bg-secondary/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            {language === "zh" ? "商品表现" : "Listing Performance"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {language === "zh" ? "浏览、收藏和销量最多的商品。" : "Which products get the most views, favourites, and sales."}
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Product", "Views", "Favourites", "Sales"].map((h) => (
                <th key={h} className={cn("px-6 py-3 text-xs font-medium text-muted-foreground", h !== "Product" && "text-right")}>
                  {language === "zh" ? { Product: "商品", Views: "浏览", Favourites: "收藏", Sales: "销量" }[h] : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listingPerformance.map((item) => (
              <tr key={item.name} className="border-b border-border last:border-0 hover:bg-black/5 transition-colors">
                <td className="px-6 py-3.5 font-medium text-foreground">{item.name}</td>
                <td className="px-6 py-3.5 text-right tabular-nums text-muted-foreground">{item.views.toLocaleString()}</td>
                <td className="px-6 py-3.5 text-right tabular-nums text-muted-foreground">{item.favourites}</td>
                <td className="px-6 py-3.5 text-right tabular-nums text-muted-foreground">{item.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Real Time Tab ────────────────────────────────────────────────────────────

function RealTimeTab({ language, currency, setCurrency }: {
  language: string
  currency: string
  setCurrency: (c: string) => void
}) {
  const lastUpdated = "8:22 PM"
  const [hasData] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      {/* toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {language === "zh" ? `最后更新 ${lastUpdated}` : `Last updated ${lastUpdated}`}
          </span>
          <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs h-8">
            <RefreshCw className="size-3.5" />
            {language === "zh" ? "更新" : "Update"}
          </Button>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Circle className="size-2.5 fill-blue-500 text-blue-500" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {language === "zh" ? "当前时段" : "Current period"}
          </span>
        </div>
      </div>

      {/* disclaimer */}
      <p className="text-sm text-muted-foreground">
        {language === "zh"
          ? "此处显示的数据与其他分析仪表板可能存在细微差异。"
          : "The data displayed here may show some slight differences compared to the data in other Analytics dashboards."}
      </p>

      {/* warning banner */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3">
        <TriangleAlert className="size-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300">
          {language === "zh"
            ? "所选日期范围的数据可能不完整。部分数据缺失，截至：Apr 18, 2026 12:00 AM"
            : "Displayed data may be incomplete for the selected date range. Some data are missing after: Apr 18, 2026 12:00 AM"}
        </p>
      </div>

      {!hasData ? <EmptyState language={language} /> : null}
    </div>
  )
}

// ─── Explore Tab ──────────────────────────────────────────────────────────────

function ExploreTab({ language }: { language: string }) {
  const dimensions = ["Channel", "Product", "Campaign", "Country", "Device", "Date"]
  const metrics    = ["Sessions", "Orders", "Revenue", "Conversion Rate", "Clicks", "Cost per Order"]
  const [selectedDims, setSelectedDims]   = useState<string[]>(["Channel"])
  const [selectedMets, setSelectedMets]   = useState<string[]>(["Sessions", "Orders"])

  const toggle = (list: string[], item: string, setList: (v: string[]) => void) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item])
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-secondary/50 p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            {language === "zh" ? "自定义维度与指标" : "Customize Dimensions & Metrics"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {language === "zh" ? "维度（分组依据）" : "Dimensions (Group by)"}
            </p>
            <div className="flex flex-wrap gap-2">
              {dimensions.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggle(selectedDims, d, setSelectedDims)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    selectedDims.includes(d)
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background border-border text-foreground hover:bg-secondary"
                  )}
                >{d}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {language === "zh" ? "指标（显示什么）" : "Metrics (Show)"}
            </p>
            <div className="flex flex-wrap gap-2">
              {metrics.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggle(selectedMets, m, setSelectedMets)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    selectedMets.includes(m)
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background border-border text-foreground hover:bg-secondary"
                  )}
                >{m}</button>
              ))}
            </div>
          </div>
        </div>

        <Button className="self-start rounded-full px-6 gap-2" size="sm">
          <Search className="size-3.5" />
          {language === "zh" ? "运行查询" : "Run Query"}
        </Button>
      </div>

      {/* Empty results placeholder */}
      <div className="rounded-2xl bg-secondary/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {language === "zh" ? "查询结果" : "Query Results"}
          </span>
          <span className="text-xs text-muted-foreground">
            {language === "zh" ? "0 行" : "0 rows"}
          </span>
        </div>
        <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          {language === "zh" ? "点击「运行查询」查看结果。" : "Click \"Run Query\" to see results."}
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = "overview" | "realtime" | "explore"

export default function AnalyticsPage() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [currency, setCurrency] = useState("EUR - €")

  const tabs: { id: Tab; label: string; labelZh: string }[] = [
    { id: "overview", label: "Overview",   labelZh: "概览"  },
    { id: "realtime", label: "Real time",  labelZh: "实时"  },
    { id: "explore",  label: "Explore",    labelZh: "探索"  },
  ]

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Top toolbar ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <p className="text-xs text-muted-foreground">
          {language === "zh" ? "数据分析 · Demo 商店" : "Analytics · Demo Store"}
        </p>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-2 size-3.5 pointer-events-none text-muted-foreground" />
          </div>
          <Button variant="outline" size="icon" className="size-8 rounded-lg">
            <Filter className="size-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="size-8 rounded-lg">
            <Columns3 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Page header ── */}
      <div className="px-6 pt-6 pb-0 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {language === "zh" ? "数据分析" : "Analytics"}
        </h1>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-0 border-b border-border mt-4 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === tab.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {language === "zh" ? tab.labelZh : tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="flex flex-col gap-5 px-6 py-6 max-w-6xl w-full mx-auto">
        {activeTab === "overview" && <OverviewTab language={language} />}
        {activeTab === "realtime" && (
          <RealTimeTab language={language} currency={currency} setCurrency={setCurrency} />
        )}
        {activeTab === "explore" && <ExploreTab language={language} />}
      </div>
    </div>
  )
}
