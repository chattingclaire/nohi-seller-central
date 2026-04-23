"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { SectionWrapper } from "@/components/seller/section-wrapper"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, Trash2, ArrowLeft, Search, CheckCircle2, 
  Image as ImageIcon, Video, ExternalLink, Link2
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface UGCAsset {
  id: string
  creator: string
  platform: "Instagram" | "TikTok" | "YouTube" | "Twitter" | "Other"
  type: "image" | "video"
  caption: string
  sourceUrl?: string
  date: string
  approved: boolean
}

const initialUGC: UGCAsset[] = [
  {
    id: "u1",
    creator: "@style_with_sarah",
    platform: "Instagram",
    type: "image",
    caption: "Styled the new organic linen pants for a casual brunch look. So comfortable!",
    sourceUrl: "https://instagram.com/p/example1",
    date: "2026-02-12",
    approved: true,
  },
  {
    id: "u2",
    creator: "@minareviews",
    platform: "TikTok",
    type: "video",
    caption: "Unboxing the spring collection - the packaging alone is worth it!",
    sourceUrl: "https://tiktok.com/@minareviews/video/example",
    date: "2026-02-10",
    approved: true,
  },
  {
    id: "u3",
    creator: "@dailyjames",
    platform: "Instagram",
    type: "image",
    caption: "My go-to hoodie for WFH days. This brand just gets it.",
    sourceUrl: "https://instagram.com/p/example3",
    date: "2026-02-06",
    approved: false,
  },
  {
    id: "u4",
    creator: "@fashionfwd",
    platform: "YouTube",
    type: "video",
    caption: "Full review of the sustainable spring line - worth every penny?",
    sourceUrl: "https://youtube.com/watch?v=example",
    date: "2026-02-01",
    approved: false,
  },
]

const platformColors: Record<string, string> = {
  Instagram: "bg-pink-500/10 text-pink-600",
  TikTok: "bg-black/10 text-black dark:bg-white/10 dark:text-white",
  YouTube: "bg-red-500/10 text-red-600",
  Twitter: "bg-blue-500/10 text-blue-500",
  Other: "bg-secondary text-muted-foreground",
}

export default function UGCPage() {
  const { language } = useLanguage()
  const [ugc, setUGC] = useState(initialUGC)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPlatform, setFilterPlatform] = useState<string>("all")

  const translations = {
    title: language === "zh" ? "UGC 素材库" : "UGC Asset Library",
    subtitle: language === "zh" ? "管理用户生成的内容。批准后 Agent 可以向购物者展示。" : "Manage user-generated content. Approved UGC can be surfaced by agents to shoppers.",
    back: language === "zh" ? "返回" : "Back",
    addUGC: language === "zh" ? "添加 UGC" : "Add UGC",
    ugcTotal: language === "zh" ? "条 UGC" : "UGC items",
    noUGC: language === "zh" ? "暂无 UGC。添加用户生成的内容开始。" : "No UGC yet. Add user-generated content to get started.",
    all: language === "zh" ? "全部" : "All",
    approved: language === "zh" ? "已批准" : "Approved",
    pending: language === "zh" ? "待审核" : "Pending",
    search: language === "zh" ? "搜索创作者或内容..." : "Search creators or content...",
    approve: language === "zh" ? "批准" : "Approve",
    reject: language === "zh" ? "拒绝" : "Reject",
    image: language === "zh" ? "图片" : "Image",
    video: language === "zh" ? "视频" : "Video",
    addUGCTitle: language === "zh" ? "添加 UGC 内容" : "Add UGC Content",
    addUGCDesc: language === "zh" ? "记录来自社交媒体的用户生成内容。" : "Record user-generated content from social media.",
    creatorHandle: language === "zh" ? "创作者账号" : "Creator Handle",
    creatorPlaceholder: language === "zh" ? "例如：@username" : "e.g. @username",
    platform: language === "zh" ? "平台" : "Platform",
    contentType: language === "zh" ? "内容类型" : "Content Type",
    caption: language === "zh" ? "内容描述" : "Caption/Description",
    captionPlaceholder: language === "zh" ? "UGC 内容的描述或标题..." : "Description or caption of the UGC...",
    sourceUrl: language === "zh" ? "原始链接（可选）" : "Source URL (optional)",
    sourceUrlPlaceholder: language === "zh" ? "例如：https://instagram.com/p/..." : "e.g. https://instagram.com/p/...",
    add: language === "zh" ? "添加" : "Add",
    cancel: language === "zh" ? "取消" : "Cancel",
    viewSource: language === "zh" ? "查看原文" : "View Source",
    approvedCount: language === "zh" ? "已批准" : "Approved",
    pendingCount: language === "zh" ? "待审核" : "Pending",
  }

  const filteredUGC = ugc.filter(u => {
    const matchesSearch = searchQuery === "" || 
      u.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.caption.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "approved" && u.approved) ||
      (filterStatus === "pending" && !u.approved)
    const matchesPlatform = filterPlatform === "all" || u.platform === filterPlatform
    return matchesSearch && matchesStatus && matchesPlatform
  })

  const handleAddUGC = (item: Omit<UGCAsset, "id" | "date" | "approved">) => {
    setUGC(prev => [{
      ...item,
      id: String(Date.now()),
      date: new Date().toISOString().slice(0, 10),
      approved: false,
    }, ...prev])
  }

  const handleApprove = (id: string) => {
    setUGC(prev => prev.map(u => u.id === id ? { ...u, approved: true } : u))
  }

  const handleReject = (id: string) => {
    setUGC(prev => prev.filter(u => u.id !== id))
  }

  const approvedCount = ugc.filter(u => u.approved).length
  const pendingCount = ugc.filter(u => !u.approved).length

  return (
    <SectionWrapper
      title={translations.title}
      subtitle={translations.subtitle}
    >
      {/* Back Link */}
      <Link 
        href="/seller/brand-context/posts-ugc" 
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="size-4" />
        {translations.back}
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl bg-secondary/50 p-4">
          <p className="text-2xl font-semibold tabular-nums">{ugc.length}</p>
          <p className="text-xs text-muted-foreground">{translations.ugcTotal}</p>
        </div>
        <div className="rounded-xl bg-secondary/50 p-4">
          <p className="text-2xl font-semibold tabular-nums text-green-600">{approvedCount}</p>
          <p className="text-xs text-muted-foreground">{translations.approvedCount}</p>
        </div>
        <div className="rounded-xl bg-secondary/50 p-4">
          <p className="text-2xl font-semibold tabular-nums text-amber-600">{pendingCount}</p>
          <p className="text-xs text-muted-foreground">{translations.pendingCount}</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={translations.search}
              className="pl-9 rounded-full h-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-28 h-9 text-xs rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{translations.all}</SelectItem>
              <SelectItem value="approved">{translations.approved}</SelectItem>
              <SelectItem value="pending">{translations.pending}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className="w-28 h-9 text-xs rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{translations.all}</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AddUGCDialog
          translations={translations}
          onAdd={handleAddUGC}
          language={language}
        />
      </div>

      {/* UGC Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {filteredUGC.map((item) => (
          <div
            key={item.id}
            className={cn(
              "rounded-2xl overflow-hidden flex flex-col group",
              item.approved ? "bg-secondary/50" : "bg-amber-500/5 border border-amber-500/20"
            )}
          >
            {/* Media Preview */}
            <div className="h-32 bg-secondary flex items-center justify-center relative">
              {item.type === "image" ? (
                <ImageIcon className="size-8 text-muted-foreground/40" />
              ) : (
                <Video className="size-8 text-muted-foreground/40" />
              )}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <Badge className={cn("text-xs", platformColors[item.platform])}>
                  {item.platform}
                </Badge>
                <Badge variant="secondary" className="text-xs capitalize">
                  {item.type === "image" ? translations.image : translations.video}
                </Badge>
              </div>
              {item.approved && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="size-5 text-green-600" />
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col gap-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {item.creator}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {item.date}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                {item.caption}
              </p>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <ExternalLink className="size-3" />
                    {translations.viewSource}
                  </a>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2">
                  {!item.approved ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs h-7 px-3"
                        onClick={() => handleApprove(item.id)}
                      >
                        {translations.approve}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-xs h-7 px-3 text-destructive hover:text-destructive"
                        onClick={() => handleReject(item.id)}
                      >
                        {translations.reject}
                      </Button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReject(item.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUGC.length === 0 && (
        <div className="rounded-2xl bg-secondary/50 p-10 text-center text-sm text-muted-foreground mt-4">
          {translations.noUGC}
        </div>
      )}
    </SectionWrapper>
  )
}

function AddUGCDialog({
  translations,
  onAdd,
  language,
}: {
  translations: Record<string, string>
  onAdd: (item: Omit<UGCAsset, "id" | "date" | "approved">) => void
  language: string
}) {
  const [open, setOpen] = useState(false)
  const [creator, setCreator] = useState("")
  const [platform, setPlatform] = useState<UGCAsset["platform"]>("Instagram")
  const [type, setType] = useState<"image" | "video">("image")
  const [caption, setCaption] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")

  const handleSubmit = () => {
    if (!creator.trim() || !caption.trim()) return
    onAdd({ 
      creator, 
      platform, 
      type, 
      caption, 
      sourceUrl: sourceUrl.trim() || undefined 
    })
    resetForm()
    setOpen(false)
  }

  const resetForm = () => {
    setCreator("")
    setPlatform("Instagram")
    setType("image")
    setCaption("")
    setSourceUrl("")
  }

  // Auto-detect platform from URL
  const handleUrlChange = (url: string) => {
    setSourceUrl(url)
    const lower = url.toLowerCase()
    if (lower.includes("instagram.com")) {
      setPlatform("Instagram")
    } else if (lower.includes("tiktok.com")) {
      setPlatform("TikTok")
      setType("video")
    } else if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
      setPlatform("YouTube")
      setType("video")
    } else if (lower.includes("twitter.com") || lower.includes("x.com")) {
      setPlatform("Twitter")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full text-xs gap-1.5">
          <Plus className="size-3.5" />
          {translations.addUGC}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle>{translations.addUGCTitle}</DialogTitle>
          <DialogDescription>{translations.addUGCDesc}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          {/* Source URL first for auto-detection */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm flex items-center gap-1.5">
              <Link2 className="size-3.5" />
              {translations.sourceUrl}
            </Label>
            <Input
              value={sourceUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={translations.sourceUrlPlaceholder}
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              {language === "zh" ? "粘贴链接自动识别平台" : "Paste link to auto-detect platform"}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.creatorHandle}</Label>
            <Input
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              placeholder={translations.creatorPlaceholder}
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">{translations.platform}</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as UGCAsset["platform"])}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">{translations.contentType}</Label>
              <Select value={type} onValueChange={(v) => setType(v as "image" | "video")}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">{translations.image}</SelectItem>
                  <SelectItem value="video">{translations.video}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.caption}</Label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={translations.captionPlaceholder}
              rows={3}
              className="rounded-xl resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">
            {translations.cancel}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!creator.trim() || !caption.trim()} 
            className="rounded-full"
          >
            {translations.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
