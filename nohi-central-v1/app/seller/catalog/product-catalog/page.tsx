"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  Info,
  Copy,
  Pencil,
  MoreVertical,
  ChevronDown,
  CheckCircle2,
  Circle,
  Download,
  X,
  Search,
  Flag,
  Link2 as LinkIcon,
  Upload,
  Package,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"

// ─── Onboarding Banner ───────────────────────────────────────────────────────

function OnboardingBanner() {
  const { t } = useLanguage()
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div className="flex items-center justify-between gap-4 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-900 px-6 py-2.5 text-sm">
      <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
        <Info className="size-4 shrink-0" />
        <span>{t("productCatalog.onboardingBanner")}</span>
      </div>
      <Link
        href="/seller/onboarding"
        className="shrink-0 font-semibold text-blue-800 dark:text-blue-300 underline hover:opacity-70 transition-opacity whitespace-nowrap"
      >
        {t("productCatalog.goToOnboarding")}
      </Link>
    </div>
  )
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange?: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!enabled)}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0",
        enabled ? "bg-foreground" : "bg-border"
      )}
    >
      <span
        className={cn(
          "inline-block size-3.5 transform rounded-full bg-background transition-transform",
          enabled ? "translate-x-4" : "translate-x-1"
        )}
      />
    </button>
  )
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const feedData = [
  {
    id: "457546",
    name: "tvep6e-s6",
    url: "https://tvep6e-s6.myshopify.com",
    logoUrl: "/placeholder.svg",
    stability: "60%",
    autoImport: false,
    schedule: "",
    linkedFeed: "-",
    lastStatus: "success",
    lastDate: "April 13, 2026 9:21:02 PM UTC",
  },
]

const productData = [
  {
    id: "p1",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KfnKqfLwIh7yo93owx2UcZwolOgIku.png",
    name: "Europe Double Layered Zircon Hoop Earrings For Women Gold Silver Color Personality Punk Earring Party Jewelry Gifts - 01 Gold Color / 2pcs",
    displayable: true,
    description:
      "SPECIFICATIONS Stand out with these daring double-layered hoop earrings crafted from a striking blend of Tibetan silver and copper. Featuring sparkling zircon accents, their bold design combines punk edge with elegant flair, perfect for making a st...",
    url: "https://tvep6e-s6.myshopify.com/products/europe-double-layered-zircon-hoop-earrings-for-women-gold-silver-color-personality-punk-earring-party-jewelry-gifts?variant=50618109591894",
    price: "$7.15",
    retailPrice: "--",
    brand: "Venvia",
    stock: null,
  },
  {
    id: "p2",
    image: null,
    name: "Minimalist Gold Chain Necklace - Dainty Layered Pendant",
    displayable: true,
    description: "A sleek, minimalist necklace crafted from 18k gold-plated brass with a delicate pendant charm. Perfect for everyday wear or special occasions.",
    url: "https://tvep6e-s6.myshopify.com/products/minimalist-gold-chain-necklace",
    price: "$12.50",
    retailPrice: "$15.00",
    brand: "Venvia",
    stock: 84,
  },
  {
    id: "p3",
    image: null,
    name: "Crystal Butterfly Hair Clip Set - 4 Pack Pastel Colors",
    displayable: false,
    description: "Set of 4 butterfly hair clips featuring iridescent crystal embellishments. Lightweight and comfortable for all hair types.",
    url: "https://tvep6e-s6.myshopify.com/products/crystal-butterfly-hair-clip-set",
    price: "$4.99",
    retailPrice: "$8.00",
    brand: "Venvia",
    stock: 231,
  },
]

// ─── Chart helpers ────────────────────────────────────────────────────────────

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const globalStatsData = [
  { date: "4/13/26", displayable: 41, notDisplayable: 1 },
]

const productDetailsData = [
  { date: "4/13/26", withoutGoogleCategory: 42 },
]

const DONUT_DATA = [
  { value: 0 },
  { value: 100 },
]

function GlobalStatsChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={globalStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 50]} ticks={[0, 10, 20, 30, 40, 50]} />
        <ReTooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)", background: "var(--popover)" }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Line type="monotone" dataKey="displayable" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} name="Displayable" />
        <Line type="monotone" dataKey="notDisplayable" stroke="#f97316" strokeWidth={2} dot={{ r: 4, fill: "#f97316" }} name="Not displayable" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function ProductDetailsChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={productDetailsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 50]} ticks={[0, 10, 20, 30, 40, 50]} />
        <ReTooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)", background: "var(--popover)" }}
          labelStyle={{ fontWeight: 600 }}
          formatter={(value: number, name: string) => [value, name]}
          labelFormatter={(label, payload) => {
            const feedId = "457546"
            return `${label}\nFeed ID: ${feedId}`
          }}
        />
        <Line type="monotone" dataKey="withoutGoogleCategory" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }} name="Without Google Category" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function DonutChart() {
  return (
    <div className="relative flex items-center justify-center" style={{ height: 200 }}>
      <PieChart width={180} height={180}>
        <Pie
          data={DONUT_DATA}
          cx={85}
          cy={85}
          innerRadius={60}
          outerRadius={80}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          strokeWidth={0}
        >
          <Cell fill="hsl(var(--muted))" />
          <Cell fill="hsl(var(--muted)/0.2)" />
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-semibold text-foreground">0%</span>
      </div>
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

const importHistoryData = [
  {
    id: "imp-1",
    date: "April 13, 2026 9:21 PM UTC",
    importTime: "0h03m",
    feedId: "457546",
    status: "success",
    type: "Manual",
    totalProducts: 42,
    added: 42,
    updated: 0,
    deleted: 0,
  },
]

function OverviewTab() {
  const { t, language } = useLanguage()
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  return (
    <div className="flex flex-col gap-8">
      {/* Your dashboard */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">{t("productCatalog.yourDashboard")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action needed */}
          <div className="rounded-xl bg-popover p-5 flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">{t("productCatalog.actionNeeded")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("productCatalog.actionNeededDesc")}</p>
            </div>
            <div className="flex items-center gap-3 mt-auto">
              <CheckCircle2 className="size-8 text-green-500 shrink-0" />
              <p className="text-sm text-foreground">{t("productCatalog.noIssues")}</p>
            </div>
          </div>

          {/* Feed status */}
          <div className="rounded-xl bg-popover p-5 flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">{t("productCatalog.feedStatus")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("productCatalog.feedStatusDesc")}</p>
            </div>
            <div className="flex items-center gap-3">
              <Circle className="size-8 text-yellow-400 shrink-0" strokeWidth={2.5} />
              <p className="text-sm text-foreground">{t("productCatalog.noScheduledImport")}</p>
            </div>
            <div className="mt-auto">
              <Button size="sm" className="rounded-full text-xs">
                {t("productCatalog.goToFeeds")}
              </Button>
            </div>
          </div>

          {/* Performance insights */}
          <div className="rounded-xl bg-popover p-5 flex flex-col gap-4">
            <p className="text-sm font-semibold text-foreground">{t("productCatalog.performanceInsights")}</p>
            <div className="flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 px-3 py-2.5">
              <Info className="size-3.5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 dark:text-blue-300">
                <span className="font-semibold">{t("productCatalog.insightTip").split(" to ")[0]}</span>
                {" to "}
                {t("productCatalog.insightTip").split(" to ").slice(1).join(" to ")}
              </p>
            </div>
            <div className="mt-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-full text-xs gap-1.5">
                <Download className="size-3.5" />
                {t("productCatalog.downloadReport")}
              </Button>
              <Button size="sm" className="rounded-full text-xs">
                {t("productCatalog.seeAll")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual feed banner */}
      {!bannerDismissed && (
        <div className="flex items-center justify-between gap-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 px-5 py-3.5">
          <div className="flex items-center gap-2.5 text-sm text-violet-800 dark:text-violet-300">
            <Flag className="size-4 shrink-0" />
            <span>{t("productCatalog.manualFeedBanner")}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="text-xs text-violet-700 dark:text-violet-400 underline hover:opacity-70 transition-opacity">
              {t("productCatalog.learnMore")}
            </button>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-violet-500 hover:text-violet-700 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Get the latest updates */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">{t("productCatalog.latestUpdates")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Global product stats */}
          <div className="rounded-xl bg-popover p-5 flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{t("productCatalog.globalStats")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {language === "zh" ? "查看过去 1 次导入中目录的组成情况。" : "Check your catalog's composition over the last 1 imports."}
              </p>
            </div>
            <GlobalStatsChart />
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-3 rounded-full border-2 border-blue-500 bg-background" />
                {language === "zh" ? "可展示" : "Displayable"}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-3 rounded-full border-2 border-orange-500 bg-background" />
                {language === "zh" ? "不可展示" : "Not displayable"}
              </span>
            </div>
          </div>

          {/* Products details */}
          <div className="rounded-xl bg-popover p-5 flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{t("productCatalog.productsDetails")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {language === "zh" ? "查看过去 1 次导入中商品的详情。" : "Check the details of products over the last 1 imports."}
              </p>
            </div>
            <ProductDetailsChart />
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-3 rounded-full border-2 border-green-500 bg-background" />
                {language === "zh" ? "无 Google 分类" : "Without Google Category"}
              </span>
            </div>
          </div>

          {/* Catalog and events match rate */}
          <div className="rounded-xl bg-popover p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <p className="text-sm font-semibold text-foreground">{t("productCatalog.matchRate")}</p>
              <Info className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
            </div>
            <p className="text-xs text-muted-foreground">
              {language === "zh"
                ? "查看过去 10 天内目录商品与广告展示商品的匹配情况。"
                : "See how products in your catalog matched with products displayed in your ads over the last 10 days."}
            </p>
            <DonutChart />
            <div className="mt-auto">
              <Button size="sm" className="rounded-full text-xs w-full">
                {language === "zh" ? "提升分数" : "Improve your score"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Your last feed imports */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {language === "zh" ? "您的最近 Feed 导入" : "Your last feed imports"}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {language === "zh" ? "快速了解您的导入详情。" : "Skimming infos and dig deep into your imports."}
          </p>
        </div>

        <div className="rounded-xl bg-popover overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {[
                  language === "zh" ? "导入日期" : "Import date",
                  language === "zh" ? "Feed ID" : "Feed ID",
                  language === "zh" ? "导入状态" : "Import status",
                  language === "zh" ? "导入类型" : "Import type",
                  language === "zh" ? "商品总数" : "Total products",
                  language === "zh" ? "新增" : "Added",
                  language === "zh" ? "更新" : "Updated",
                  language === "zh" ? "删除" : "Deleted",
                  language === "zh" ? "操作" : "Actions",
                ].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {importHistoryData.map((row) => (
                <tr key={row.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-4">
                    <p className="text-sm text-foreground whitespace-nowrap">{row.date}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {language === "zh" ? `导入时长: ${row.importTime}` : `Import time: ${row.importTime}`}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground tabular-nums">{row.feedId}</td>
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-1.5 text-sm text-green-600 whitespace-nowrap">
                      <CheckCircle2 className="size-4" />
                      {language === "zh" ? "成功" : "Success"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">{row.type}</td>
                  <td className="px-4 py-4 text-sm text-foreground tabular-nums text-center">{row.totalProducts}</td>
                  <td className="px-4 py-4 text-sm text-foreground tabular-nums text-center">{row.added}</td>
                  <td className="px-4 py-4 text-sm text-foreground tabular-nums text-center">{row.updated}</td>
                  <td className="px-4 py-4 text-sm text-foreground tabular-nums text-center">{row.deleted}</td>
                  <td className="px-4 py-4">
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{language === "zh" ? "每页条数:" : "Items per page:"}</span>
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="appearance-none bg-popover border border-border rounded-lg pl-3 pr-7 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 pointer-events-none text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>1 – 1 {language === "zh" ? "共" : "of"} 1</span>
            <button disabled className="size-7 rounded-lg border border-border flex items-center justify-center opacity-40">
              <ChevronDown className="size-3.5 rotate-90" />
            </button>
            <button className="size-7 rounded-lg border border-border bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
              1
            </button>
            <button disabled className="size-7 rounded-lg border border-border flex items-center justify-center opacity-40">
              <ChevronDown className="size-3.5 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Products Empty State ─────────────────────────────────────────────────────

function ProductsEmptyState({ onConnectFeed, onManualUpload }: { onConnectFeed: () => void; onManualUpload: () => void }) {
  const { t, language } = useLanguage()
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
      <div className="size-16 rounded-2xl bg-secondary flex items-center justify-center">
        <Package className="size-8 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="text-base font-semibold text-foreground">
          {language === "zh" ? "尚未导入任何商品" : "No products imported yet"}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {language === "zh"
            ? "通过连接 Feed 或手动上传商品，将您的产品导入至 Nohi Agentic 目录。"
            : "Import your products into the Nohi Agentic Catalog by connecting a feed or uploading manually."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button onClick={onConnectFeed} className="rounded-full gap-2 min-w-[160px]">
          <LinkIcon className="size-4" />
          {language === "zh" ? "连接 Feed" : "Connect Feed"}
        </Button>
        <Button onClick={onManualUpload} variant="outline" className="rounded-full gap-2 min-w-[160px]">
          <Upload className="size-4" />
          {language === "zh" ? "手动上传" : "Manual Upload"}
        </Button>
      </div>
    </div>
  )
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab({ onConnectFeed, onManualUpload }: { onConnectFeed: () => void; onManualUpload: () => void }) {
  const { t } = useLanguage()
  const [subTab, setSubTab] = useState<"displayable" | "blocked" | "unblock">("displayable")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const hasProducts = productData.length > 0

  const displayable = productData.filter((p) => p.displayable)
  const blocked = productData.filter((p) => !p.displayable)

  const subTabs = [
    { id: "displayable" as const, label: `${t("productCatalog.displayable")} ${displayable.length}` },
    { id: "blocked" as const, label: `${t("productCatalog.blocked")} ${blocked.length}` },
    { id: "unblock" as const, label: `${t("productCatalog.unblockReq")} 0` },
  ]

  const rows = subTab === "displayable" ? displayable : subTab === "blocked" ? blocked : []

  const toggleAll = () => {
    if (selected.length === rows.length) setSelected([])
    else setSelected(rows.map((r) => r.id))
  }
  const toggleOne = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  if (!hasProducts) {
    return <ProductsEmptyState onConnectFeed={onConnectFeed} onManualUpload={onManualUpload} />
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Sub-tabs */}
      <div className="flex gap-0 border-b border-border">
        {subTabs.map((st) => (
          <button
            key={st.id}
            onClick={() => setSubTab(st.id)}
            className={cn(
              "px-4 py-2 text-sm border-b-2 -mb-px transition-colors",
              subTab === st.id
                ? "border-blue-500 text-blue-600 font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Section title */}
      <div>
        <h3 className="text-base font-semibold text-foreground">{t("productCatalog.listOfLive")}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{t("productCatalog.listDesc")}</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("productCatalog.searchPlaceholder")}
          className="w-full bg-popover border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="h-px bg-border" />

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" className="rounded-xl text-xs">
          {t("productCatalog.hideProducts")}
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl text-xs">
          {t("productCatalog.exportDetails")}
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl text-xs">
          {t("productCatalog.seeProductDetails")}
        </Button>
      </div>

      {/* Products table */}
      <div className="rounded-xl bg-popover overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 w-8">
                <input
                  type="checkbox"
                  checked={selected.length === rows.length && rows.length > 0}
                  onChange={toggleAll}
                  className="rounded"
                />
              </th>
              {[
                "productCatalog.colImage",
                "productCatalog.colProductId",
                "productCatalog.colDisplayable",
                "productCatalog.colDescription",
                "productCatalog.colProductUrl",
                "productCatalog.colPrice",
                "productCatalog.colRetailPrice",
                "productCatalog.colBrand",
                "productCatalog.colStock",
              ].map((k) => (
                <th key={k} className="text-left px-4 py-3 text-xs font-semibold text-foreground whitespace-nowrap">
                  {t(k)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => toggleOne(product.id)}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-14 object-cover rounded-md border border-border"
                    />
                  ) : (
                    <div className="size-14 rounded-md border border-border bg-secondary flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">—</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 max-w-[200px]">
                  <p className="text-xs text-foreground leading-relaxed">{product.name}</p>
                </td>
                <td className="px-4 py-4">
                  {product.displayable ? (
                    <CheckCircle2 className="size-5 text-green-500" />
                  ) : (
                    <Circle className="size-5 text-muted-foreground" />
                  )}
                </td>
                <td className="px-4 py-4 max-w-[260px]">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{product.description}</p>
                </td>
                <td className="px-4 py-4 max-w-[220px]">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 underline break-all leading-relaxed"
                  >
                    {product.url}
                  </a>
                </td>
                <td className="px-4 py-4 text-sm text-foreground tabular-nums whitespace-nowrap">{product.price}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                  {product.retailPrice}
                </td>
                <td className="px-4 py-4 text-sm text-foreground whitespace-nowrap">{product.brand}</td>
                <td className="px-4 py-4 text-sm text-foreground tabular-nums whitespace-nowrap">
                  {product.stock !== null ? product.stock : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Feeds Empty State ────────────────────────────────────────────────────────

function FeedsEmptyState({ onConnectFeed, onManualUpload }: { onConnectFeed: () => void; onManualUpload: () => void }) {
  const { language } = useLanguage()
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
      <div className="size-16 rounded-2xl bg-secondary flex items-center justify-center">
        <LinkIcon className="size-8 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="text-base font-semibold text-foreground">
          {language === "zh" ? "尚未连接任何 Feed" : "No feeds connected yet"}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {language === "zh"
            ? "连接您的商品 Feed 或手动上传，将商品同步至 Nohi Agentic 目录。"
            : "Connect your product feed or upload manually to sync products into the Nohi Agentic Catalog."}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button onClick={onConnectFeed} className="rounded-full gap-2 min-w-[160px]">
          <LinkIcon className="size-4" />
          {language === "zh" ? "连接 Feed" : "Connect Feed"}
        </Button>
        <Button onClick={onManualUpload} variant="outline" className="rounded-full gap-2 min-w-[160px]">
          <Upload className="size-4" />
          {language === "zh" ? "手动上传" : "Manual Upload"}
        </Button>
      </div>
    </div>
  )
}

// ─── Feeds Tab ────────────────────────────────────────────────────────────────

function FeedsTab({ onConnectFeed, onManualUpload }: { onConnectFeed: () => void; onManualUpload: () => void }) {
  const { t } = useLanguage()
  const [feeds, setFeeds] = useState(feedData)

  const toggleAutoImport = (id: string) => {
    setFeeds((prev) =>
      prev.map((f) => (f.id === id ? { ...f, autoImport: !f.autoImport } : f))
    )
  }

  const columns = [
    { labelKey: "productCatalog.colFeedId", hasInfo: false },
    { labelKey: "productCatalog.colFeedName", hasInfo: false },
    { labelKey: "productCatalog.colFeedUrl", hasInfo: false },
    { labelKey: "productCatalog.colStability", hasInfo: true },
    { labelKey: "productCatalog.colAutoImport", hasInfo: false },
    { labelKey: "productCatalog.colSchedule", hasInfo: false },
    { labelKey: "productCatalog.colLinkedFeed", hasInfo: true },
    { labelKey: "productCatalog.colLastStatus", hasInfo: false },
    { labelKey: "productCatalog.colActions", hasInfo: false },
  ]

  if (feeds.length === 0) {
    return <FeedsEmptyState onConnectFeed={onConnectFeed} onManualUpload={onManualUpload} />
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Filter dropdown */}
      <div className="relative w-44">
        <select className="appearance-none w-full bg-popover border border-border rounded-xl pl-4 pr-9 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer">
          <option value="paused">On, Paused</option>
          <option value="all">All</option>
          <option value="active">Active</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      </div>

      {/* Feeds table */}
      <div className="rounded-xl bg-popover overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map(({ labelKey, hasInfo }) => (
                <th
                  key={labelKey}
                  className="text-left px-4 py-3 text-xs font-semibold text-foreground whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {t(labelKey)}
                    {hasInfo && <Info className="size-3 text-muted-foreground" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {feeds.map((feed) => (
              <tr key={feed.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                <td className="px-4 py-4 text-foreground tabular-nums text-sm">{feed.id}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2">
                    <div className="size-8 rounded bg-secondary border border-border flex items-center justify-center overflow-hidden shrink-0">
                      <span className="text-[10px] text-muted-foreground">Logo</span>
                    </div>
                    <span className="text-sm text-foreground">{feed.name}</span>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="size-3.5" />
                    </button>
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-xs text-foreground max-w-[180px] truncate">{feed.url}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(feed.url)}
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
                    {feed.stability}
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="size-3.5" />
                    </button>
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2">
                    <Toggle
                      enabled={feed.autoImport}
                      onChange={() => toggleAutoImport(feed.id)}
                    />
                    <span className="text-muted-foreground text-xs">
                      {feed.autoImport ? t("productCatalog.statusOn") : t("productCatalog.statusOff")}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-4 text-muted-foreground text-sm">—</td>
                <td className="px-4 py-4 text-muted-foreground text-sm text-center">-</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400">
                      <CheckCircle2 className="size-3.5 text-green-500" />
                      {t("productCatalog.statusSuccess")}
                    </span>
                    <span className="text-xs text-muted-foreground">{feed.lastDate}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreVertical className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Connect Feed Modal ───────────────────────────────────────────────────────

function ConnectFeedModal({ open, onClose, language }: { open: boolean; onClose: () => void; language: string }) {
  const [url, setUrl] = useState("")
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-popover border border-border rounded-2xl p-6 w-full max-w-md flex flex-col gap-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {language === "zh" ? "连接 Feed" : "Connect Feed"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "zh"
                ? "输入您的商品 Feed URL，Nohi 将自动同步商品至 Agentic 目录。"
                : "Enter your product feed URL and Nohi will automatically sync products into the Agentic Catalog."}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            {language === "zh" ? "Feed URL" : "Feed URL"}
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourstore.myshopify.com/products.json"
            className="bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl">
            {language === "zh" ? "取消" : "Cancel"}
          </Button>
          <Button size="sm" onClick={onClose} className="rounded-xl gap-2" disabled={!url}>
            <LinkIcon className="size-4" />
            {language === "zh" ? "连接" : "Connect"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Manual Upload Modal ──────────────────────────────────────────────────────

function ManualUploadModal({ open, onClose, language }: { open: boolean; onClose: () => void; language: string }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-popover border border-border rounded-2xl p-6 w-full max-w-md flex flex-col gap-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {language === "zh" ? "手动上传" : "Manual Upload"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "zh"
                ? "上传 CSV 或 Excel 文件，将商品批量导入至 Nohi Agentic 目录。"
                : "Upload a CSV or Excel file to bulk import products into the Nohi Agentic Catalog."}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-xl py-10 px-6 bg-secondary/30">
          <Upload className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            {language === "zh"
              ? "拖拽文件至此处，或点击选择文件"
              : "Drag & drop a file here, or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground">CSV, XLSX — {language === "zh" ? "最大 50MB" : "max 50 MB"}</p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl">
            {language === "zh" ? "取消" : "Cancel"}
          </Button>
          <Button size="sm" onClick={onClose} className="rounded-xl gap-2">
            <Upload className="size-4" />
            {language === "zh" ? "上传" : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductCatalogPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "feeds">("overview")
  const [connectFeedOpen, setConnectFeedOpen] = useState(false)
  const [manualUploadOpen, setManualUploadOpen] = useState(false)
  const { t, language } = useLanguage()

  const tabs = [
    { id: "overview" as const, labelKey: "productCatalog.tabOverview" },
    { id: "products" as const, labelKey: "productCatalog.tabProducts" },
    { id: "feeds" as const, labelKey: "productCatalog.tabFeeds" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <OnboardingBanner />

      <ConnectFeedModal open={connectFeedOpen} onClose={() => setConnectFeedOpen(false)} language={language} />
      <ManualUploadModal open={manualUploadOpen} onClose={() => setManualUploadOpen(false)} language={language} />

      <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-6">
        {/* Breadcrumb */}
        <p className="text-xs text-muted-foreground">{t("productCatalog.breadcrumb")}</p>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">{t("productCatalog.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("productCatalog.desc")}</p>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-0 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "products" && (
          <ProductsTab
            onConnectFeed={() => setConnectFeedOpen(true)}
            onManualUpload={() => setManualUploadOpen(true)}
          />
        )}
        {activeTab === "feeds" && (
          <FeedsTab
            onConnectFeed={() => setConnectFeedOpen(true)}
            onManualUpload={() => setManualUploadOpen(true)}
          />
        )}
      </div>
    </div>
  )
}
