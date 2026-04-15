"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Check, ChevronDown, Globe } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

const categories = [
  "Fashion & Apparel",
  "Beauty & Personal Care",
  "Electronics",
  "Home & Garden",
  "Sports & Outdoors",
  "Toys & Games",
  "Food & Beverages",
  "Health & Wellness",
  "Books & Media",
  "Jewelry & Accessories",
]

const gmvRanges = [
  "Less than $100K",
  "$100K - $500K",
  "$500K - $1M",
  "$1M - $5M",
  "$5M - $10M",
  "More than $10M",
]

export default function SettingsPage() {
  const [brandName, setBrandName] = useState("Nohi Demo Store")
  const [storeLink, setStoreLink] = useState("https://nohi-demo.myshopify.com")
  const [category, setCategory] = useState("Fashion & Apparel")
  const [gmvRange, setGmvRange] = useState("$500K - $1M")
  const [teamSize, setTeamSize] = useState("8")
  const [isSaving, setIsSaving] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 800)
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/seller"
          className="flex size-8 items-center justify-center rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {t("settings.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("settings.description")}
          </p>
        </div>
      </div>

      {/* Language Settings */}
      <div className="flex flex-col gap-4 rounded-2xl bg-secondary/50 p-6">
        <div className="flex items-center gap-2">
          <Globe className="size-5 text-foreground" />
          <h2 className="text-base font-medium text-foreground">{t("settings.language")}</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("settings.languageDesc")}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl transition-all",
              language === "en"
                ? "bg-foreground text-background"
                : "bg-secondary/50 hover:bg-secondary text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">EN</span>
              <span className="text-sm font-medium">English</span>
            </div>
            {language === "en" && <Check className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => setLanguage("zh")}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl transition-all",
              language === "zh"
                ? "bg-foreground text-background"
                : "bg-secondary/50 hover:bg-secondary text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">中</span>
              <span className="text-sm font-medium">简体中文</span>
            </div>
            {language === "zh" && <Check className="size-4" />}
          </button>
        </div>
        {language === "zh" && (
          <p className="text-xs text-muted-foreground">
            {t("settings.languageNote")}
          </p>
        )}
      </div>

      {/* Store Information Form - Collapsible */}
      <Collapsible defaultOpen={false} className="rounded-2xl bg-secondary/50 bg-popover">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-6 text-left">
          <h2 className="text-base font-medium text-foreground">{t("settings.storeInfo")}</h2>
          <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-6 pb-6">
          <div className="flex flex-col gap-6">
            {/* Brand Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand-name" className="text-sm font-medium">
                {t("settings.brandName")}
              </Label>
              <Input
                id="brand-name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Your brand name"
                className="rounded-xl"
              />
            </div>

            {/* Store Link */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="store-link" className="text-sm font-medium">
                {t("settings.storeLink")}
              </Label>
              <Input
                id="store-link"
                value={storeLink}
                onChange={(e) => setStoreLink(e.target.value)}
                placeholder="https://your-store.myshopify.com"
                className="rounded-xl"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="category" className="text-sm font-medium">
                {t("settings.category")}
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="rounded-xl">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Yearly GMV Range */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="gmv-range" className="text-sm font-medium">
                {t("settings.gmvRange")}
              </Label>
              <Select value={gmvRange} onValueChange={setGmvRange}>
                <SelectTrigger id="gmv-range" className="rounded-xl">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {gmvRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Team Size */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="team-size" className="text-sm font-medium">
                {t("settings.teamSize")}
              </Label>
              <Input
                id="team-size"
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="e.g. 5"
                className="rounded-xl"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="rounded-xl"
              >
                {t("settings.cancel")}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl"
              >
                {isSaving ? t("settings.saving") : t("settings.saveChanges")}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Additional Info */}
      <div className="rounded-xl bg-secondary/50 bg-secondary/50 p-4">
        <p className="text-xs text-muted-foreground">
          {t("settings.additionalInfo")}
        </p>
      </div>
    </div>
  )
}
