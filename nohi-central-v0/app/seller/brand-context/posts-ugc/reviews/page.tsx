"use client"

import { useState, useRef } from "react"
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
  Plus, Trash2, ArrowLeft, Upload, Star, FileSpreadsheet, 
  Search, Filter, CheckCircle2, AlertCircle 
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Review {
  id: string
  author: string
  rating: number
  text: string
  product: string
  date: string
  verified: boolean
}

const initialReviews: Review[] = [
  {
    id: "r1",
    author: "Sarah M.",
    rating: 5,
    text: "Absolutely love the quality. The fabric feels premium and the fit is perfect. Will definitely buy more.",
    product: "Classic Cotton Tee",
    date: "2026-02-08",
    verified: true,
  },
  {
    id: "r2",
    author: "James L.",
    rating: 4,
    text: "Great shirt, runs slightly large. Material is top notch though. Arrived in 3 days.",
    product: "Relaxed Fit Hoodie",
    date: "2026-02-05",
    verified: true,
  },
  {
    id: "r3",
    author: "Mia K.",
    rating: 5,
    text: "The packaging was beautiful and the product exceeded expectations. Sustainable fashion done right.",
    product: "Organic Linen Pants",
    date: "2026-01-28",
    verified: true,
  },
  {
    id: "r4",
    author: "Alex T.",
    rating: 3,
    text: "Good quality but color was slightly different from the photos. Customer service was helpful though.",
    product: "Merino Wool Sweater",
    date: "2026-01-20",
    verified: true,
  },
]

export default function ReviewsPage() {
  const { language } = useLanguage()
  const [reviews, setReviews] = useState(initialReviews)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRating, setFilterRating] = useState<string>("all")
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null)

  const translations = {
    title: language === "zh" ? "认证评价" : "Verified Reviews",
    subtitle: language === "zh" ? "管理客户评价，Agent 会向购物者展示这些内容。" : "Manage customer reviews that agents surface to shoppers.",
    back: language === "zh" ? "返回" : "Back",
    addReview: language === "zh" ? "添加评价" : "Add Review",
    importCSV: language === "zh" ? "CSV 导入" : "Import CSV",
    reviewsTotal: language === "zh" ? "条评价" : "reviews",
    noReviews: language === "zh" ? "暂无评价。添加或导入评价开始。" : "No reviews yet. Add or import reviews to get started.",
    all: language === "zh" ? "全部" : "All",
    verified: language === "zh" ? "已认证" : "Verified",
    product: language === "zh" ? "产品" : "Product",
    search: language === "zh" ? "搜索评价..." : "Search reviews...",
    filterByRating: language === "zh" ? "按评分筛选" : "Filter by rating",
    stars: language === "zh" ? "星" : "stars",
    addReviewTitle: language === "zh" ? "添加评价" : "Add Review",
    addReviewDesc: language === "zh" ? "手动添加客户评价。" : "Manually add a customer review.",
    authorName: language === "zh" ? "作者姓名" : "Author Name",
    authorPlaceholder: language === "zh" ? "例如：张三" : "e.g. John D.",
    rating: language === "zh" ? "评分" : "Rating",
    reviewText: language === "zh" ? "评价内容" : "Review Text",
    reviewPlaceholder: language === "zh" ? "客户的评价内容..." : "Customer's review text...",
    productName: language === "zh" ? "产品名称" : "Product Name",
    productPlaceholder: language === "zh" ? "例如：经典棉T恤" : "e.g. Classic Cotton Tee",
    add: language === "zh" ? "添加" : "Add",
    cancel: language === "zh" ? "取消" : "Cancel",
    importTitle: language === "zh" ? "CSV 批量导入" : "CSV Batch Import",
    importDesc: language === "zh" ? "上传包含评价数据的 CSV 文件。" : "Upload a CSV file containing review data.",
    csvFormat: language === "zh" ? "CSV 格式要求" : "CSV Format Requirements",
    csvFormatDesc: language === "zh" ? "CSV 文件需包含以下列：author, rating, text, product, date" : "CSV file must contain columns: author, rating, text, product, date",
    downloadTemplate: language === "zh" ? "下载模板" : "Download Template",
    selectFile: language === "zh" ? "选择文件" : "Select File",
    import: language === "zh" ? "导入" : "Import",
    importSuccess: language === "zh" ? "成功导入" : "Successfully imported",
    importFailed: language === "zh" ? "失败" : "failed",
    tip: language === "zh" ? "提示" : "Tip",
    shopifyTip: language === "zh" ? "将评价连接到 Shopify 产品元字段，Agent 可以更智能地向购物者展示评价。" : "Connect reviews to Shopify product metafields so agents can intelligently surface them to shoppers.",
    learnMore: language === "zh" ? "Shopify 元字段文档" : "Shopify metafield docs",
  }

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = searchQuery === "" || 
      r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = filterRating === "all" || r.rating === parseInt(filterRating)
    return matchesSearch && matchesRating
  })

  const handleAddReview = (review: Omit<Review, "id" | "date" | "verified">) => {
    setReviews(prev => [{
      ...review,
      id: String(Date.now()),
      date: new Date().toISOString().slice(0, 10),
      verified: true,
    }, ...prev])
  }

  const handleImportCSV = (newReviews: Review[]) => {
    setReviews(prev => [...newReviews, ...prev])
  }

  const handleDelete = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0"

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

      {/* Shopify Tip */}
      <div className="rounded-xl bg-secondary/50 p-4 flex items-start gap-3 mb-4">
        <div className="size-5 shrink-0 rounded-full bg-foreground/10 flex items-center justify-center mt-0.5">
          <span className="text-xs text-foreground/70">💡</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground font-medium">{translations.tip}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {translations.shopifyTip}{" "}
            <a 
              href="https://help.shopify.com/en/manual/products/details/metafields" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              {translations.learnMore}
            </a>.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl bg-secondary/50 p-4">
          <p className="text-2xl font-semibold tabular-nums">{reviews.length}</p>
          <p className="text-xs text-muted-foreground">{translations.reviewsTotal}</p>
        </div>
        <div className="rounded-xl bg-secondary/50 p-4">
          <div className="flex items-center gap-1">
            <p className="text-2xl font-semibold tabular-nums">{avgRating}</p>
            <Star className="size-4 fill-foreground text-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">{language === "zh" ? "平均评分" : "Avg. rating"}</p>
        </div>
        <div className="rounded-xl bg-secondary/50 p-4 hidden md:block">
          <p className="text-2xl font-semibold tabular-nums">{reviews.filter(r => r.rating >= 4).length}</p>
          <p className="text-xs text-muted-foreground">{language === "zh" ? "4星以上" : "4+ stars"}</p>
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
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-28 h-9 text-xs rounded-full">
              <SelectValue placeholder={translations.filterByRating} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{translations.all}</SelectItem>
              <SelectItem value="5">5 {translations.stars}</SelectItem>
              <SelectItem value="4">4 {translations.stars}</SelectItem>
              <SelectItem value="3">3 {translations.stars}</SelectItem>
              <SelectItem value="2">2 {translations.stars}</SelectItem>
              <SelectItem value="1">1 {translations.stars}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <ImportCSVDialog
            translations={translations}
            onImport={handleImportCSV}
            onResult={setImportResult}
          />
          <AddReviewDialog
            translations={translations}
            onAdd={handleAddReview}
          />
        </div>
      </div>

      {/* Import Result */}
      {importResult && (
        <div className={cn(
          "rounded-xl p-3 flex items-center gap-2 mt-4",
          importResult.failed > 0 ? "bg-destructive/10" : "bg-green-500/10"
        )}>
          {importResult.failed > 0 ? (
            <AlertCircle className="size-4 text-destructive" />
          ) : (
            <CheckCircle2 className="size-4 text-green-600" />
          )}
          <p className="text-sm">
            {translations.importSuccess} {importResult.success} {translations.reviewsTotal}
            {importResult.failed > 0 && `, ${importResult.failed} ${translations.importFailed}`}
          </p>
          <button 
            onClick={() => setImportResult(null)}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="flex flex-col rounded-2xl divide-y divide-secondary bg-secondary/50 overflow-hidden mt-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="p-5 flex flex-col gap-2 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{review.author}</span>
                {review.verified && (
                  <Badge variant="secondary" className="text-xs">{translations.verified}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-3.5",
                        i < review.rating
                          ? "fill-foreground text-foreground"
                          : "text-border"
                      )}
                    />
                  ))}
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-foreground">{review.text}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {translations.product}: {review.product}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {review.date}
              </span>
            </div>
          </div>
        ))}
        {filteredReviews.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            {translations.noReviews}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

function AddReviewDialog({
  translations,
  onAdd,
}: {
  translations: Record<string, string>
  onAdd: (review: Omit<Review, "id" | "date" | "verified">) => void
}) {
  const [open, setOpen] = useState(false)
  const [author, setAuthor] = useState("")
  const [rating, setRating] = useState(5)
  const [text, setText] = useState("")
  const [product, setProduct] = useState("")

  const handleSubmit = () => {
    if (!author.trim() || !text.trim() || !product.trim()) return
    onAdd({ author, rating, text, product })
    resetForm()
    setOpen(false)
  }

  const resetForm = () => {
    setAuthor("")
    setRating(5)
    setText("")
    setProduct("")
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full text-xs gap-1.5">
          <Plus className="size-3.5" />
          {translations.addReview}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle>{translations.addReviewTitle}</DialogTitle>
          <DialogDescription>{translations.addReviewDesc}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.authorName}</Label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={translations.authorPlaceholder}
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.rating}</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      "size-6 transition-colors",
                      n <= rating
                        ? "fill-foreground text-foreground"
                        : "text-border hover:text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.reviewText}</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={translations.reviewPlaceholder}
              rows={3}
              className="rounded-xl resize-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.productName}</Label>
            <Input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder={translations.productPlaceholder}
              className="rounded-xl"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">
            {translations.cancel}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!author.trim() || !text.trim() || !product.trim()} 
            className="rounded-full"
          >
            {translations.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ImportCSVDialog({
  translations,
  onImport,
  onResult,
}: {
  translations: Record<string, string>
  onImport: (reviews: Review[]) => void
  onResult: (result: { success: number; failed: number }) => void
}) {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!selectedFile) return

    const text = await selectedFile.text()
    const lines = text.split("\n").filter(l => l.trim())
    
    if (lines.length < 2) {
      onResult({ success: 0, failed: 1 })
      setOpen(false)
      return
    }

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
    const authorIdx = headers.indexOf("author")
    const ratingIdx = headers.indexOf("rating")
    const textIdx = headers.indexOf("text")
    const productIdx = headers.indexOf("product")
    const dateIdx = headers.indexOf("date")

    if (authorIdx === -1 || ratingIdx === -1 || textIdx === -1 || productIdx === -1) {
      onResult({ success: 0, failed: lines.length - 1 })
      setOpen(false)
      return
    }

    const reviews: Review[] = []
    let failed = 0

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length >= headers.length) {
        const rating = parseInt(values[ratingIdx])
        if (rating >= 1 && rating <= 5) {
          reviews.push({
            id: String(Date.now()) + i,
            author: values[authorIdx],
            rating,
            text: values[textIdx],
            product: values[productIdx],
            date: dateIdx !== -1 ? values[dateIdx] : new Date().toISOString().slice(0, 10),
            verified: true,
          })
        } else {
          failed++
        }
      } else {
        failed++
      }
    }

    onImport(reviews)
    onResult({ success: reviews.length, failed })
    setSelectedFile(null)
    setOpen(false)
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const downloadTemplate = () => {
    const csv = "author,rating,text,product,date\nJohn D.,5,Great product!,Classic Cotton Tee,2026-03-01"
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "reviews-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSelectedFile(null) }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full text-xs gap-1.5">
          <FileSpreadsheet className="size-3.5" />
          {translations.importCSV}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle>{translations.importTitle}</DialogTitle>
          <DialogDescription>{translations.importDesc}</DialogDescription>
        </DialogHeader>
        
        {/* Format Info */}
        <div className="rounded-xl bg-secondary/50 p-4">
          <p className="text-sm font-medium">{translations.csvFormat}</p>
          <p className="text-xs text-muted-foreground mt-1">{translations.csvFormatDesc}</p>
          <button
            onClick={downloadTemplate}
            className="text-xs text-foreground underline mt-2 hover:no-underline"
          >
            {translations.downloadTemplate}
          </button>
        </div>

        {/* File Input */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl gap-2"
          >
            <Upload className="size-4" />
            {translations.selectFile}
          </Button>
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              {selectedFile.name}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">
            {translations.cancel}
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!selectedFile} 
            className="rounded-full"
          >
            {translations.import}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
