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
  Star,
  ExternalLink,
  Bell,
  TrendingUp,
  Link2,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Info,
  Sparkles,
  Copy,
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
  // Optional embedded action card — lists gap steps with jump buttons
  gapCard?: {
    title: { en: string; zh: string }
    steps: { stepKey: string; reason: { en: string; zh: string } }[]
  }
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

/* ───────── Structured Guardrails data ───────── */

type RuleSensitivity = "high" | "medium" | "low"
type RuleCategory = "no-mention" | "no-compare" | "no-audience" | "compliance"

interface GuardrailRule {
  id: string
  text: string
  sensitivity: RuleSensitivity
}

interface GuardrailCategoryDef {
  id: RuleCategory
  label: { en: string; zh: string }
  description: { en: string; zh: string }
  defaultRules: GuardrailRule[]
}

const SENSITIVITY_CONFIG: Record<RuleSensitivity, { label: { en: string; zh: string }; color: string; bg: string }> = {
  high:   { label: { en: "High",   zh: "高" }, color: "text-red-600",         bg: "bg-red-100 border-red-200" },
  medium: { label: { en: "Medium", zh: "中" }, color: "text-amber-600",       bg: "bg-amber-100 border-amber-200" },
  low:    { label: { en: "Low",    zh: "低" }, color: "text-muted-foreground", bg: "bg-secondary border-border" },
}

const GUARDRAIL_CATEGORIES: GuardrailCategoryDef[] = [
  {
    id: "no-mention",
    label:       { en: "Never Mention",    zh: "禁止提及" },
    description: { en: "Topics, claims, or facts agents must never bring up.", zh: "智能体绝对不能提及的话题、声明或说法。" },
    defaultRules: [
      { id: "nm-1", text: "Competitor pricing or product comparisons", sensitivity: "high" },
      { id: "nm-2", text: "Medical or clinical efficacy claims", sensitivity: "high" },
      { id: "nm-3", text: "Guaranteed weight loss or transformation results", sensitivity: "high" },
    ],
  },
  {
    id: "no-compare",
    label:       { en: "No Comparisons", zh: "禁止比较" },
    description: { en: "Brands or products this brand should never be compared against.", zh: "不应将本品牌与以下品牌或产品进行比较。" },
    defaultRules: [
      { id: "nc-1", text: "Direct competitors by name", sensitivity: "high" },
      { id: "nc-2", text: "Price-based comparisons with budget alternatives", sensitivity: "medium" },
    ],
  },
  {
    id: "no-audience",
    label:       { en: "Excluded Audiences", zh: "排除受众" },
    description: { en: "Groups the agent must never target or recommend to.", zh: "智能体绝对不能向其推荐的受众群体。" },
    defaultRules: [
      { id: "na-1", text: "Minors under 18", sensitivity: "high" },
      { id: "na-2", text: "Pregnant or nursing individuals (without medical note)", sensitivity: "high" },
      { id: "na-3", text: "Substance recovery communities", sensitivity: "medium" },
    ],
  },
  {
    id: "compliance",
    label:       { en: "Compliance Statements", zh: "合规声明" },
    description: { en: "Mandatory disclaimers agents must include in relevant contexts.", zh: "在相关场景下智能体必须附加的免责声明或法律说明。" },
    defaultRules: [
      { id: "cp-1", text: "Include 'results may vary' when discussing outcomes", sensitivity: "medium" },
      { id: "cp-2", text: "Add regional availability note for international shoppers", sensitivity: "low" },
    ],
  },
]

/* ───────── Clone (Migrate Brand Memory) data ───────── */

const CLONE_PROMPT = `You are helping me migrate my brand's operating memory from a previous AI assistant to a new platform called Nohi.

Please extract and organize the following information based on our conversation history and any context you have about my brand:

1. **Brand Identity**
   - Brand name, founding story, and core mission
   - Tone of voice: adjectives that describe how the brand sounds (e.g., warm, witty, authoritative)
   - Visual identity notes: color palette descriptions, preferred aesthetics, style words

2. **Target Audience**
   - Primary customer personas (demographics, psychographics, lifestyle)
   - Key use cases and purchase motivations
   - Scenarios where customers typically buy

3. **Product & Offer**
   - Hero products or categories
   - Key differentiators and value propositions
   - Pricing positioning (budget / mid-market / premium / luxury)

4. **Guardrails & Sensitivities**
   - Topics or claims the brand never makes
   - Audiences the brand explicitly excludes
   - Scenarios where the product should NOT be recommended

5. **Marketing Memory**
   - Best-performing messaging themes or hooks
   - Seasonal or campaign moments that matter
   - Customer objections and how the brand handles them

6. **Operations**
   - Shipping speed and regions
   - Return / refund policy summary
   - Any fulfillment promises made to customers

Please output the result as a structured list under each heading above. Be concise but complete — this output will be imported directly into Nohi as my brand context.`

type CloneSource = "chatgpt" | "gemini" | "claude" | "other"

interface CloneSourceConfig {
  label: string
  url: string
  color: string
  bg: string
  hint: { en: string; zh: string }
}

const cloneSourceConfigs: Record<CloneSource, CloneSourceConfig> = {
  chatgpt: {
    label: "ChatGPT", url: "https://chat.openai.com",
    color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200",
    hint: {
      en: "Open any ChatGPT conversation where you've discussed your brand, paste the prompt above, send it, then paste the response below.",
      zh: "在 ChatGPT 中打开任意包含品牌对话的会话，将提示词粘贴发送，然后将回复粘贴至下方。",
    },
  },
  gemini: {
    label: "Gemini", url: "https://gemini.google.com",
    color: "text-blue-600", bg: "bg-blue-50 border-blue-200",
    hint: {
      en: "Open a Gemini conversation containing your brand context, paste the prompt, send it, then paste the response below.",
      zh: "在 Gemini 中打开含品牌上下文的对话，粘贴提示词并发送，然后将回复粘贴至下方。",
    },
  },
  claude: {
    label: "Claude", url: "https://claude.ai",
    color: "text-orange-600", bg: "bg-orange-50 border-orange-200",
    hint: {
      en: "Find a Claude conversation with your brand knowledge, paste the prompt, send it, then paste the response below.",
      zh: "在 Claude 中找到含品牌信息的对话，粘贴提示词并发送，然后将回复粘贴至下方。",
    },
  },
  other: {
    label: "Other", url: "#",
    color: "text-muted-foreground", bg: "bg-secondary border-border",
    hint: {
      en: "Paste the prompt into any AI assistant, get the structured brand memory, then paste the response below.",
      zh: "在任意 AI 助手中粘贴提示词，获取结构化品牌记忆后粘贴至下方。",
    },
  },
}

/* ───────── Shipping SLA tiers ───────── */

interface ShippingRank {
  value: string
  label: string
  description: { en: string; zh: string }
  recommended?: boolean
}

const shippingRanks: ShippingRank[] = [
  { value: "platinum", label: "Platinum", recommended: true, description: { en: "Same-day or next-day delivery, 99%+ on-time rate", zh: "当日或次日达，99%+ 准时率" } },
  { value: "gold",     label: "Gold",                        description: { en: "2-day delivery, 97%+ on-time rate",               zh: "2 天内送达，97%+ 准时率" } },
  { value: "silver",   label: "Silver",                      description: { en: "3–5 day delivery, 95%+ on-time rate",            zh: "3–5 天送达，95%+ 准时率" } },
  { value: "standard", label: "Standard",                    description: { en: "5–7 day delivery, standard on-time rate",        zh: "5–7 天送达，标准准时率" } },
]

/* ───────── Posts & UGC data ───────── */

type PlatformKey =
  | "instagram" | "tiktok" | "youtube" | "pinterest"
  | "twitter" | "reddit" | "rednote" | "reviews" | "other"

type ItemStatus = "approved" | "pending" | "rejected"
type Sentiment = "positive" | "neutral" | "negative"

interface PlatformItem {
  id: string
  title: string            // caption / review excerpt / tweet text
  url: string
  author?: string
  publishedAt: string      // short display date (e.g. "2d ago")
  likes?: number
  comments?: number
  shares?: number
  rating?: number          // 1–5 for reviews
  verified?: boolean       // verified purchase (reviews)
  sentiment?: Sentiment
  themes?: string[]        // AI-extracted tags
  status: ItemStatus
  agentAvailable: boolean  // separate from visibility
  product?: string         // linked product (reviews)
  category?: string        // product category (reviews)
}

interface PlatformData {
  key: PlatformKey
  connected: boolean
  lastSyncedDisplay?: string   // "2h ago"
  items: PlatformItem[]
}

interface PlatformMeta {
  key: PlatformKey
  label: { en: string; zh: string }
  short: string                // single letter badge fallback
  color: string                // tailwind bg-* class for badge
  kind: "social" | "reviews" | "other"
}

const platformMetas: PlatformMeta[] = [
  { key: "instagram", label: { en: "Instagram",       zh: "Instagram" }, short: "IG", color: "bg-pink-500",   kind: "social"  },
  { key: "tiktok",    label: { en: "TikTok",          zh: "TikTok"    }, short: "TT", color: "bg-black",      kind: "social"  },
  { key: "youtube",   label: { en: "YouTube",         zh: "YouTube"   }, short: "YT", color: "bg-red-600",    kind: "social"  },
  { key: "pinterest", label: { en: "Pinterest",       zh: "Pinterest" }, short: "P",  color: "bg-red-500",    kind: "social"  },
  { key: "twitter",   label: { en: "X (Twitter)",     zh: "X (Twitter)" }, short: "X", color: "bg-black",      kind: "social"  },
  { key: "reddit",    label: { en: "Reddit",          zh: "Reddit"    }, short: "R",  color: "bg-orange-600", kind: "social"  },
  { key: "rednote",   label: { en: "Rednote (小红书)", zh: "小红书"     }, short: "小", color: "bg-red-500",    kind: "social"  },
  { key: "reviews",   label: { en: "Verified Reviews", zh: "已验证评价" }, short: "★",  color: "bg-amber-500",  kind: "reviews" },
  { key: "other",     label: { en: "Other UGC",        zh: "其他 UGC"   }, short: "U", color: "bg-slate-500",  kind: "other"   },
]

const mockPlatformsData: PlatformData[] = [
  {
    key: "instagram", connected: true, lastSyncedDisplay: "2h ago",
    items: [
      { id: "ig1", title: "Sunday slow mornings with our new linen set ✨", url: "https://instagram.com/p/abc123", author: "@brand.official", publishedAt: "3d ago", likes: 1240, comments: 87, shares: 32, sentiment: "positive", themes: ["quality","design"], status: "approved", agentAvailable: true },
      { id: "ig2", title: "Behind the scenes — our Spring '26 studio shoot", url: "https://instagram.com/p/def456", author: "@brand.official", publishedAt: "1w ago", likes: 2150, comments: 140, shares: 58, sentiment: "positive", themes: ["brand-story"], status: "approved", agentAvailable: true },
      { id: "ig3", title: "Customer unboxing by @lila.reads", url: "https://instagram.com/p/ghi789", author: "@lila.reads", publishedAt: "5d ago", likes: 430, comments: 22, shares: 11, sentiment: "positive", themes: ["ugc","unboxing"], status: "pending", agentAvailable: false },
    ],
  },
  {
    key: "tiktok", connected: true, lastSyncedDisplay: "1d ago",
    items: [
      { id: "tt1", title: "How I style 3 essentials for a week", url: "https://tiktok.com/@brand/video/1", author: "@brand", publishedAt: "4d ago", likes: 8900, comments: 210, shares: 340, sentiment: "positive", themes: ["styling"], status: "approved", agentAvailable: true },
      { id: "tt2", title: "POV: you found the perfect everyday bag", url: "https://tiktok.com/@brand/video/2", author: "@brand", publishedAt: "2w ago", likes: 4500, comments: 98, shares: 120, sentiment: "positive", themes: ["product"], status: "pending", agentAvailable: false },
    ],
  },
  {
    key: "youtube", connected: false,
    items: [],
  },
  {
    key: "pinterest", connected: true, lastSyncedDisplay: "3d ago",
    items: [
      { id: "pn1", title: "Neutral tones mood board 2026", url: "https://pinterest.com/pin/1", publishedAt: "2w ago", likes: 320, themes: ["aesthetic"], sentiment: "positive", status: "approved", agentAvailable: true },
    ],
  },
  {
    key: "twitter", connected: false,
    items: [],
  },
  {
    key: "reddit", connected: true, lastSyncedDisplay: "6h ago",
    items: [
      { id: "rd1", title: "Anyone tried the new linen set? Worth it?", url: "https://reddit.com/r/fashion/abc", author: "u/thrifty_minimalist", publishedAt: "1d ago", comments: 34, sentiment: "neutral", themes: ["question"], status: "pending", agentAvailable: false },
      { id: "rd2", title: "Honestly impressed with the quality", url: "https://reddit.com/r/fashion/def", author: "u/design_nerd", publishedAt: "5d ago", comments: 18, sentiment: "positive", themes: ["quality"], status: "approved", agentAvailable: true },
    ],
  },
  {
    key: "rednote", connected: false,
    items: [],
  },
  {
    key: "reviews", connected: true, lastSyncedDisplay: "30m ago",
    items: [
      // Linen Shirt (Apparel)
      { id: "rv1",  title: "Absolutely love the fit and the fabric — will buy again",                 url: "https://site.com/reviews/1",  author: "Sarah K.",  publishedAt: "2d ago",  rating: 5, verified: true,  sentiment: "positive", themes: ["fit","fabric"],      status: "approved", agentAvailable: true,  product: "Linen Shirt",        category: "Apparel" },
      { id: "rv2",  title: "Good quality but shipping took 2 weeks",                                  url: "https://site.com/reviews/2",  author: "Marcus T.", publishedAt: "4d ago",  rating: 3, verified: true,  sentiment: "neutral",  themes: ["shipping"],          status: "approved", agentAvailable: true,  product: "Linen Shirt",        category: "Apparel" },
      { id: "rv3",  title: "Runs a bit small — size up if between sizes",                             url: "https://site.com/reviews/3",  author: "Dana M.",   publishedAt: "3d ago",  rating: 4, verified: true,  sentiment: "neutral",  themes: ["sizing"],            status: "approved", agentAvailable: true,  product: "Linen Shirt",        category: "Apparel" },
      { id: "rv4",  title: "Color faded after one wash — disappointed",                               url: "https://site.com/reviews/4",  author: "Jordan L.", publishedAt: "1w ago",  rating: 2, verified: true,  sentiment: "negative", themes: ["color","wash"],      status: "pending",  agentAvailable: false, product: "Linen Shirt",        category: "Apparel" },

      // Wool Blanket (Home)
      { id: "rv5",  title: "Perfect weight, soft on skin — my new favorite blanket",                  url: "https://site.com/reviews/5",  author: "Priya R.",  publishedAt: "1w ago",  rating: 5, verified: true,  sentiment: "positive", themes: ["feel","warmth"],     status: "approved", agentAvailable: true,  product: "Wool Blanket",       category: "Home" },
      { id: "rv6",  title: "Smells strongly of wool for the first week",                              url: "https://site.com/reviews/6",  author: "Taylor J.", publishedAt: "2w ago",  rating: 3, verified: true,  sentiment: "neutral",  themes: ["smell"],             status: "approved", agentAvailable: true,  product: "Wool Blanket",       category: "Home" },
      { id: "rv7",  title: "Started pilling within a month — not great quality",                      url: "https://site.com/reviews/7",  author: "Alex P.",   publishedAt: "3w ago",  rating: 1, verified: true,  sentiment: "negative", themes: ["durability"],        status: "pending",  agentAvailable: false, product: "Wool Blanket",       category: "Home" },

      // Ceramic Mug (Home)
      { id: "rv8",  title: "Beautiful glaze, feels great in hand",                                    url: "https://site.com/reviews/8",  author: "Emi K.",    publishedAt: "2w ago",  rating: 5, verified: false, sentiment: "positive", themes: ["design","feel"],     status: "approved", agentAvailable: true,  product: "Ceramic Mug",        category: "Home" },
      { id: "rv9",  title: "Arrived with a chip on the rim",                                          url: "https://site.com/reviews/9",  author: "Rina S.",   publishedAt: "1w ago",  rating: 2, verified: true,  sentiment: "negative", themes: ["packaging"],         status: "pending",  agentAvailable: false, product: "Ceramic Mug",        category: "Home" },
      { id: "rv10", title: "Microwave safe and dishwasher safe — exactly as described",               url: "https://site.com/reviews/10", author: "Chris L.",  publishedAt: "4d ago",  rating: 5, verified: true,  sentiment: "positive", themes: ["utility"],           status: "approved", agentAvailable: true,  product: "Ceramic Mug",        category: "Home" },

      // Leather Tote (Accessories)
      { id: "rv11", title: "Perfect everyday bag — compartments are thoughtful",                      url: "https://site.com/reviews/11", author: "Maya H.",   publishedAt: "5d ago",  rating: 5, verified: true,  sentiment: "positive", themes: ["design","utility"],  status: "approved", agentAvailable: true,  product: "Leather Tote",       category: "Accessories" },
      { id: "rv12", title: "Strap started cracking after 3 months of daily use",                      url: "https://site.com/reviews/12", author: "Noah B.",   publishedAt: "2w ago",  rating: 2, verified: true,  sentiment: "negative", themes: ["durability"],        status: "pending",  agentAvailable: false, product: "Leather Tote",       category: "Accessories" },
      { id: "rv13", title: "Color is even richer in person than online",                              url: "https://site.com/reviews/13", author: "Lucia V.",  publishedAt: "3d ago",  rating: 5, verified: true,  sentiment: "positive", themes: ["color"],             status: "approved", agentAvailable: true,  product: "Leather Tote",       category: "Accessories" },

      // Face Serum (Beauty)
      { id: "rv14", title: "Noticed smoother skin within two weeks",                                  url: "https://site.com/reviews/14", author: "Hannah Y.", publishedAt: "6d ago",  rating: 5, verified: true,  sentiment: "positive", themes: ["results"],           status: "approved", agentAvailable: true,  product: "Vitamin C Serum",    category: "Beauty" },
      { id: "rv15", title: "Broke me out — might be sensitive to fragrance",                          url: "https://site.com/reviews/15", author: "Zoe A.",    publishedAt: "1w ago",  rating: 1, verified: true,  sentiment: "negative", themes: ["sensitivity"],       status: "pending",  agentAvailable: false, product: "Vitamin C Serum",    category: "Beauty" },
      { id: "rv16", title: "Nice texture but pricey for the amount you get",                          url: "https://site.com/reviews/16", author: "Ivy R.",    publishedAt: "2w ago",  rating: 3, verified: true,  sentiment: "neutral",  themes: ["value","texture"],   status: "approved", agentAvailable: true,  product: "Vitamin C Serum",    category: "Beauty" },
    ],
  },
  {
    key: "other", connected: true,
    items: [
      { id: "ot1", title: "Newsletter testimonial from The Edit", url: "https://theedit.com/feature", publishedAt: "2w ago", sentiment: "positive", themes: ["press"], status: "approved", agentAvailable: true },
    ],
  },
]

/* Per-platform: which metrics show on the summary card */
interface PlatformMetrics {
  total: number
  pending: number
  approved: number
  rejected: number
  avgRating?: number
  positivePct?: number
  negativePct?: number
  avgEngagement?: number
  latestDisplay?: string
}

function computeMetrics(p: PlatformData): PlatformMetrics {
  const total = p.items.length
  const pending = p.items.filter((i) => i.status === "pending").length
  const approved = p.items.filter((i) => i.status === "approved").length
  const rejected = p.items.filter((i) => i.status === "rejected").length

  const ratings = p.items.filter((i) => typeof i.rating === "number").map((i) => i.rating as number)
  const avgRating = ratings.length ? ratings.reduce((s, r) => s + r, 0) / ratings.length : undefined

  const sentimentItems = p.items.filter((i) => i.sentiment)
  const positivePct = sentimentItems.length
    ? Math.round((sentimentItems.filter((i) => i.sentiment === "positive").length / sentimentItems.length) * 100)
    : undefined
  const negativePct = sentimentItems.length
    ? Math.round((sentimentItems.filter((i) => i.sentiment === "negative").length / sentimentItems.length) * 100)
    : undefined

  const engagementItems = p.items.filter((i) => typeof i.likes === "number")
  const avgEngagement = engagementItems.length
    ? Math.round(engagementItems.reduce((s, i) => s + (i.likes || 0) + (i.comments || 0) + (i.shares || 0), 0) / engagementItems.length)
    : undefined

  const latestDisplay = p.items[0]?.publishedAt

  return { total, pending, approved, rejected, avgRating, positivePct, negativePct, avgEngagement, latestDisplay }
}

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
    key: "guardrails",
    title: { en: "Guardrails", zh: "品牌护栏" },
    description: { en: "Define excluded audiences, prohibited scenarios, and blocked keywords.", zh: "定义排除的受众、禁止的场景和屏蔽的关键词。" },
    guide: {
      en: "Let's set your brand guardrails. Upload compliance docs or brand policy, and Nohi will identify audiences, scenarios, and keywords to avoid.",
      zh: "来设置品牌护栏。上传合规文档或品牌政策，Nohi 会识别需要排除的受众、场景和关键词。",
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
    key: "posts-ugc",
    title: { en: "Posts & UGC", zh: "内容与 UGC" },
    description: { en: "Connect social channels and review sources so agents can reference approved content.", zh: "接入社交平台与评价源，让智能体在对话中引用已审核的内容。" },
    guide: {
      en: "Paste any post, video, or review link and Nohi will analyze and organize it by platform. You can also connect Instagram, TikTok, YouTube and more for auto-sync.",
      zh: "把帖子、视频或评价链接粘到下面，Nohi 会自动分析并按平台整理。也可以连接 Instagram、TikTok、YouTube 等平台自动同步。",
    },
    suggestedFiles: { en: "Paste a link, or drop screenshots / CSV exports...", zh: "粘贴链接、截图或 CSV 导出都可以..." },
  },
  {
    key: "fulfillment",
    title: { en: "Fulfillment", zh: "履约配送" },
    description: { en: "Shipping SLA tier, return policy, processing time, and performance metrics.", zh: "配送 SLA 等级、退换政策、处理时间和履约指标。" },
    guide: {
      en: "Upload your return policy or shipping guide. Nohi will extract processing times, SLAs, and return terms.",
      zh: "上传退换政策或物流指南，Nohi 会提取处理时间、配送 SLA 和退换条款。",
    },
    suggestedFiles: { en: "PDF, PPT, DOC, IMG, CSV...", zh: "PDF、PPT、DOC、图片、CSV..." },
  },
  {
    key: "clone",
    title: { en: "Clone", zh: "迁移记忆" },
    description: { en: "Migrate brand memory from ChatGPT, Gemini, or Claude — no retyping needed.", zh: "从 ChatGPT、Gemini 或 Claude 一键迁移品牌记忆，无需重新填写。" },
    guide: {
      en: "If you've built up brand knowledge in another AI assistant, use this tab to bring it into Nohi in three quick steps.",
      zh: "如果你已经在别的 AI 助手里积累了品牌知识，用这个标签页可以 3 步导入 Nohi。",
    },
    suggestedFiles: { en: "No files needed — just copy & paste.", zh: "不需要上传文件 — 复制粘贴即可。" },
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
  // Guardrails (structured — 4 categories with sensitivity)
  const [rulesByCategory, setRulesByCategory] = useState<Record<RuleCategory, GuardrailRule[]>>(() => {
    const map = {} as Record<RuleCategory, GuardrailRule[]>
    GUARDRAIL_CATEGORIES.forEach((c) => { map[c.id] = [...c.defaultRules] })
    return map
  })
  // Fulfillment
  const [processingTime, setProcessingTime] = useState("")
  const [onTimeRate, setOnTimeRate] = useState("")
  const [returnRate, setReturnRate] = useState("")
  const [damageRate, setDamageRate] = useState("")
  const [refundTime, setRefundTime] = useState("")
  const [returnPolicy, setReturnPolicy] = useState("")
  const [shippingRank, setShippingRank] = useState("silver")
  // Clone (Migrate Brand Memory)
  const [cloneSource, setCloneSource] = useState<CloneSource>("chatgpt")
  const [cloneCopied, setCloneCopied] = useState(false)
  const [clonePastedMemory, setClonePastedMemory] = useState("")
  const [cloneImported, setCloneImported] = useState(false)
  // Gap tracking — true after any file parse, so empty sections become "red gap"
  const [hasAttemptedParse, setHasAttemptedParse] = useState(false)
  // Reviews auto-sync
  const [reviewsAutoSync, setReviewsAutoSync] = useState(true)
  const [reviewsSyncFreq, setReviewsSyncFreq] = useState<"daily" | "weekly" | "monthly">("weekly")
  const [reviewsLastSynced, setReviewsLastSynced] = useState<string>("30m ago")
  const [reviewsSyncing, setReviewsSyncing] = useState(false)
  // Posts & UGC
  const [platformsData, setPlatformsData] = useState<PlatformData[]>(mockPlatformsData)
  const [activePlatform, setActivePlatform] = useState<PlatformKey | null>(null)
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = useState<"all" | ItemStatus>("all")
  const [sentimentFilter, setSentimentFilter] = useState<"all" | Sentiment>("all")
  const [productFilter, setProductFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [reviewsAutoPublishMin, setReviewsAutoPublishMin] = useState<number>(4)
  const [reviewsHideFlagged, setReviewsHideFlagged] = useState<boolean>(true)
  const [linkInput, setLinkInput] = useState("")
  const [linkAnalyzing, setLinkAnalyzing] = useState(false)

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
    setHasAttemptedParse(true)
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
      // Guardrails: default categories auto-populated — add a parsed compliance hint
      setRulesByCategory((prev) => ({
        ...prev,
        compliance: [
          ...prev.compliance,
          { id: `cp-parsed-${Date.now()}`, text: "Always disclose paid partnerships per FTC guidelines", sensitivity: "high" },
        ],
      }))
      // Fulfillment: basic metrics only
      setProcessingTime("3-5")
      setOnTimeRate("96")
      // returnRate, damageRate, refundTime, returnPolicy left empty — needs return policy doc

      const fileList = uploadedFileNames.length > 0 ? uploadedFileNames.join(zh ? "、" : ", ") : ""

      const response = zh
        ? `✅ 已解析${fileList ? ` ${fileList}` : "您的描述"}，以下内容已自动填充：\n\n✓ 「详情」「视觉风格」「品牌故事」「履约配送」— 已从文件中提取并填好\n✓ 「品牌护栏」— 已设置默认规则 + 从合规内容中提取 1 条\n\n但是有些内容我没法从上传的文件里拿到，需要你补充一下 👇`
        : `✅ Parsed${fileList ? ` ${fileList}` : " your description"}. Auto-filled from your files:\n\n✓ "Details" / "Visual Style" / "Brand Story" / "Fulfillment" — extracted from your files\n✓ "Guardrails" — default rules applied + 1 compliance rule pulled from your doc\n\nBut a few things I can't get from uploaded files — they need your input 👇`

      // Build gap card pointing at steps that still need user input
      const gapSteps = [
        { stepKey: "posts-ugc", reason: { en: "Paste links from Instagram / TikTok / Reviews / YouTube / Reddit so agents can reference real social content.", zh: "粘贴 Instagram / TikTok / 客户评价 / YouTube 等链接，智能体才能引用真实社交内容。" } },
        { stepKey: "clone", reason: { en: "Optional — if you already have brand knowledge in ChatGPT / Gemini / Claude, import it in 30s.", zh: "可选 — 如果你已经在 ChatGPT / Gemini / Claude 里有品牌知识，30 秒就能导入。" } },
      ]

      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        gapCard: {
          title: { en: "Still needed", zh: "还需要你补充" },
          steps: gapSteps,
        },
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
      // Text-only: contextual response based on state
      setTimeout(() => {
        const alreadyHasFiles = files.length > 0
        const hasAtMention = text.includes("@")
        let responseContent: string

        if (hasAtMention && alreadyHasFiles) {
          // User referenced a file — simulate updating a field
          const mentionedFile = text.match(/@([\w._-]+)/)?.[1] || ""
          if (zh) {
            responseContent = `已根据 ${mentionedFile} 重新解析并更新了相关字段：\n\n✓ 品牌故事已更新 — 基于文件中的品牌叙事重新生成\n✓ 创始人寄语已补充\n\n你可以点击「步骤 2 Brand Story」查看修改后的内容 ✏️`
          } else {
            responseContent = `Re-parsed ${mentionedFile} and updated the relevant fields:\n\n✓ Brand Story updated — regenerated from the brand narrative in the file\n✓ Founder Note enriched with additional details\n\nClick "Step 2 Brand Story" to review the changes ✏️`
          }
          // Actually update the brand story to simulate the change
          setBrandStory("We are a design-forward lifestyle brand rooted in sustainability and intentional living. Founded in 2022, we create everyday essentials that merge Scandinavian minimalism with modern functionality. Every product is responsibly sourced, thoughtfully designed in-house, and made to stand the test of time.")
          setFounderNote("After a decade in the fashion industry, I saw a disconnect between style and responsibility. I started this brand to prove that beautiful, lasting products don't have to come at the planet's expense. Our mission is simple: make conscious living effortless. - Alex Chen, Founder & CEO")
        } else if (alreadyHasFiles) {
          responseContent = zh
            ? "收到！你可以用 @ 引用已上传的文件来让我重新解析特定内容，或者直接在右侧表单里编辑对应的字段 ✏️"
            : "Got it! Use @ to reference an uploaded file and tell me what to update — e.g. \"@brand_guide.pdf update the brand story\". Or edit the form directly ✏️"
        } else {
          responseContent = zh
            ? "收到你的消息！上传品牌文件（PDF、PPT、图片等），Nohi 会帮你自动填充表单。\n\n你也可以直接在右侧表单里手动编辑 ✏️"
            : "Got your message! Upload brand files (PDF, PPT, images, etc.) and Nohi will auto-fill the form for you.\n\nYou can also edit the form on the right directly ✏️"
        }

        setMessages((prev) => [...prev, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: responseContent,
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

  /* ── Posts & UGC helpers ── */

  const detectPlatformFromUrl = (url: string): PlatformKey => {
    const u = url.toLowerCase()
    if (u.includes("instagram.com"))           return "instagram"
    if (u.includes("tiktok.com"))              return "tiktok"
    if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube"
    if (u.includes("pinterest.com"))           return "pinterest"
    if (u.includes("twitter.com") || u.includes("x.com")) return "twitter"
    if (u.includes("reddit.com"))              return "reddit"
    if (u.includes("xiaohongshu.com") || u.includes("xhslink.com")) return "rednote"
    return "other"
  }

  const getPlatform = (key: PlatformKey) =>
    platformsData.find((p) => p.key === key)

  const updatePlatform = (key: PlatformKey, updater: (p: PlatformData) => PlatformData) => {
    setPlatformsData((prev) => prev.map((p) => (p.key === key ? updater(p) : p)))
  }

  const setItemStatus = (platformKey: PlatformKey, ids: string[], status: ItemStatus) => {
    updatePlatform(platformKey, (p) => ({
      ...p,
      items: p.items.map((it) =>
        ids.includes(it.id)
          ? { ...it, status, agentAvailable: status === "approved" ? true : it.agentAvailable && status !== "rejected" }
          : it
      ),
    }))
    setSelectedItemIds(new Set())
  }

  const deleteItems = (platformKey: PlatformKey, ids: string[]) => {
    updatePlatform(platformKey, (p) => ({ ...p, items: p.items.filter((it) => !ids.includes(it.id)) }))
    setSelectedItemIds(new Set())
  }

  const analyzeLink = () => {
    const url = linkInput.trim()
    if (!url) return
    const platformKey = detectPlatformFromUrl(url)
    setLinkAnalyzing(true)
    setTimeout(() => {
      const newItem: PlatformItem = {
        id: crypto.randomUUID(),
        title: url.length > 60 ? url.slice(0, 57) + "..." : url,
        url,
        publishedAt: zh ? "刚刚" : "just now",
        sentiment: "neutral",
        themes: [zh ? "待分析" : "analyzing"],
        status: "pending",
        agentAvailable: false,
      }
      updatePlatform(platformKey, (p) => ({
        ...p,
        connected: true,
        lastSyncedDisplay: zh ? "刚刚" : "just now",
        items: [newItem, ...p.items],
      }))
      setActivePlatform(platformKey)
      setLinkInput("")
      setLinkAnalyzing(false)
    }, 900)
  }

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllVisible = (ids: string[]) => {
    setSelectedItemIds(new Set(ids))
  }

  const storyWords = wordCount(brandStory)
  const noteWords = wordCount(founderNote)

  /* ── Per-step missing-fields computation ── */
  const stepMissingFields: Record<string, { key: string; label: { en: string; zh: string } }[]> = {
    "details": [
      ...(selectedCategories.length === 0 ? [{ key: "categories", label: { en: "Core Category",    zh: "核心品类" } }] : []),
      ...(!selectedAov                    ? [{ key: "aov",        label: { en: "AOV Tier",         zh: "客单价层级" } }] : []),
      ...(!selectedPurchaseType           ? [{ key: "purchase",   label: { en: "Purchase Type",    zh: "购买类型" } }] : []),
      ...(audienceTags.length === 0       ? [{ key: "audience",   label: { en: "Primary Audience", zh: "目标受众" } }] : []),
      ...(scenarioTags.length === 0       ? [{ key: "scenario",   label: { en: "Scenario Tags",    zh: "场景标签" } }] : []),
      ...(intentTags.length === 0         ? [{ key: "intent",     label: { en: "Intent Tags",      zh: "意图标签" } }] : []),
    ],
    "guardrails": Object.entries(rulesByCategory)
      .filter(([, rules]) => rules.length === 0)
      .map(([catId]) => {
        const cat = GUARDRAIL_CATEGORIES.find((c) => c.id === catId)!
        return { key: catId, label: cat.label }
      }),
    "visual-style": [
      ...(styleTags.length === 0 ? [{ key: "style", label: { en: "Style Tags", zh: "风格标签" } }] : []),
    ],
    "brand-story": [
      ...(brandStory.trim().length === 0 ? [{ key: "story",  label: { en: "Brand Story",  zh: "品牌故事" } }] : []),
      ...(founderNote.trim().length === 0 ? [{ key: "founder", label: { en: "Founder Note", zh: "创始人寄语" } }] : []),
    ],
    "posts-ugc": (() => {
      const gaps: { key: string; label: { en: string; zh: string } }[] = []
      const socialConnected = platformsData.filter((p) => platformMetas.find((m) => m.key === p.key)?.kind === "social" && p.connected).length
      if (socialConnected === 0)   gaps.push({ key: "social",  label: { en: "Connect at least one social platform (Instagram / TikTok / YouTube / …)", zh: "至少接入一个社交平台（Instagram / TikTok / YouTube 等）" } })
      const reviewsPlatform = platformsData.find((p) => p.key === "reviews")
      if (!reviewsPlatform?.items.length) gaps.push({ key: "reviews", label: { en: "Import customer reviews",          zh: "导入客户评价" } })
      if (!platformsData.some((p) => p.items.some((i) => i.status === "approved")))
        gaps.push({ key: "approved", label: { en: "Approve at least one item so agents can reference it", zh: "至少审核通过一条内容供智能体引用" } })
      return gaps
    })(),
    "fulfillment": [
      ...(!shippingRank                   ? [{ key: "sla",          label: { en: "Shipping SLA Tier", zh: "配送 SLA 等级" } }] : []),
      ...(!processingTime                 ? [{ key: "processing",   label: { en: "Processing Time",   zh: "处理时间" } }] : []),
      ...(!onTimeRate                     ? [{ key: "ontime",       label: { en: "On-Time Rate",      zh: "准时率" } }] : []),
      ...(returnPolicy.trim().length === 0 ? [{ key: "policy",      label: { en: "Return Policy",     zh: "退换政策" } }] : []),
    ],
    "clone": cloneImported ? [] : [{ key: "import", label: { en: "Import memory from an existing AI (optional)", zh: "从现有 AI 导入记忆（可选）" } }],
  }

  // Completion state per step: "complete" | "partial" | "gap" | "empty"
  type StepState = "complete" | "partial" | "gap" | "empty"
  const stepStates: Record<string, StepState> = {}
  stepDefs.forEach((s) => {
    const missing = stepMissingFields[s.key] || []
    // Count filled fields
    let totalFields = 0, filledFields = 0
    switch (s.key) {
      case "details": totalFields = 6; filledFields = 6 - missing.length; break
      case "guardrails": totalFields = 4; filledFields = 4 - missing.length; break
      case "visual-style": totalFields = 1; filledFields = 1 - missing.length; break
      case "brand-story": totalFields = 2; filledFields = 2 - missing.length; break
      case "posts-ugc": totalFields = 3; filledFields = 3 - missing.length; break
      case "fulfillment": totalFields = 4; filledFields = 4 - missing.length; break
      case "clone": totalFields = 1; filledFields = 1 - missing.length; break
    }
    if (missing.length === 0) stepStates[s.key] = "complete"
    else if (filledFields === 0) stepStates[s.key] = hasAttemptedParse && s.key !== "clone" ? "gap" : "empty"
    else stepStates[s.key] = hasAttemptedParse && s.key !== "clone" ? "gap" : "partial"
  })
  // "clone" is always treated as optional — never red
  if (stepStates["clone"] !== "complete") stepStates["clone"] = "empty"

  /* ── Brand Health Score ── */
  const completedSteps = stepDefs.filter((s) => stepStates[s.key] === "complete").length
  const totalSteps = stepDefs.length
  const healthScore = Math.round((completedSteps / totalSteps) * 100)
  const scoreColor = healthScore >= 70 ? "text-emerald-600" : healthScore >= 40 ? "text-amber-600" : "text-red-500"
  const barColor   = healthScore >= 70 ? "bg-emerald-500" : healthScore >= 40 ? "bg-amber-500" : "bg-red-500"
  const boostSuggestions = stepDefs
    .filter((s) => stepStates[s.key] !== "complete" && s.key !== "clone")
    .slice(0, 2)
    .map((s, i) => ({
      key: s.key,
      title: zh ? s.title.zh : s.title.en,
      boost: i === 0 ? "+23%" : "+15%",
      index: stepDefs.findIndex((d) => d.key === s.key),
    }))

  /* ───────── Render ───────── */

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* ── Brand Health Score banner ── */}
      <div className="shrink-0 border-b border-border px-6 py-3 bg-background">
        <div className="flex items-center gap-3">
          <span className={cn("text-2xl font-bold tabular-nums tracking-tight leading-none", scoreColor)}>{healthScore}</span>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground">
                {zh ? "品牌健康分" : "Brand Health Score"}
              </span>
              <TrendingUp className="size-3 text-muted-foreground" />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {zh ? `已配置 ${completedSteps} / ${totalSteps} 个模块` : `${completedSteps} of ${totalSteps} sections configured`}
            </span>
          </div>
          {/* Progress bar */}
          <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden mx-2 min-w-[80px] max-w-[240px]">
            <div className={cn("h-full rounded-full transition-all duration-500", barColor)} style={{ width: `${healthScore}%` }} />
          </div>
          {/* Boost suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap ml-auto">
            {boostSuggestions.map((s) => (
              <button
                key={s.key}
                onClick={() => setCurrentStep(s.index)}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-[10px] text-foreground transition-colors"
              >
                <Info className="size-2.5 text-muted-foreground" />
                <span>{zh ? `完善「${s.title}」` : `Complete "${s.title}"`}</span>
                <span className="font-semibold text-emerald-600">{s.boost}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Step progress (with gap/partial/complete states) ── */}
      <div className="shrink-0 border-b border-border px-6 py-3">
        <div className="flex items-center gap-1">
          {stepDefs.map((s, i) => {
            const isCurrent = i === currentStep
            const state = stepStates[s.key]
            const isComplete = state === "complete"
            const isGap      = state === "gap"
            const isPartial  = state === "partial"
            return (
              <div key={s.key} className="flex items-center gap-1 flex-1 min-w-0">
                <button
                  onClick={() => setCurrentStep(i)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 min-w-0",
                    isCurrent  ? "bg-foreground text-background"
                    : isComplete ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15"
                    : isGap      ? "bg-red-500/10 text-red-700 hover:bg-red-500/15"
                    : isPartial  ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/15"
                    :              "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  <span className={cn(
                    "size-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold",
                    isCurrent    ? "bg-background text-foreground"
                    : isComplete ? "bg-emerald-500 text-white"
                    : isGap      ? "bg-red-500 text-white"
                    : isPartial  ? "bg-amber-500 text-white"
                    :              "bg-muted-foreground/20 text-muted-foreground"
                  )}>
                    {isComplete ? <Check className="size-3" />
                      : isGap    ? <AlertTriangle className="size-3" />
                      : i + 1}
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
                  {/* Gap action card */}
                  {msg.gapCard && (
                    <div className="mt-1.5 w-full max-w-[95%] rounded-xl border border-border bg-background p-2.5 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="size-3 text-amber-500" />
                        <span className="text-[10px] font-semibold text-foreground uppercase tracking-wide">
                          {zh ? msg.gapCard.title.zh : msg.gapCard.title.en}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {msg.gapCard.steps.map((gs) => {
                          const sd = stepDefs.find((s) => s.key === gs.stepKey)
                          if (!sd) return null
                          const idx = stepDefs.findIndex((s) => s.key === gs.stepKey)
                          return (
                            <button
                              key={gs.stepKey}
                              onClick={() => setCurrentStep(idx)}
                              className="flex items-start gap-2 p-2 rounded-lg border border-border bg-secondary/40 hover:bg-secondary/70 transition-colors text-left group"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-[11px] font-semibold text-foreground">
                                    {zh ? sd.title.zh : sd.title.en}
                                  </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                                  {zh ? gs.reason.zh : gs.reason.en}
                                </p>
                              </div>
                              <ArrowRight className="size-3 text-muted-foreground group-hover:text-foreground mt-0.5 shrink-0" />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
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

              {/* Still needed banner (gap/partial state) */}
              {(() => {
                const state = stepStates[step.key]
                const missing = stepMissingFields[step.key] || []
                if (state !== "gap" && state !== "partial") return null
                const isGap = state === "gap"
                return (
                  <div className={cn(
                    "rounded-xl border p-3 flex items-start gap-2.5",
                    isGap ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
                  )}>
                    <AlertTriangle className={cn("size-4 shrink-0 mt-0.5", isGap ? "text-red-500" : "text-amber-500")} />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[11px] font-semibold", isGap ? "text-red-700" : "text-amber-700")}>
                        {isGap
                          ? (zh ? "以下字段还需要你补充" : "These fields still need your input")
                          : (zh ? "部分内容可以进一步完善" : "A few fields can still be improved")}
                      </p>
                      <ul className="mt-1 flex flex-wrap gap-1.5">
                        {missing.map((m) => (
                          <li key={m.key} className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded border",
                            isGap ? "border-red-200 bg-white text-red-700" : "border-amber-200 bg-white text-amber-700"
                          )}>
                            {zh ? m.label.zh : m.label.en}
                          </li>
                        ))}
                      </ul>
                      <p className={cn("text-[10px] mt-2 leading-relaxed", isGap ? "text-red-600" : "text-amber-600")}>
                        {step.key === "posts-ugc"
                          ? (zh ? "粘贴 Instagram / TikTok / Reviews 等平台链接，Nohi 会抓取并整理。" : "Paste links from Instagram / TikTok / Reviews / etc. — Nohi will fetch and organize.")
                          : (zh ? "你可以直接在下方字段里编辑，或在左侧对话里补充一个 PDF / 文档。" : "You can edit the fields below, or drop a PDF / doc into the chat on the left.")}
                      </p>
                    </div>
                  </div>
                )
              })()}

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

              {/* ── GUARDRAILS step (structured) ── */}
              {step.key === "guardrails" && (() => {
                const totalRules = Object.values(rulesByCategory).reduce((a, b) => a + b.length, 0)
                const highRules = Object.values(rulesByCategory).flat().filter((r) => r.sensitivity === "high").length
                return (
                  <>
                    {/* Summary bar */}
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs">
                      <ShieldAlert className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="text-foreground font-medium">
                        {totalRules} {zh ? "条规则" : "rules"}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-red-600 font-medium">
                        {highRules} {zh ? "高敏感度" : "high sensitivity"}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {zh ? "智能体优先遵守高敏感度规则" : "Agents enforce high-sensitivity rules first"}
                      </span>
                    </div>

                    {/* Category cards */}
                    <div className="grid grid-cols-1 gap-3">
                      {GUARDRAIL_CATEGORIES.map((cat) => {
                        const rules = rulesByCategory[cat.id]
                        const highCount = rules.filter((r) => r.sensitivity === "high").length
                        return (
                          <div key={cat.id} className="rounded-xl border border-border bg-background p-3 flex flex-col gap-2.5">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                {cat.id === "no-mention"  && <ShieldAlert className="size-3.5 text-red-500 shrink-0 mt-0.5" />}
                                {cat.id === "no-compare"  && <X className="size-3.5 text-orange-500 shrink-0 mt-0.5" />}
                                {cat.id === "no-audience" && <AlertTriangle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />}
                                {cat.id === "compliance"  && <Info className="size-3.5 text-blue-500 shrink-0 mt-0.5" />}
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-semibold text-foreground">{zh ? cat.label.zh : cat.label.en}</h4>
                                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{zh ? cat.description.zh : cat.description.en}</p>
                                </div>
                              </div>
                              {highCount > 0 && (
                                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 shrink-0">
                                  {highCount} {zh ? "高" : "high"}
                                </span>
                              )}
                            </div>

                            {/* Rules list */}
                            <div className="flex flex-col gap-1.5">
                              {rules.length === 0 && (
                                <p className="text-[11px] text-muted-foreground italic px-1">
                                  {zh ? "暂无规则。" : "No rules yet — add one below."}
                                </p>
                              )}
                              {rules.map((rule) => {
                                const cfg = SENSITIVITY_CONFIG[rule.sensitivity]
                                return (
                                  <div key={rule.id} className="flex items-start gap-2 p-2 rounded-lg border border-border bg-secondary/30 group">
                                    <p className="flex-1 text-xs text-foreground leading-snug min-w-0">{rule.text}</p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const order: RuleSensitivity[] = ["high", "medium", "low"]
                                        const next = order[(order.indexOf(rule.sensitivity) + 1) % order.length]
                                        setRulesByCategory((prev) => ({
                                          ...prev,
                                          [cat.id]: prev[cat.id].map((r) => r.id === rule.id ? { ...r, sensitivity: next } : r),
                                        }))
                                      }}
                                      title={zh ? "点击切换敏感度" : "Click to cycle sensitivity"}
                                      className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0", cfg.bg, cfg.color)}
                                    >
                                      {zh ? cfg.label.zh : cfg.label.en}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setRulesByCategory((prev) => ({ ...prev, [cat.id]: prev[cat.id].filter((r) => r.id !== rule.id) }))}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 shrink-0"
                                    >
                                      <Trash2 className="size-3" />
                                    </button>
                                  </div>
                                )
                              })}
                            </div>

                            {/* Add rule input */}
                            <AddRuleInline
                              onAdd={(text, sensitivity) => {
                                setRulesByCategory((prev) => ({
                                  ...prev,
                                  [cat.id]: [...prev[cat.id], { id: `${cat.id}-${Date.now()}`, text, sensitivity }],
                                }))
                              }}
                              zh={zh}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              })()}

              {/* ── POSTS & UGC step ── */}
              {step.key === "posts-ugc" && (
                <>
                  {/* Link input bar (always visible, both views) */}
                  <div className="rounded-xl border border-border bg-secondary/40 p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Link2 className="size-4 text-muted-foreground shrink-0" />
                      <input
                        type="text"
                        value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") analyzeLink() }}
                        placeholder={zh
                          ? "粘贴 Instagram / TikTok / YouTube / X 等链接，Nohi 自动抓取并填表..."
                          : "Paste a link from Instagram, TikTok, YouTube, X, etc. — Nohi will fetch and organize..."}
                        className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                      />
                      <Button
                        size="sm"
                        className="rounded-full px-3 h-7 text-[11px]"
                        disabled={!linkInput.trim() || linkAnalyzing}
                        onClick={analyzeLink}
                      >
                        {linkAnalyzing ? (zh ? "分析中..." : "Analyzing...") : (zh ? "分析" : "Analyze")}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {zh
                        ? "支持单条链接或批量粘贴，平台会自动识别。"
                        : "Supports single or batched links — platform auto-detected."}
                    </p>
                  </div>

                  {/* Platform cards grid (when no active platform) */}
                  {!activePlatform && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {platformMetas.map((meta) => {
                        const p = getPlatform(meta.key)!
                        const m = computeMetrics(p)
                        const isReviews = meta.kind === "reviews"
                        return (
                          <button
                            key={meta.key}
                            onClick={() => setActivePlatform(meta.key)}
                            className="group text-left rounded-xl border border-border bg-background hover:bg-secondary/40 hover:border-foreground/30 transition-all p-3 flex flex-col gap-2.5"
                          >
                            {/* Header: platform badge + name + connected indicator */}
                            <div className="flex items-center gap-2">
                              <div className={cn("size-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white", meta.color)}>
                                {meta.short}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-foreground truncate">
                                  {zh ? meta.label.zh : meta.label.en}
                                </div>
                                <div className="text-[10px] text-muted-foreground truncate">
                                  {p.connected
                                    ? (p.lastSyncedDisplay ? `${zh ? "同步于" : "Synced"} ${p.lastSyncedDisplay}` : (zh ? "已连接" : "Connected"))
                                    : (zh ? "未连接" : "Not connected")}
                                </div>
                              </div>
                              {m.pending > 0 && (
                                <span className="shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-medium">
                                  <Bell className="size-2.5" /> {m.pending}
                                </span>
                              )}
                            </div>

                            {/* Metrics row */}
                            {p.items.length === 0 ? (
                              <div className="text-[11px] text-muted-foreground">
                                {zh ? "还没有内容 — 粘贴上方链接导入第一条。" : "No items yet — paste a link above to import."}
                              </div>
                            ) : isReviews ? (
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-lg font-semibold text-foreground tabular-nums">{m.avgRating?.toFixed(1)}</span>
                                  <div className="flex items-center gap-0.5">
                                    {[1,2,3,4,5].map((n) => (
                                      <Star key={n} className={cn("size-3", (m.avgRating || 0) >= n ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-muted-foreground ml-auto tabular-nums">{m.total} {zh ? "条" : "total"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px]">
                                  <span className="text-emerald-600 tabular-nums">{zh ? "好评" : "Positive"} {m.positivePct ?? 0}%</span>
                                  <span className="text-rose-600 tabular-nums">{zh ? "差评" : "Negative"} {m.negativePct ?? 0}%</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-lg font-semibold text-foreground tabular-nums">{m.total}</span>
                                  <span className="text-[10px] text-muted-foreground">{zh ? "条内容" : "items"}</span>
                                  {m.latestDisplay && (
                                    <span className="text-[10px] text-muted-foreground ml-auto tabular-nums">
                                      {zh ? "最近" : "Latest"} {m.latestDisplay}
                                    </span>
                                  )}
                                </div>
                                {typeof m.avgEngagement === "number" && (
                                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                    <TrendingUp className="size-2.5" />
                                    <span className="tabular-nums">{zh ? "平均互动" : "Avg engagement"} {m.avgEngagement.toLocaleString()}</span>
                                    {typeof m.positivePct === "number" && (
                                      <span className="text-emerald-600 ml-auto tabular-nums">{m.positivePct}% {zh ? "正面" : "positive"}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Footer row: approved / agent-available */}
                            <div className="flex items-center gap-2 pt-1.5 border-t border-border">
                              <span className="text-[10px] text-muted-foreground">
                                <CheckCircle2 className="size-2.5 inline mr-0.5 text-emerald-500" />
                                {m.approved} {zh ? "已审" : "approved"}
                              </span>
                              <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-0.5 group-hover:text-foreground transition-colors">
                                {zh ? "打开" : "Open"}
                                <ArrowRight className="size-2.5" />
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Platform detail view */}
                  {activePlatform && (() => {
                    const p = getPlatform(activePlatform)!
                    const meta = platformMetas.find((m) => m.key === activePlatform)!
                    const m = computeMetrics(p)
                    const isReviews = meta.kind === "reviews"
                    const visibleItems = p.items.filter((it) => {
                      if (statusFilter !== "all" && it.status !== statusFilter) return false
                      if (sentimentFilter !== "all" && it.sentiment !== sentimentFilter) return false
                      if (isReviews && productFilter !== "all" && it.product !== productFilter) return false
                      if (isReviews && categoryFilter !== "all" && it.category !== categoryFilter) return false
                      return true
                    })
                    const visibleIds = visibleItems.map((i) => i.id)
                    const selectedInView = visibleIds.filter((id) => selectedItemIds.has(id))
                    const reviewProducts = isReviews
                      ? Array.from(new Set(p.items.map((i) => i.product).filter((x): x is string => !!x)))
                      : []
                    const reviewCategories = isReviews
                      ? Array.from(new Set(p.items.map((i) => i.category).filter((x): x is string => !!x)))
                      : []
                    return (
                      <>
                        {/* Header: back + platform + metrics */}
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-7 rounded-full text-xs px-2" onClick={() => { setActivePlatform(null); setSelectedItemIds(new Set()); setStatusFilter("all"); setSentimentFilter("all"); setProductFilter("all"); setCategoryFilter("all") }}>
                              <ChevronLeft className="size-3.5 mr-1" />{zh ? "全部平台" : "All platforms"}
                            </Button>
                            <div className={cn("size-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white", meta.color)}>
                              {meta.short}
                            </div>
                            <span className="text-sm font-semibold text-foreground">{zh ? meta.label.zh : meta.label.en}</span>
                            <span className="text-[11px] text-muted-foreground">
                              · {p.connected ? (zh ? "已连接" : "Connected") : (zh ? "未连接" : "Not connected")}
                              {p.lastSyncedDisplay && ` · ${zh ? "同步于" : "Synced"} ${p.lastSyncedDisplay}`}
                            </span>
                          </div>

                          {/* Stats strip */}
                          <div className={cn("grid gap-2", isReviews ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2 md:grid-cols-4")}>
                            <div className="rounded-lg bg-secondary/50 p-2.5">
                              <div className="text-[10px] text-muted-foreground">{zh ? "总数" : "Total"}</div>
                              <div className="text-base font-semibold tabular-nums">{m.total}</div>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2.5">
                              <div className="text-[10px] text-muted-foreground">{zh ? "已审" : "Approved"}</div>
                              <div className="text-base font-semibold tabular-nums text-emerald-600">{m.approved}</div>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2.5">
                              <div className="text-[10px] text-muted-foreground">{zh ? "待审" : "Pending"}</div>
                              <div className="text-base font-semibold tabular-nums text-amber-600">{m.pending}</div>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2.5">
                              <div className="text-[10px] text-muted-foreground">{zh ? "已拒" : "Rejected"}</div>
                              <div className="text-base font-semibold tabular-nums text-rose-600">{m.rejected}</div>
                            </div>
                            {isReviews && typeof m.avgRating === "number" && (
                              <div className="rounded-lg bg-secondary/50 p-2.5">
                                <div className="text-[10px] text-muted-foreground">{zh ? "平均星级" : "Avg rating"}</div>
                                <div className="flex items-center gap-1">
                                  <span className="text-base font-semibold tabular-nums">{m.avgRating.toFixed(1)}</span>
                                  <Star className="size-3 fill-amber-400 text-amber-400" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Reviews sync controls (only for reviews platform) */}
                          {isReviews && (
                            <div className="rounded-xl border border-border bg-background p-3 flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Clock className="size-3.5 text-muted-foreground" />
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-medium text-foreground">
                                    {zh ? "同步设置" : "Sync"}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground tabular-nums">
                                    {zh ? "上次同步" : "Last synced"} {reviewsLastSynced}
                                  </span>
                                </div>
                              </div>
                              <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                                <input
                                  type="checkbox"
                                  checked={reviewsAutoSync}
                                  onChange={(e) => setReviewsAutoSync(e.target.checked)}
                                  className="accent-foreground"
                                />
                                <span>{zh ? "自动同步" : "Auto-sync"}</span>
                              </label>
                              <select
                                value={reviewsSyncFreq}
                                onChange={(e) => setReviewsSyncFreq(e.target.value as "daily" | "weekly" | "monthly")}
                                disabled={!reviewsAutoSync}
                                className="bg-secondary border border-border rounded-md px-2 py-0.5 text-[11px] text-foreground disabled:opacity-50"
                              >
                                <option value="daily">{zh ? "每日" : "Daily"}</option>
                                <option value="weekly">{zh ? "每周" : "Weekly"}</option>
                                <option value="monthly">{zh ? "每月" : "Monthly"}</option>
                              </select>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 rounded-full text-[11px] px-3 ml-auto"
                                disabled={reviewsSyncing}
                                onClick={() => {
                                  setReviewsSyncing(true)
                                  setTimeout(() => {
                                    const newRows: PlatformItem[] = [
                                      { id: `rv-sync-${Date.now()}-a`, title: "Fast shipping and great packaging — impressed", url: "https://site.com/reviews/new-a", author: "Noa K.", publishedAt: zh ? "刚刚" : "just now", rating: 5, verified: true, sentiment: "positive", themes: ["shipping","packaging"], status: "pending", agentAvailable: false, product: "Linen Shirt", category: "Apparel" },
                                      { id: `rv-sync-${Date.now()}-b`, title: "Mug chipped on arrival, second one this month", url: "https://site.com/reviews/new-b", author: "Ray O.", publishedAt: zh ? "刚刚" : "just now", rating: 1, verified: true, sentiment: "negative", themes: ["packaging","quality"], status: "pending", agentAvailable: false, product: "Ceramic Mug", category: "Home" },
                                    ]
                                    updatePlatform("reviews", (p) => ({ ...p, items: [...newRows, ...p.items], lastSyncedDisplay: zh ? "刚刚" : "just now" }))
                                    setReviewsLastSynced(zh ? "刚刚" : "just now")
                                    setReviewsSyncing(false)
                                  }, 1200)
                                }}
                              >
                                {reviewsSyncing
                                  ? (zh ? "同步中..." : "Syncing...")
                                  : (zh ? "立即同步" : "Sync now")}
                              </Button>
                            </div>
                          )}

                          {/* Reviews auto-rules (only for reviews platform) */}
                          {isReviews && (
                            <div className="rounded-xl border border-border bg-background p-3 flex flex-col gap-2">
                              <div className="text-[11px] font-medium text-foreground">{zh ? "自动审核规则" : "Auto-moderation rules"}</div>
                              <div className="flex flex-wrap items-center gap-3 text-[11px]">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input type="checkbox" checked={reviewsAutoPublishMin <= 4} onChange={(e) => setReviewsAutoPublishMin(e.target.checked ? 4 : 0)} className="accent-foreground" />
                                  <span>{zh ? "自动发布 ≥" : "Auto-publish ≥"}</span>
                                  <select
                                    value={reviewsAutoPublishMin}
                                    onChange={(e) => setReviewsAutoPublishMin(Number(e.target.value))}
                                    className="bg-secondary border border-border rounded px-1 py-0.5 text-[11px]"
                                  >
                                    {[3,4,5].map((n) => <option key={n} value={n}>{n}★</option>)}
                                  </select>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input type="checkbox" checked={reviewsHideFlagged} onChange={(e) => setReviewsHideFlagged(e.target.checked)} className="accent-foreground" />
                                  <span>{zh ? "触发 Guardrails 关键词的评价自动隐藏" : "Hide reviews with Guardrails-flagged keywords"}</span>
                                </label>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Filters: sentiment + product + category (reviews) */}
                        <div className="flex flex-col gap-2">
                          {/* Sentiment filter (all platforms with sentiment) */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                              {zh ? "情感" : "Sentiment"}
                            </span>
                            <div className="flex items-center gap-1">
                              {(["all", "positive", "neutral", "negative"] as const).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => { setSentimentFilter(s); setSelectedItemIds(new Set()) }}
                                  className={cn(
                                    "px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors border",
                                    sentimentFilter === s
                                      ? s === "positive" ? "bg-emerald-100 border-emerald-200 text-emerald-700"
                                      : s === "negative" ? "bg-rose-100 border-rose-200 text-rose-700"
                                      : s === "neutral"  ? "bg-slate-100 border-slate-200 text-slate-700"
                                      :                    "bg-foreground text-background border-foreground"
                                      : "bg-secondary border-border text-muted-foreground hover:bg-secondary/80"
                                  )}
                                >
                                  {s === "all" ? (zh ? "全部" : "All")
                                    : s === "positive" ? (zh ? "正面" : "Positive")
                                    : s === "neutral"  ? (zh ? "中性" : "Neutral")
                                    : (zh ? "负面" : "Negative")}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Reviews-only: product + category */}
                          {isReviews && (reviewProducts.length > 0 || reviewCategories.length > 0) && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {reviewCategories.length > 0 && (
                                <>
                                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                                    {zh ? "品类" : "Category"}
                                  </span>
                                  <select
                                    value={categoryFilter}
                                    onChange={(e) => { setCategoryFilter(e.target.value); setProductFilter("all"); setSelectedItemIds(new Set()) }}
                                    className="bg-secondary border border-border rounded-md px-2 py-0.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                  >
                                    <option value="all">{zh ? "全部品类" : "All categories"}</option>
                                    {reviewCategories.map((c) => (
                                      <option key={c} value={c}>{c}</option>
                                    ))}
                                  </select>
                                </>
                              )}
                              {reviewProducts.length > 0 && (
                                <>
                                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium ml-2">
                                    {zh ? "商品" : "Product"}
                                  </span>
                                  <select
                                    value={productFilter}
                                    onChange={(e) => { setProductFilter(e.target.value); setSelectedItemIds(new Set()) }}
                                    className="bg-secondary border border-border rounded-md px-2 py-0.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring max-w-[180px]"
                                  >
                                    <option value="all">{zh ? "全部商品" : "All products"}</option>
                                    {reviewProducts
                                      .filter((prod) => {
                                        if (categoryFilter === "all") return true
                                        const cat = p.items.find((i) => i.product === prod)?.category
                                        return cat === categoryFilter
                                      })
                                      .map((prod) => (
                                        <option key={prod} value={prod}>{prod}</option>
                                      ))}
                                  </select>
                                </>
                              )}
                              {(productFilter !== "all" || categoryFilter !== "all" || sentimentFilter !== "all") && (
                                <button
                                  onClick={() => { setProductFilter("all"); setCategoryFilter("all"); setSentimentFilter("all") }}
                                  className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
                                >
                                  {zh ? "清除筛选" : "Clear filters"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Bulk action bar + status filter */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1">
                            {(["all", "pending", "approved", "rejected"] as const).map((s) => (
                              <button
                                key={s}
                                onClick={() => { setStatusFilter(s); setSelectedItemIds(new Set()) }}
                                className={cn(
                                  "px-2 py-1 rounded-md text-[11px] font-medium transition-colors",
                                  statusFilter === s
                                    ? "bg-foreground text-background"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                )}
                              >
                                {s === "all" ? (zh ? "全部" : "All")
                                  : s === "pending" ? (zh ? "待审" : "Pending")
                                  : s === "approved" ? (zh ? "已审" : "Approved")
                                  : (zh ? "已拒" : "Rejected")}
                              </button>
                            ))}
                          </div>
                          {selectedInView.length > 0 ? (
                            <div className="flex items-center gap-1 ml-auto">
                              <span className="text-[11px] text-muted-foreground mr-1">
                                {zh ? `已选 ${selectedInView.length} 条` : `${selectedInView.length} selected`}
                              </span>
                              <Button size="sm" variant="outline" className="h-7 rounded-full text-[11px] px-2" onClick={() => setItemStatus(activePlatform, selectedInView, "approved")}>
                                <CheckCircle2 className="size-3 mr-1 text-emerald-500" /> {zh ? "批量通过" : "Approve"}
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 rounded-full text-[11px] px-2" onClick={() => setItemStatus(activePlatform, selectedInView, "rejected")}>
                                <XCircle className="size-3 mr-1 text-rose-500" /> {zh ? "批量拒绝" : "Reject"}
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 rounded-full text-[11px] px-2 text-muted-foreground" onClick={() => deleteItems(activePlatform, selectedInView)}>
                                <Trash2 className="size-3 mr-1" /> {zh ? "删除" : "Delete"}
                              </Button>
                            </div>
                          ) : (
                            visibleItems.length > 0 && (
                              <button
                                onClick={() => selectAllVisible(visibleIds)}
                                className="ml-auto text-[11px] text-muted-foreground hover:text-foreground"
                              >
                                {zh ? "全选当前" : "Select all"}
                              </button>
                            )
                          )}
                        </div>

                        {/* Items table */}
                        {visibleItems.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-border p-6 text-center">
                            <p className="text-xs text-muted-foreground">
                              {p.items.length === 0
                                ? (zh ? "这个平台还没有内容 — 粘贴链接开始导入。" : "No items on this platform — paste a link to start.")
                                : (zh ? "当前筛选下没有内容。" : "No items match the current filter.")}
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-border bg-background overflow-hidden">
                            <div className="divide-y divide-border">
                              {visibleItems.map((it) => {
                                const isSelected = selectedItemIds.has(it.id)
                                return (
                                  <div key={it.id} className={cn(
                                    "flex items-start gap-2 px-3 py-2.5 hover:bg-secondary/40 transition-colors",
                                    it.status === "pending" && "bg-amber-50/30",
                                    isSelected && "bg-secondary/60"
                                  )}>
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => toggleItemSelection(it.id)}
                                      className="mt-1 accent-foreground"
                                    />
                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        {it.rating && (
                                          <span className="inline-flex items-center gap-0.5 text-[11px] text-amber-600 tabular-nums font-medium shrink-0">
                                            {it.rating}<Star className="size-2.5 fill-amber-400 text-amber-400" />
                                          </span>
                                        )}
                                        <span className="text-xs text-foreground truncate font-medium">{it.title}</span>
                                        {it.verified && (
                                          <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-100 text-emerald-700 shrink-0">
                                            {zh ? "已验证" : "Verified"}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 flex-wrap text-[10px] text-muted-foreground">
                                        {it.product && (
                                          <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setProductFilter(it.product!); setSelectedItemIds(new Set()) }}
                                            className="px-1.5 py-0.5 rounded bg-foreground/5 text-foreground font-medium text-[10px] hover:bg-foreground/10"
                                            title={zh ? "按此商品筛选" : "Filter by this product"}
                                          >
                                            {it.product}
                                          </button>
                                        )}
                                        {it.category && (
                                          <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setCategoryFilter(it.category!); setProductFilter("all"); setSelectedItemIds(new Set()) }}
                                            className="px-1.5 py-0.5 rounded border border-border text-[10px] hover:bg-secondary"
                                            title={zh ? "按此品类筛选" : "Filter by this category"}
                                          >
                                            {it.category}
                                          </button>
                                        )}
                                        {it.author && <span>{it.author}</span>}
                                        <span className="tabular-nums">{it.publishedAt}</span>
                                        {typeof it.likes === "number" && <span className="tabular-nums">♡ {it.likes.toLocaleString()}</span>}
                                        {typeof it.comments === "number" && <span className="tabular-nums">💬 {it.comments.toLocaleString()}</span>}
                                        {typeof it.shares === "number" && <span className="tabular-nums">↗ {it.shares.toLocaleString()}</span>}
                                        {it.sentiment && (
                                          <span className={cn(
                                            "px-1 py-0.5 rounded text-[9px] font-medium",
                                            it.sentiment === "positive" && "bg-emerald-100 text-emerald-700",
                                            it.sentiment === "neutral"  && "bg-slate-100 text-slate-700",
                                            it.sentiment === "negative" && "bg-rose-100 text-rose-700"
                                          )}>
                                            {it.sentiment === "positive" ? (zh ? "正面" : "Positive")
                                              : it.sentiment === "negative" ? (zh ? "负面" : "Negative")
                                              : (zh ? "中性" : "Neutral")}
                                          </span>
                                        )}
                                        {it.themes?.map((t) => (
                                          <span key={t} className="px-1 py-0.5 rounded bg-secondary text-[9px]">{t}</span>
                                        ))}
                                        <a href={it.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-muted-foreground hover:text-foreground ml-auto">
                                          <ExternalLink className="size-2.5" />
                                        </a>
                                      </div>
                                    </div>

                                    {/* Status + action */}
                                    <div className="flex items-center gap-1 shrink-0">
                                      {it.status === "approved" ? (
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-medium">
                                          <CheckCircle2 className="size-2.5" /> {zh ? "已审" : "Approved"}
                                        </span>
                                      ) : it.status === "pending" ? (
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => setItemStatus(activePlatform, [it.id], "approved")}
                                            className="p-1 rounded hover:bg-emerald-100 text-emerald-600"
                                            aria-label={zh ? "通过" : "Approve"}
                                          >
                                            <CheckCircle2 className="size-3.5" />
                                          </button>
                                          <button
                                            onClick={() => setItemStatus(activePlatform, [it.id], "rejected")}
                                            className="p-1 rounded hover:bg-rose-100 text-rose-600"
                                            aria-label={zh ? "拒绝" : "Reject"}
                                          >
                                            <XCircle className="size-3.5" />
                                          </button>
                                        </div>
                                      ) : (
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-medium">
                                          <XCircle className="size-2.5" /> {zh ? "已拒" : "Rejected"}
                                        </span>
                                      )}
                                      {it.agentAvailable && (
                                        <span title={zh ? "Agent 可引用" : "Agent can reference"} className="text-[10px] text-emerald-600">●</span>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </>
              )}

              {/* ── FULFILLMENT step ── */}
              {step.key === "fulfillment" && (
                <>
                  {/* Shipping SLA tier */}
                  <FormSection
                    title={zh ? "配送 SLA 等级" : "Shipping SLA Tier"}
                    description={zh ? "选择最符合您当前配送能力的等级。" : "Select the tier that best matches your current shipping capability."}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {shippingRanks.map((rank) => (
                        <button
                          key={rank.value}
                          type="button"
                          onClick={() => setShippingRank(rank.value)}
                          className={cn(
                            "p-3 rounded-xl border text-left transition-all",
                            shippingRank === rank.value
                              ? "border-foreground bg-foreground/5"
                              : "border-border bg-secondary/50 hover:bg-secondary"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-foreground">{rank.label}</span>
                            {rank.recommended && (
                              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-foreground/10 text-muted-foreground">
                                {zh ? "推荐" : "Recommended"}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                            {zh ? rank.description.zh : rank.description.en}
                          </p>
                        </button>
                      ))}
                    </div>
                  </FormSection>

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

              {/* ── CLONE step (Migrate Brand Memory) ── */}
              {step.key === "clone" && (() => {
                const cfg = cloneSourceConfigs[cloneSource]
                return (
                  <>
                    {/* Hero callout */}
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-blue-600 shrink-0" />
                        <h3 className="text-xs font-semibold text-foreground">
                          {zh ? "从现有 AI 迁移品牌运营记忆" : "Migrate Brand Memory from Your AI"}
                        </h3>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {zh
                          ? "你可能已经在 ChatGPT、Gemini 或 Claude 里积累了不少品牌知识。三步就能搬到 Nohi，不用从头填一遍。"
                          : "You've probably built up brand knowledge in ChatGPT, Gemini, or Claude. Bring it into Nohi in three quick steps — no retyping."}
                      </p>
                    </div>

                    {/* Step 1 — Choose source */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-bold shrink-0">1</span>
                        <h4 className="text-xs font-semibold text-foreground">
                          {zh ? "选择来源 AI" : "Choose your source AI"}
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(Object.keys(cloneSourceConfigs) as CloneSource[]).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setCloneSource(s)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all",
                              cloneSource === s
                                ? "bg-foreground text-background border-foreground"
                                : "bg-secondary border-border text-foreground hover:bg-secondary/80"
                            )}
                          >
                            {cloneSourceConfigs[s].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2 — Copy prompt */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-bold shrink-0">2</span>
                        <h4 className="text-xs font-semibold text-foreground">
                          {zh ? `复制提示词并粘到 ${cfg.label}` : `Copy the prompt and paste it into ${cfg.label}`}
                        </h4>
                      </div>
                      <div className={cn("rounded-lg border px-3 py-2 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2", cfg.bg)}>
                        <Info className="size-3 shrink-0 mt-0.5" />
                        <span className="flex-1">{zh ? cfg.hint.zh : cfg.hint.en}</span>
                        {cloneSource !== "other" && (
                          <a
                            href={cfg.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn("flex items-center gap-0.5 font-medium shrink-0", cfg.color)}
                          >
                            {zh ? "打开" : "Open"}
                            <ExternalLink className="size-2.5" />
                          </a>
                        )}
                      </div>
                      <div className="relative rounded-lg bg-secondary overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-secondary/60">
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {zh ? "品牌记忆提取提示词" : "Brand Memory Extraction Prompt"}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(CLONE_PROMPT)
                              setCloneCopied(true)
                              setTimeout(() => setCloneCopied(false), 2000)
                            }}
                            className={cn(
                              "flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md transition-all",
                              cloneCopied
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-background border border-border text-foreground hover:bg-secondary"
                            )}
                          >
                            <Copy className="size-3" />
                            {cloneCopied ? (zh ? "已复制" : "Copied!") : (zh ? "复制" : "Copy")}
                          </button>
                        </div>
                        <pre className="p-3 text-[11px] text-foreground/80 leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto max-h-52 overflow-y-auto">
                          {CLONE_PROMPT}
                        </pre>
                      </div>
                    </div>

                    {/* Step 3 — Paste response */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-bold shrink-0">3</span>
                        <h4 className="text-xs font-semibold text-foreground">
                          {zh ? "把 AI 的回复粘贴到这里" : "Paste the AI's response here"}
                        </h4>
                      </div>
                      <Textarea
                        value={clonePastedMemory}
                        onChange={(e) => { setClonePastedMemory(e.target.value); setCloneImported(false) }}
                        rows={8}
                        className="rounded-lg bg-secondary border-border resize-none text-xs font-mono"
                        placeholder={zh
                          ? `把 ${cfg.label} 的结构化回复粘到这里…`
                          : `Paste ${cfg.label}'s structured response here…`}
                      />
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] text-muted-foreground leading-relaxed flex-1">
                          {zh
                            ? "Nohi 会自动把内容映射到对应字段（Details、Guardrails 等），你可以在导入后回到各个步骤核对。"
                            : "Nohi will auto-map the content into the relevant fields (Details, Guardrails, etc.) — review in each step after import."}
                        </p>
                        <Button
                          onClick={() => { if (clonePastedMemory.trim()) setCloneImported(true) }}
                          disabled={!clonePastedMemory.trim()}
                          size="sm"
                          className="rounded-full px-4 gap-1 text-xs shrink-0"
                        >
                          <Sparkles className="size-3" />
                          {zh ? "导入品牌记忆" : "Import Brand Memory"}
                        </Button>
                      </div>

                      {cloneImported && (
                        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                          <Check className="size-3.5 text-emerald-600 shrink-0" />
                          <p className="text-[11px] text-emerald-700">
                            {zh ? "品牌记忆已成功导入！记得在其他步骤里核对和补充。" : "Brand memory imported successfully! Review and refine in the other steps."}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )
              })()}

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

/* ───────── AddRuleInline (for Structured Guardrails) ───────── */

function AddRuleInline({ onAdd, zh }: { onAdd: (text: string, sensitivity: RuleSensitivity) => void; zh: boolean }) {
  const [text, setText] = useState("")
  const [sensitivity, setSensitivity] = useState<RuleSensitivity>("medium")
  const submit = () => {
    const v = text.trim()
    if (!v) return
    onAdd(v, sensitivity)
    setText("")
  }
  return (
    <div className="flex items-center gap-1.5 pt-1">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit() }}
        placeholder={zh ? "输入新规则…" : "Add a new rule…"}
        className="flex-1 min-w-0 bg-secondary border border-border rounded-md px-2 py-1 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <div className="flex gap-0.5">
        {(["high", "medium", "low"] as RuleSensitivity[]).map((s) => {
          const cfg = SENSITIVITY_CONFIG[s]
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSensitivity(s)}
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded border transition-all",
                sensitivity === s
                  ? cn(cfg.bg, cfg.color, "font-semibold")
                  : "border-border text-muted-foreground hover:bg-secondary"
              )}
            >
              {zh ? cfg.label.zh : cfg.label.en}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={!text.trim()}
        className="size-6 rounded-md bg-foreground text-background disabled:opacity-40 flex items-center justify-center"
      >
        <Plus className="size-3" />
      </button>
    </div>
  )
}
