"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "@/components/seller/tag-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  Send,
  FileText,
  Image as ImageIcon,
  Film,
  File,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Paperclip,
  ArrowRight,
  Plus,
  ArrowUp,
} from "lucide-react"

/* ───────── Types ───────── */

interface UploadedFile {
  id: string
  name: string
  type: "pdf" | "image" | "video" | "document" | "other"
  size: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  files?: string[]
  timestamp: Date
}

/* ───────── File helpers ───────── */

const fileIcon = (type: UploadedFile["type"], size = "size-4") => {
  switch (type) {
    case "pdf": return <FileText className={cn(size, "text-red-500")} />
    case "image": return <ImageIcon className={cn(size, "text-blue-500")} />
    case "video": return <Film className={cn(size, "text-purple-500")} />
    case "document": return <FileText className={cn(size, "text-orange-500")} />
    default: return <File className={cn(size, "text-muted-foreground")} />
  }
}

const getFileType = (name: string): UploadedFile["type"] => {
  const ext = name.split(".").pop()?.toLowerCase() || ""
  if (["pdf"].includes(ext)) return "pdf"
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return "image"
  if (["mp4", "mov", "avi", "webm"].includes(ext)) return "video"
  if (["doc", "docx", "pptx", "ppt", "txt", "csv", "xlsx"].includes(ext)) return "document"
  return "other"
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / 1048576).toFixed(1) + " MB"
}

/* ───────── Tag option data (from original pages) ───────── */

const categoryOptions = [
  "Fashion & Apparel", "Beauty & Personal Care", "Electronics", "Home & Living",
  "Health & Wellness", "Sports & Outdoors", "Toys & Games", "Food & Beverage",
  "Pet Supplies", "Jewelry & Accessories", "Baby & Kids", "Office & Stationery",
]
const aovTiers = ["< $50", "$50 - $120", "$120 - $300", "$300+"]
const purchaseTypes = ["Impulse", "Considered", "Gifting"]

const audienceDefaults = [
  "Gen Z Women", "Millennials", "Working Professionals", "College Students", "Parents",
  "Fitness Enthusiasts", "Tech Savvy", "Eco-Conscious", "Luxury Seekers", "Budget Shoppers",
  "Gift Buyers", "Home Makers", "Urban Dwellers", "Trendsetters", "Digital Natives",
]
const audienceMore = [
  "Outdoor Lovers", "Frequent Travelers", "New Parents", "Remote Workers",
  "Hobbyists", "Fashion Enthusiasts", "Gamers", "Foodies", "Pet Owners", "DIY Makers",
]

const scenarioDefaults = [
  "Self-Care", "Date Night", "Back to School", "Holiday Gifting", "Workwear", "Travel",
  "Home Office", "Outdoor Activities", "Wedding", "Baby Shower", "Housewarming",
  "Graduation", "Weekend Casual", "Gym & Fitness",
]
const scenarioMore = [
  "Beach Vacation", "Music Festival", "Job Interview", "Dinner Party",
  "Movie Night", "Game Day", "Road Trip", "Picnic", "Anniversary", "Birthday",
]

const intentDefaults = [
  "Trendy & New", "Affordable Basics", "Premium Quality", "Sustainable Choice",
  "Gift Under $50", "Bulk Order", "Subscription", "Try Before Buy",
  "Last Minute Gift", "Seasonal Must-Have", "Everyday Essential", "Luxury Treat",
]
const intentMore = [
  "Exclusive Drop", "Limited Edition", "Value Pack", "Restock Favorite",
  "Clearance Find", "Bundle Deal", "Free Shipping", "Next-Day Delivery", "Eco-Friendly",
]

const styleDefaults = [
  "Minimalist", "Maximalist", "Scandinavian", "Bohemian", "Industrial", "Streetwear",
  "Classic", "Retro", "Futuristic", "Organic", "Luxury", "Casual", "Sporty", "Elegant",
  "Playful", "Earthy Tones", "Monochrome", "Pastel",
]
const styleMore = [
  "Bold & Bright", "Neutral", "Clean Lines", "Textured", "Matte Finish", "Glossy",
  "Handcrafted", "Art Deco", "Brutalist", "Cottagecore", "Y2K", "Grunge",
]

const excludedAudienceDefaults = [
  "Minors", "Children Under 13", "Pregnant Women", "Elderly", "Medical Patients",
  "Allergy Sensitive", "Visually Impaired", "Hearing Impaired", "Mental Health Sensitive",
  "Immunocompromised", "Substance Recovery", "Eating Disorder Recovery",
]
const excludedAudienceMore = [
  "Mobility Challenged", "Photosensitive", "Lactose Intolerant", "Gluten Sensitive",
  "Fragrance Sensitive", "UV Sensitive", "Chemotherapy Patients", "Post-Surgery Recovery",
]

const prohibitedScenarioDefaults = [
  "Medical Treatment", "Legal Advice", "Financial Investment", "Children's Unsupervised Use",
  "Hazardous Environments", "Emergency Situations", "Driving While Using",
  "Heavy Machinery Operation", "Underwater Use", "Extreme Heat Exposure",
  "Aviation Context", "Military Context", "Gambling Context", "Political Campaigning",
]
const prohibitedScenarioMore = [
  "Religious Ceremony", "Court Proceeding", "Lab Environment", "Construction Site",
  "Mining Operation", "Chemical Handling", "Nuclear Facility", "Space Application",
]

const blockedKeywordDefaults = [
  "cheap", "knockoff", "counterfeit", "diet pill", "miracle cure", "get rich quick",
  "weight loss", "anti-aging miracle", "fake", "bootleg", "replica", "scam", "spam", "hoax", "fraud",
]
const blockedKeywordMore = [
  "pyramid scheme", "ponzi", "snake oil", "quack", "placebo", "unregulated",
  "banned substance", "black market",
]

/* ───────── Steps ───────── */

interface StepDef {
  key: string
  title: { en: string; zh: string }
  description: { en: string; zh: string }
  guide: { en: string; zh: string }
  suggestedFiles: { en: string; zh: string }
}

const stepDefs: StepDef[] = [
  {
    key: "details",
    title: { en: "Details", zh: "详情" },
    description: { en: "Core category, AOV tier, purchase type, audience, scenario and intent tags.", zh: "核心品类、客单价层级、购买类型、受众、场景和意图标签。" },
    guide: {
      en: "Let's start with the basics. Upload your product catalog or pitch deck, and Nohi will extract your category, pricing tier, and target audience. Or just fill in the fields directly.",
      zh: "我们从基础信息开始。上传您的产品目录或品牌介绍，Nohi 会自动提取品类、价格定位和目标受众。您也可以直接填写右侧的字段。",
    },
    suggestedFiles: { en: "PDF, PPT, DOC, IMG, CSV...", zh: "PDF、PPT、DOC、图片、CSV..." },
  },
  {
    key: "brand-story",
    title: { en: "Brand Story", zh: "品牌故事" },
    description: { en: "150-word brand story and founder note for agents to reference.", zh: "150字品牌故事和创始人寄语供智能体参考。" },
    guide: {
      en: "Now let's capture your brand narrative. Upload your brand guideline PDF or About Us page, and Nohi will draft your brand story and founder note.",
      zh: "现在来记录您的品牌叙事。上传品牌手册PDF或关于我们页面，Nohi 会自动生成品牌故事和创始人寄语的草稿。",
    },
    suggestedFiles: { en: "PDF, PPT, DOC, IMG, CSV...", zh: "PDF、PPT、DOC、图片、CSV..." },
  },
  {
    key: "visual-style",
    title: { en: "Visual Style", zh: "视觉风格" },
    description: { en: "Style tags that help agents understand your brand aesthetic.", zh: "帮助智能体理解您品牌美学的风格标签。" },
    guide: {
      en: "Let's define your visual identity. Upload your logo, brand style guide, or any design assets. Nohi will extract style tags and brand colors.",
      zh: "来定义您的视觉风格。上传Logo、品牌风格指南或设计素材，Nohi 会提取风格标签和品牌色彩。",
    },
    suggestedFiles: { en: "PDF, PPT, DOC, IMG, CSV...", zh: "PDF、PPT、DOC、图片、CSV..." },
  },
  {
    key: "guardrails",
    title: { en: "Guardrails", zh: "品牌护栏" },
    description: { en: "Define excluded audiences, prohibited scenarios, and blocked keywords.", zh: "定义排除的受众、禁止的场景和屏蔽的关键词。" },
    guide: {
      en: "Almost there — let's set guardrails. Upload compliance docs or brand policy, and Nohi will identify audiences, scenarios, and keywords to avoid.",
      zh: "快完成了 — 设置品牌护栏。上传合规文档或品牌政策，Nohi 会识别需要排除的受众、场景和关键词。",
    },
    suggestedFiles: { en: "PDF, PPT, DOC, IMG, CSV...", zh: "PDF、PPT、DOC、图片、CSV..." },
  },
  {
    key: "fulfillment",
    title: { en: "Fulfillment", zh: "履约配送" },
    description: { en: "Shipping SLA, return policy, processing time, and regional settings.", zh: "配送SLA、退换政策、处理时间和区域设置。" },
    guide: {
      en: "Last step! Upload your return policy or shipping guide. Nohi will extract processing times, SLAs, and return terms.",
      zh: "最后一步！上传退换政策或物流指南，Nohi 会提取处理时间、配送SLA和退换条款。",
    },
    suggestedFiles: { en: "PDF, PPT, DOC, IMG, CSV...", zh: "PDF、PPT、DOC、图片、CSV..." },
  },
]

/* ───────── Main Component ───────── */

export default function BrandContextPage() {
  const { t, language } = useLanguage()
  const zh = language === "zh"

  const [currentStep, setCurrentStep] = useState(0)
  const step = stepDefs[currentStep]

  // ── Chat state ──
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [showFilePicker, setShowFilePicker] = useState(false)
  const [filesExpanded, setFilesExpanded] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<UploadedFile[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // ── Form state (original fields from each page) ──
  // Details
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAov, setSelectedAov] = useState("")
  const [selectedPurchaseType, setSelectedPurchaseType] = useState("")
  const [audienceTags, setAudienceTags] = useState<string[]>([])
  const [scenarioTags, setScenarioTags] = useState<string[]>([])
  const [intentTags, setIntentTags] = useState<string[]>([])
  // Brand Story
  const [brandStory, setBrandStory] = useState("")
  const [founderNote, setFounderNote] = useState("")
  // Visual Style
  const [styleTags, setStyleTags] = useState<string[]>([])
  // Guardrails
  const [excludedAudiences, setExcludedAudiences] = useState<string[]>([])
  const [prohibitedScenarios, setProhibitedScenarios] = useState<string[]>([])
  const [blockedKeywords, setBlockedKeywords] = useState<string[]>([])
  // Fulfillment
  const [processingTime, setProcessingTime] = useState("")
  const [onTimeRate, setOnTimeRate] = useState("")
  const [returnRate, setReturnRate] = useState("")
  const [damageRate, setDamageRate] = useState("")
  const [refundTime, setRefundTime] = useState("")
  const [returnPolicy, setReturnPolicy] = useState("")

  // Show full guide card when no messages exist (user hasn't interacted yet)
  const hasInteracted = messages.length > 0
  const hasFilesUploaded = files.length > 0
  const showGuideCard = !hasInteracted

  const scrollToBottom = useCallback(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }, [])
  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  const wordCount = (text: string) => text.trim().split(/\s+/).filter((w) => w).length

  /* ── File handling ── */

  const addFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      type: getFileType(f.name),
      size: formatSize(f.size),
    }))
    setPendingFiles((prev) => [...prev, ...newFiles])
  }, [])

  const removePendingFile = (id: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== id))
  }

  /* ── Simulated parse ── */

  const simulateParse = useCallback((uploadedFileNames: string[]) => {
    setTimeout(() => {
      // Fill ALL steps at once
      setSelectedCategories(["Fashion & Apparel"])
      setSelectedAov("$50 - $120")
      setSelectedPurchaseType("Considered")
      setAudienceTags(["Gen Z Women", "Millennials", "Eco-Conscious"])
      setScenarioTags(["Self-Care", "Workwear", "Weekend Casual", "Home Office"])
      setIntentTags(["Sustainable Choice", "Premium Quality", "Everyday Essential"])
      setBrandStory("We started with a simple idea: everyday essentials should look and feel intentional. Born in 2022, our brand combines clean design with sustainable materials, creating products that fit naturally into modern life. Every piece is designed in-house, with a focus on quality over quantity.")
      setFounderNote("I launched this brand after years in the fashion industry feeling frustrated by the gap between fast fashion and inaccessible luxury. I believe great design should be available to everyone, made responsibly, and built to last. - Alex Chen, Founder")
      setStyleTags(["Minimalist", "Clean Lines", "Sustainable", "Scandinavian"])
      // Guardrails: only partially filled to demo "incomplete" state
      setExcludedAudiences(["Minors", "Children Under 13"])
      setProhibitedScenarios(["Medical Treatment", "Legal Advice"])
      // blockedKeywords left empty — needs compliance doc
      // Fulfillment: basic metrics only
      setProcessingTime("3-5")
      setOnTimeRate("96")
      // returnRate, damageRate, refundTime, returnPolicy left empty — needs return policy doc

      const fileList = uploadedFileNames.length > 0 ? uploadedFileNames.join(zh ? "、" : ", ") : ""

      const response = zh
        ? `✅ 已解析${fileList ? ` ${fileList}` : "您的描述"}，以下内容已自动填充：\n\n✓ 「详情」— 已填充品类、客单价、受众和场景标签，点击步骤 1 查看\n✓ 「品牌故事」— 已生成品牌故事和创始人寄语，点击步骤 2 查看\n✓ 「视觉风格」— 已识别 4 个风格标签，点击步骤 3 查看\n\n⚠️ 以下内容尚未完全覆盖，建议补充：\n\n• 「品牌护栏」— 目前仅设置了基础规则，如有合规文档或品牌政策可继续上传\n• 「履约配送」— 已填充基本指标，如有详细退换政策文档可补充上传\n\n您可以点击上方对应步骤直接查看和编辑，也可以在这里告诉我需要调整的内容。`
        : `✅ Parsed${fileList ? ` ${fileList}` : " your description"}. Here's what was filled:\n\n✓ "Details" — category, AOV, audience & scenario tags filled → click Step 1 to review\n✓ "Brand Story" — narrative and founder note generated → click Step 2 to review\n✓ "Visual Style" — 4 style tags identified → click Step 3 to review\n\n⚠️ These sections need more info:\n\n• "Guardrails" — only basic rules set. Upload compliance docs or brand policy for better coverage\n• "Fulfillment" — basic metrics filled. Upload a detailed return policy doc to complete\n\nClick any step above to review and edit, or tell me what to adjust here.`

      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }])
    }, 1200)
  }, [zh])

  /* ── Send message (with files) ── */

  const handleSend = useCallback(() => {
    const text = inputValue.trim()
    const hasFiles = pendingFiles.length > 0
    if (!text && !hasFiles) return

    const uploadedNames = pendingFiles.map((f) => f.name)

    // Add files to global list
    if (hasFiles) {
      setFiles((prev) => [...prev, ...pendingFiles])
    }

    // Build message content
    let content = text
    if (hasFiles && !text) {
      content = zh
        ? `上传了 ${uploadedNames.join("、")}`
        : `Uploaded ${uploadedNames.join(", ")}`
    }

    setMessages((prev) => [...prev, {
      id: crypto.randomUUID(),
      role: "user",
      content,
      files: hasFiles ? uploadedNames : undefined,
      timestamp: new Date(),
    }])

    setInputValue("")
    setPendingFiles([])
    // no special action needed - messages array growing hides the first guide

    if (hasFiles) {
      simulateParse(uploadedNames)
    } else {
      // Text-only: contextual response based on whether files were already uploaded
      setTimeout(() => {
        const alreadyHasFiles = files.length > 0
        setMessages((prev) => [...prev, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: alreadyHasFiles
            ? (zh
              ? "收到！你可以用 @ 引用已上传的文件，或者直接在右侧表单里编辑对应的字段 ✏️"
              : "Got it! You can use @ to reference uploaded files, or edit the fields directly on the right ✏️")
            : (zh
              ? "收到你的消息！上传品牌文件（PDF、PPT、图片等），Nohi 会帮你自动填充表单。\n\n你也可以直接在右侧表单里手动编辑 ✏️"
              : "Got your message! Upload brand files (PDF, PPT, images, etc.) and Nohi will auto-fill the form for you.\n\nYou can also edit the form on the right directly ✏️"),
          timestamp: new Date(),
        }])
      }, 800)
    }
  }, [inputValue, pendingFiles, zh, simulateParse, files.length])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    const fileList: File[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.kind === "file") {
        const file = item.getAsFile()
        if (file) fileList.push(file)
      }
    }
    if (fileList.length > 0) {
      e.preventDefault()
      const dt = new DataTransfer()
      fileList.forEach((f) => dt.items.add(f))
      addFiles(dt.files)
    }
  }, [addFiles])

  const insertAtMention = (fileName: string) => {
    setInputValue((prev) => prev + `@${fileName} `)
    setShowFilePicker(false)
    inputRef.current?.focus()
  }

  /* ── Metric input helper ── */
  function MetricInput({ label, value, onChange, suffix }: { label: string; value: string; onChange: (v: string) => void; suffix: string }) {
    return (
      <div className="rounded-xl bg-secondary/50 p-3 flex flex-col gap-1.5">
        <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
        <div className="flex items-baseline gap-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-transparent text-lg font-semibold text-foreground tabular-nums w-full outline-none"
          />
          <span className="text-xs text-muted-foreground shrink-0">{suffix}</span>
        </div>
      </div>
    )
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const storyWords = wordCount(brandStory)
  const noteWords = wordCount(founderNote)

  /* ───────── Render ───────── */

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* ── Step progress ── */}
      <div className="shrink-0 border-b border-border px-6 py-3">
        <div className="flex items-center gap-1">
          {stepDefs.map((s, i) => {
            const isCurrent = i === currentStep
            const isDone = i < currentStep
            return (
              <div key={s.key} className="flex items-center gap-1 flex-1 min-w-0">
                <button
                  onClick={() => setCurrentStep(i)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 min-w-0",
                    isCurrent
                      ? "bg-foreground text-background"
                      : isDone
                        ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  <span className={cn(
                    "size-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold",
                    isCurrent ? "bg-background text-foreground"
                      : isDone ? "bg-emerald-500 text-white"
                        : "bg-muted-foreground/20 text-muted-foreground"
                  )}>
                    {isDone ? <Check className="size-3" /> : i + 1}
                  </span>
                  <span className="truncate">{zh ? s.title.zh : s.title.en}</span>
                </button>
                {i < stepDefs.length - 1 && <ChevronRight className="size-3 text-muted-foreground/40 shrink-0" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Main: left chat (narrow) + right form (wide) ── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">

        {/* ═══ LEFT: Chat panel (narrow) ═══ */}
        <div className="w-[300px] shrink-0 flex flex-col border-r border-border bg-secondary/20 overflow-hidden">
          {/* Uploaded files list — collapsible */}
          {files.length > 0 && (
            <div className="shrink-0 border-b border-border">
              <button
                type="button"
                onClick={() => setFilesExpanded((v) => !v)}
                className="w-full flex items-center gap-1.5 px-3 py-1.5 hover:bg-secondary/50 transition-colors"
              >
                <Paperclip className="size-3 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground flex-1 text-left">
                  {files.length} {zh ? "个文件" : files.length === 1 ? "file" : "files"}
                </span>
                <ChevronRight className={cn("size-3 text-muted-foreground transition-transform", filesExpanded && "rotate-90")} />
              </button>
              {filesExpanded && (
                <div className="flex flex-col gap-0.5 px-3 pb-2">
                  {files.map((f) => (
                    <div key={f.id} className="flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[11px]">
                      {fileIcon(f.type, "size-3")}
                      <span className="text-foreground truncate flex-1">{f.name}</span>
                      <span className="text-muted-foreground text-[9px] shrink-0">{f.size}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Guide card + Chat messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3 p-3">
              {/* ── Onboarding / hint ── */}
              {showGuideCard && currentStep === 0 && (
                /* First step, no interaction: guide card */
                <div className="w-full max-w-[250px] mx-auto rotate-[-0.5deg] my-2">
                  <div className="bg-background border border-border rounded-sm p-4 shadow-[2px_3px_8px_rgba(0,0,0,0.06)] relative">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-amber-100/80 rounded-sm" />
                    <div className="flex flex-col gap-3 pt-0.5">
                      <p className="text-[13px] text-foreground leading-relaxed" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                        {zh
                          ? "👋 嗨！欢迎来到品牌中心。"
                          : "👋 Hey! Welcome to Brand Context."}
                      </p>
                      <p className="text-[11px] text-foreground/80 leading-relaxed" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                        {zh
                          ? "把你的品牌文件粘贴或拖到下方输入框就好 — 品牌手册、产品目录、设计稿、政策文档都行。Nohi 会帮你读取内容，自动填好右边的表单。"
                          : "Just paste or drop your brand files into the input below — style guides, catalogs, design assets, policy docs, anything. Nohi will read through them and fill out the form on the right for you."}
                      </p>
                      <div className="border-t border-dashed border-border pt-2.5">
                        <p className="text-[11px] text-foreground/60 leading-relaxed" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                          {zh
                            ? "当然，你也可以直接编辑右边的表单，想怎么填都行 ✏️"
                            : "Or just edit the form on the right directly — it's all yours ✏️"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {showGuideCard && currentStep > 0 && (
                /* Other steps, no interaction: per-step guide card */
                <div className="w-full max-w-[250px] mx-auto rotate-[-0.5deg] my-2">
                  <div className="bg-background border border-border rounded-sm p-3.5 shadow-[2px_3px_8px_rgba(0,0,0,0.06)] relative">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-amber-100/80 rounded-sm" />
                    <div className="flex flex-col gap-2 pt-0.5">
                      <p className="text-xs text-foreground leading-relaxed" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                        {zh ? step.guide.zh : step.guide.en}
                      </p>
                      <div className="border-t border-dashed border-border pt-2">
                        <p className="text-[11px] text-muted-foreground" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                          {zh
                            ? "上传相关文件或直接填写右侧表单。在下方对话中描述也可以。"
                            : "Upload relevant files, fill the form on the right, or describe in chat below."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* hint bar removed */}

              {/* ── Chat bubbles ── */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-0.5",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  {msg.files && msg.files.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-0.5">
                      {msg.files.map((f) => (
                        <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">📎 {f}</span>
                      ))}
                    </div>
                  )}
                  <div className={cn(
                    "rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap max-w-[95%]",
                    msg.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-background text-foreground border border-border"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* ── Claude-style combined input ── */}
          <div className="shrink-0 p-3">
            {/* @file picker */}
            {showFilePicker && files.length > 0 && (
              <div className="rounded-lg border border-border bg-background shadow-lg p-1 mb-2 flex flex-col gap-0.5">
                {files.map((f) => (
                  <button key={f.id} onClick={() => insertAtMention(f.name)} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary text-left text-xs">
                    {fileIcon(f.type, "size-3.5")}
                    <span className="font-medium truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring/20 transition-all">
              {/* Pending file chips */}
              {pendingFiles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-3 pt-2.5">
                  {pendingFiles.map((f) => (
                    <div key={f.id} className="flex items-center gap-1.5 pl-2 pr-1 py-0.5 rounded-md bg-secondary text-xs">
                      {fileIcon(f.type, "size-3")}
                      <span className="truncate max-w-[100px]">{f.name}</span>
                      <button onClick={() => removePendingFile(f.id)} className="text-muted-foreground hover:text-foreground p-0.5">
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Textarea */}
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setShowFilePicker(e.target.value.slice(-1) === "@" && files.length > 0)
                }}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                rows={2}
                className="w-full bg-transparent px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none resize-none"
                placeholder={
                  hasFilesUploaded
                    ? (zh
                        ? "已自动填充，可编辑或描述调整..."
                        : "Auto-filled. Edit or describe changes...")
                    : (zh
                        ? "描述品牌或上传文件让Nohi解析..."
                        : "Describe your brand or upload files...")
                }
              />

              {/* Bottom bar: attach + hint + send */}
              <div className="flex items-center gap-1 px-2 pb-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Paperclip className="size-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.pptx,.ppt,.txt,.csv,.xlsx,.jpg,.jpeg,.png,.gif,.svg,.webp,.mp4,.mov"
                  className="hidden"
                  onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = "" }}
                />
                <span className="text-[10px] text-muted-foreground flex-1 truncate">
                  {zh ? step.suggestedFiles.zh : step.suggestedFiles.en}
                </span>
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() && pendingFiles.length === 0}
                  className={cn(
                    "size-7 rounded-lg flex items-center justify-center transition-colors",
                    inputValue.trim() || pendingFiles.length > 0
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <ArrowUp className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: Original form fields ═══ */}
        <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
            <div className="px-4 py-4 flex flex-col gap-5 max-w-full">
              {/* Step header */}
              <div>
                <h2 className="text-sm font-semibold text-foreground tracking-tight">
                  {zh ? step.title.zh : step.title.en}
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {zh ? step.description.zh : step.description.en}
                </p>
              </div>

              {/* ── DETAILS step ── */}
              {step.key === "details" && (
                <>
                  {/* Core Category */}
                  <FormSection title={zh ? "核心品类" : "Core Category"} description={zh ? "选择您品牌的主要产品品类。" : "Select your brand's primary product categories."}>
                    <div className="flex flex-wrap gap-1.5">
                      {categoryOptions.map((cat) => (
                        <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                          className={cn("px-2 py-0.5 rounded-md border text-[11px] font-medium transition-all",
                            selectedCategories.includes(cat)
                              ? "bg-foreground text-background border-foreground"
                              : "bg-secondary border-border text-foreground hover:bg-secondary/80"
                          )}>{cat}</button>
                      ))}
                    </div>
                  </FormSection>

                  {/* AOV + Purchase Type side by side */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormSection title={zh ? "客单价层级" : "AOV Tier"} description={zh ? "平均客单价范围。" : "Average order value range."}>
                      <div className="flex flex-wrap gap-1.5">
                        {aovTiers.map((tier) => (
                          <button key={tier} type="button" onClick={() => setSelectedAov(tier)}
                            className={cn("px-2 py-0.5 rounded-md border text-[11px] font-medium transition-all",
                              selectedAov === tier
                                ? "bg-foreground text-background border-foreground"
                                : "bg-secondary border-border text-foreground hover:bg-secondary/80"
                            )}>{tier}</button>
                        ))}
                      </div>
                    </FormSection>

                    <FormSection title={zh ? "购买类型" : "Purchase Type"} description={zh ? "购买决策方式。" : "Purchase decision type."}>
                      <div className="flex flex-wrap gap-1.5">
                        {purchaseTypes.map((type) => (
                          <button key={type} type="button" onClick={() => setSelectedPurchaseType(type)}
                            className={cn("px-2 py-0.5 rounded-md border text-[11px] font-medium transition-all",
                              selectedPurchaseType === type
                                ? "bg-foreground text-background border-foreground"
                                : "bg-secondary border-border text-foreground hover:bg-secondary/80"
                            )}>{type}</button>
                        ))}
                      </div>
                    </FormSection>
                  </div>

                  {/* Audience */}
                  <FormSection title={zh ? "目标受众" : "Primary Audience"} description={zh ? "选择或添加目标受众群体。" : "Select or add target audience segments."}>
                    <TagInput allTags={audienceDefaults} selected={audienceTags} onSelectedChange={setAudienceTags} moreTags={audienceMore} placeholder={zh ? "输入自定义受众标签..." : "Type a custom audience tag..."} />
                  </FormSection>

                  {/* Scenarios */}
                  <FormSection title={zh ? "场景标签" : "Scenario Tags"} description={zh ? "产品最适合的使用场景。" : "Best-suited usage scenarios."}>
                    <TagInput allTags={scenarioDefaults} selected={scenarioTags} onSelectedChange={setScenarioTags} moreTags={scenarioMore} placeholder={zh ? "输入自定义场景标签..." : "Type a custom scenario tag..."} />
                  </FormSection>

                  {/* Intents */}
                  <FormSection title={zh ? "意图标签" : "Intent Tags"} description={zh ? "消费者的购买意图。" : "Primary purchase intents."}>
                    <TagInput allTags={intentDefaults} selected={intentTags} onSelectedChange={setIntentTags} moreTags={intentMore} placeholder={zh ? "输入自定义意图标签..." : "Type a custom intent tag..."} />
                  </FormSection>
                </>
              )}

              {/* ── BRAND STORY step ── */}
              {step.key === "brand-story" && (
                <>
                  <FormSection title={zh ? "品牌故事" : "Brand Story"} description={zh ? "150字以内，供AI智能体参考。" : "150 words or less for AI agents to reference."}>
                    <div className="flex flex-col gap-1.5">
                      <Textarea value={brandStory} onChange={(e) => setBrandStory(e.target.value)} rows={5}
                        className="rounded-lg bg-secondary border-border resize-none text-xs"
                        placeholder={zh ? "在这里输入您的品牌故事..." : "Enter your brand story here..."} />
                      <div className="flex justify-end">
                        <span className={`text-[10px] tabular-nums ${storyWords > 150 ? "text-destructive" : "text-muted-foreground"}`}>
                          {storyWords} / 150 {zh ? "词" : "words"}
                        </span>
                      </div>
                    </div>
                  </FormSection>

                  <FormSection title={zh ? "创始人寄语" : "Founder Note"} description={zh ? "创始人的个人信息或品牌愿景。" : "Personal message or vision statement."}>
                    <div className="flex flex-col gap-1.5">
                      <Textarea value={founderNote} onChange={(e) => setFounderNote(e.target.value)} rows={3}
                        className="rounded-lg bg-secondary border-border resize-none text-xs"
                        placeholder={zh ? "在这里输入创始人寄语..." : "Enter founder note here..."} />
                      <div className="flex justify-end">
                        <span className="text-[10px] text-muted-foreground tabular-nums">{noteWords} {zh ? "词" : "words"}</span>
                      </div>
                    </div>
                  </FormSection>
                </>
              )}

              {/* ── VISUAL STYLE step ── */}
              {step.key === "visual-style" && (
                <>
                  <FormSection title={zh ? "风格标签" : "Style Tags"} description={zh ? "选择描述品牌美学的风格标签。" : "Select tags that describe your brand aesthetic."}>
                    <TagInput allTags={styleDefaults} selected={styleTags} onSelectedChange={setStyleTags} moreTags={styleMore} placeholder={zh ? "输入自定义风格标签..." : "Type a custom style tag..."} />
                  </FormSection>

                  <FormSection title={zh ? "风格预览" : "Style Preview"} description={zh ? "已选风格标签。" : "Selected style tags."}>
                    <div className="rounded-xl bg-secondary/50 p-4">
                      {styleTags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {styleTags.map((tag) => (
                            <span key={tag} className="px-2.5 py-1 rounded-md bg-foreground text-background text-[11px] font-medium">{tag}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">{zh ? "还没有选择风格标签。" : "No style tags selected yet."}</p>
                      )}
                    </div>
                  </FormSection>
                </>
              )}

              {/* ── GUARDRAILS step ── */}
              {step.key === "guardrails" && (
                <>
                  <FormSection title={zh ? "排除受众" : "Excluded Audiences"} description={zh ? "不应接收品牌内容的受众。" : "Audience segments to exclude."}>
                    <TagInput allTags={excludedAudienceDefaults} selected={excludedAudiences} onSelectedChange={setExcludedAudiences} moreTags={excludedAudienceMore} placeholder={zh ? "输入排除的受众..." : "Type an excluded audience..."} />
                  </FormSection>

                  <FormSection title={zh ? "禁止场景" : "Prohibited Scenarios"} description={zh ? "品牌不应出现的场景。" : "Scenarios to avoid."}>
                    <TagInput allTags={prohibitedScenarioDefaults} selected={prohibitedScenarios} onSelectedChange={setProhibitedScenarios} moreTags={prohibitedScenarioMore} placeholder={zh ? "输入禁止的场景..." : "Type a prohibited scenario..."} />
                  </FormSection>

                  <FormSection title={zh ? "屏蔽关键词" : "Blocked Keywords"} description={zh ? "AI不应使用的词语。" : "Words AI should never use."}>
                    <TagInput allTags={blockedKeywordDefaults} selected={blockedKeywords} onSelectedChange={setBlockedKeywords} moreTags={blockedKeywordMore} placeholder={zh ? "输入屏蔽关键词..." : "Type a blocked keyword..."} />
                  </FormSection>
                </>
              )}

              {/* ── FULFILLMENT step ── */}
              {step.key === "fulfillment" && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MetricInput label={zh ? "处理时间" : "Processing Time"} value={processingTime} onChange={setProcessingTime} suffix={zh ? "天" : "days"} />
                    <MetricInput label={zh ? "准时率" : "On-Time Rate"} value={onTimeRate} onChange={setOnTimeRate} suffix="%" />
                    <MetricInput label={zh ? "退货率" : "Return Rate"} value={returnRate} onChange={setReturnRate} suffix="%" />
                    <MetricInput label={zh ? "破损率" : "Damage Rate"} value={damageRate} onChange={setDamageRate} suffix="%" />
                  </div>

                  <FormSection title={zh ? "退款时间" : "Refund Time"} description={zh ? "客户收到退款的预期时间。" : "Expected refund time."}>
                    <Select value={refundTime} onValueChange={setRefundTime}>
                      <SelectTrigger className="rounded-lg bg-secondary border-border w-full md:w-56 h-8 text-xs">
                        <SelectValue placeholder={zh ? "选择退款时间" : "Select refund time"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 {zh ? "工作日" : "business days"}</SelectItem>
                        <SelectItem value="3-5">3-5 {zh ? "工作日" : "business days"}</SelectItem>
                        <SelectItem value="5-7">5-7 {zh ? "工作日" : "business days"}</SelectItem>
                        <SelectItem value="7-14">7-14 {zh ? "工作日" : "business days"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormSection>

                  <FormSection title={zh ? "退换政策" : "Return Policy"} description={zh ? "退换货政策条款。" : "Return and exchange terms."}>
                    <Textarea value={returnPolicy} onChange={(e) => setReturnPolicy(e.target.value)} rows={3}
                      className="rounded-lg bg-secondary border-border resize-none text-xs"
                      placeholder={zh ? "输入退换政策..." : "Enter return policy..."} />
                  </FormSection>

                  <div className="rounded-xl bg-secondary/50 p-3">
                    <p className="text-[11px] text-muted-foreground">
                      {zh ? "这些指标帮助AI智能体准确传达您的配送和退换承诺。" : "These metrics help AI agents communicate your shipping and return promises."}
                    </p>
                  </div>
                </>
              )}

              {/* ── Step navigation (bottom) ── */}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                {currentStep > 0 && (
                  <Button variant="ghost" size="sm" className="rounded-full text-xs" onClick={() => setCurrentStep((s) => s - 1)}>
                    <ChevronLeft className="size-3.5 mr-1" />
                    {zh ? "上一步" : "Back"}
                  </Button>
                )}
                <div className="flex-1" />
                {currentStep < stepDefs.length - 1 ? (
                  <Button size="sm" className="rounded-full px-5 text-xs" onClick={() => setCurrentStep((s) => s + 1)}>
                    {zh ? "下一步" : "Next Step"}
                    <ArrowRight className="size-3.5 ml-1" />
                  </Button>
                ) : (
                  <Button size="sm" className="rounded-full px-6 text-xs">
                    {zh ? "完成配置" : "Finish Setup"}
                    <Check className="size-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

/* ───────── FormSection (inline) ───────── */

function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div>
        <h3 className="text-xs font-medium text-foreground">{title}</h3>
        {description && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{description}</p>}
      </div>
      {children}
    </div>
  )
}
