"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Check, X, Globe, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

interface EditableRowProps {
  label: string
  value: string
  onSave: (v: string) => void
  options?: string[]
}

function EditableRow({ label, value, onSave, options }: EditableRowProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const handleSave = () => {
    onSave(draft)
    setEditing(false)
  }
  const handleCancel = () => {
    setDraft(value)
    setEditing(false)
  }

  return (
    <div className="flex items-center min-h-[72px] border-b border-border last:border-b-0">
      <div className="w-64 shrink-0 px-6 py-4">
        <span className="text-sm font-semibold text-foreground">{label}</span>
      </div>
      <div className="w-px self-stretch bg-border shrink-0" />
      <div className="flex-1 px-6 py-4 flex items-center justify-between gap-4">
        {editing ? (
          <div className="flex items-center gap-2 flex-1">
            {options ? (
              <div className="relative flex-1 max-w-xs">
                <select
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="w-full appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none text-muted-foreground" />
              </div>
            ) : (
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="max-w-xs rounded-lg h-8 text-sm"
                autoFocus
              />
            )}
            <button onClick={handleSave} className="size-7 flex items-center justify-center rounded-lg bg-foreground text-background hover:opacity-80 transition-opacity">
              <Check className="size-3.5" />
            </button>
            <button onClick={handleCancel} className="size-7 flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">{value}</span>
            <button
              onClick={() => { setDraft(value); setEditing(true) }}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            >
              <Pencil className="size-4" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const currencies = ["EUR", "USD", "GBP", "JPY", "CNY", "AUD", "CAD"]
const timezones = ["GMT", "GMT+1", "GMT+2", "GMT+8", "GMT-5", "GMT-8", "America/New_York", "Asia/Shanghai"]
const languages = ["English", "中文", "Français", "Deutsch", "Español", "日本語"]

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage()
  const [currency, setCurrency] = useState("EUR")
  const [timezone, setTimezone] = useState("GMT")
  const [lang, setLang] = useState("English")
  const [brandName, setBrandName] = useState("Nohi Demo Store")
  const [storeLink, setStoreLink] = useState("https://nohi-demo.myshopify.com")
  const [category, setCategory] = useState("Fashion & Apparel")

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto flex flex-col gap-10">

      {/* Breadcrumb */}
      <p className="text-xs text-muted-foreground">
        {language === "zh" ? "商店设置 · Demo Store" : "Store settings · Demo Store"}
      </p>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          {language === "zh" ? "商店设置" : "Store settings"}
        </h1>
      </div>

      {/* Language toggle */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Globe className="size-4" />
          {language === "zh" ? "界面语言" : "Interface language"}
        </h2>
        <div className="grid grid-cols-2 gap-3 max-w-xs">
          {(["en", "zh"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLanguage(l)}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                language === l
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background border-border text-foreground hover:bg-secondary"
              )}
            >
              <span>{l === "en" ? "English" : "中文"}</span>
              {language === l && <Check className="size-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Store Info */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-foreground">
          {language === "zh" ? "商店信息" : "Store information"}
        </h2>
        <div className="rounded-xl bg-popover overflow-hidden">
          <EditableRow
            label={language === "zh" ? "商店名称" : "Store name"}
            value={brandName}
            onSave={setBrandName}
          />
          <EditableRow
            label={language === "zh" ? "商店链接" : "Store URL"}
            value={storeLink}
            onSave={setStoreLink}
          />
          <EditableRow
            label={language === "zh" ? "品类" : "Category"}
            value={category}
            onSave={setCategory}
            options={["Fashion & Apparel", "Beauty & Personal Care", "Electronics", "Home & Garden", "Sports & Outdoors"]}
          />
        </div>
      </div>

      {/* Personal settings */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-foreground">
          {language === "zh" ? "个人偏好设置" : "Personal settings"}
        </h2>
        <div className="rounded-xl bg-popover overflow-hidden">
          <EditableRow
            label={language === "zh" ? "货币" : "Currency"}
            value={currency}
            onSave={setCurrency}
            options={currencies}
          />
          <EditableRow
            label={language === "zh" ? "时区" : "Timezone"}
            value={timezone}
            onSave={setTimezone}
            options={timezones}
          />
          <EditableRow
            label={language === "zh" ? "语言" : "Language"}
            value={lang}
            onSave={setLang}
            options={languages}
          />
        </div>
      </div>

      {/* Footer links */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-t border-border pt-6">
        {["Home", "Terms of sale", "Privacy policy", "Cookie Management", "Contact"].map((l) => (
          <a key={l} href="#" className="hover:text-foreground transition-colors">{l}</a>
        ))}
        <span className="ml-auto">Copyright ©2026 Nohi. All rights reserved.</span>
      </div>
    </div>
  )
}
