"use client"

import { useState, useCallback } from "react"
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
import { SimpleTagInput } from "@/components/seller/simple-tag-input"
import { 
  Plus, Trash2, ArrowLeft, Upload, Image as ImageIcon, 
  Video, X, FileImage, FileVideo, ExternalLink 
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface MediaAsset {
  id: string
  type: "image" | "video"
  name: string
  caption: string
  tags: string[]
  uploadedAt: string
  url: string
  size?: string
}

const initialMedia: MediaAsset[] = [
  {
    id: "m1",
    type: "image",
    name: "hero-spring-2026.jpg",
    caption: "Spring 2026 collection hero shot featuring our bestselling organic cotton pieces.",
    tags: ["Campaign", "Spring", "Hero"],
    uploadedAt: "2026-02-01",
    url: "#",
    size: "2.4 MB",
  },
  {
    id: "m2",
    type: "video",
    name: "behind-the-scenes.mp4",
    caption: "A day at our design studio: see how we bring ideas from sketch to shelf.",
    tags: ["BTS", "Brand Story"],
    uploadedAt: "2026-01-20",
    url: "#",
    size: "48.2 MB",
  },
  {
    id: "m3",
    type: "image",
    name: "product-flatlay-01.jpg",
    caption: "Flat lay of our essentials collection on natural linen.",
    tags: ["Product", "Flatlay"],
    uploadedAt: "2026-01-15",
    url: "#",
    size: "1.8 MB",
  },
]

const mediaTagSuggestions = [
  "Campaign", "Product", "Lifestyle", "Flatlay", "Hero",
  "BTS", "Brand Story", "Seasonal", "UGC", "Studio",
]

export default function MediaPage() {
  const { language } = useLanguage()
  const [media, setMedia] = useState(initialMedia)
  const [filterType, setFilterType] = useState<string>("all")

  const translations = {
    title: language === "zh" ? "品牌媒体库" : "Brand Media Library",
    subtitle: language === "zh" ? "上传和管理品牌图片和视频素材。" : "Upload and manage your brand images and video assets.",
    back: language === "zh" ? "返回" : "Back",
    uploadMedia: language === "zh" ? "上传媒体" : "Upload Media",
    mediaAssets: language === "zh" ? "个媒体素材" : "media assets",
    noMedia: language === "zh" ? "暂无媒体素材。上传第一个文件开始。" : "No media assets yet. Upload your first file to get started.",
    all: language === "zh" ? "全部" : "All",
    images: language === "zh" ? "图片" : "Images",
    videos: language === "zh" ? "视频" : "Videos",
    uploadTitle: language === "zh" ? "上传品牌媒体" : "Upload Brand Media",
    uploadDesc: language === "zh" ? "拖拽文件到此处或点击选择。支持 JPG, PNG, GIF, MP4, MOV。" : "Drag and drop files here or click to select. Supports JPG, PNG, GIF, MP4, MOV.",
    dragActive: language === "zh" ? "释放文件以上传" : "Drop files to upload",
    selectedFiles: language === "zh" ? "已选择的文件" : "Selected Files",
    caption: language === "zh" ? "描述" : "Caption",
    captionPlaceholder: language === "zh" ? "描述这个媒体文件..." : "Describe this media file...",
    tags: language === "zh" ? "标签" : "Tags",
    addTags: language === "zh" ? "添加标签..." : "Add tags...",
    upload: language === "zh" ? "上传" : "Upload",
    cancel: language === "zh" ? "取消" : "Cancel",
    open: language === "zh" ? "打开" : "Open",
    delete: language === "zh" ? "删除" : "Delete",
    image: language === "zh" ? "图片" : "Image",
    video: language === "zh" ? "视频" : "Video",
  }

  const filteredMedia = filterType === "all" 
    ? media 
    : media.filter(m => m.type === filterType)

  const handleUpload = (files: FileUploadData[]) => {
    const newMedia: MediaAsset[] = files.map(f => ({
      id: String(Date.now()) + Math.random().toString(36).slice(2),
      type: f.type,
      name: f.name,
      caption: f.caption,
      tags: f.tags,
      uploadedAt: new Date().toISOString().slice(0, 10),
      url: f.previewUrl || "#",
      size: f.size,
    }))
    setMedia(prev => [...newMedia, ...prev])
  }

  const handleDelete = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id))
  }

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

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {filteredMedia.length} {translations.mediaAssets}
          </p>
          <div className="flex rounded-full bg-secondary p-0.5">
            {["all", "image", "video"].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-3 py-1 text-xs rounded-full transition-colors",
                  filterType === type 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {type === "all" ? translations.all : type === "image" ? translations.images : translations.videos}
              </button>
            ))}
          </div>
        </div>
        <UploadMediaDialog
          translations={translations}
          tagSuggestions={mediaTagSuggestions}
          onUpload={handleUpload}
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-secondary/50 overflow-hidden flex flex-col group"
          >
            {/* File preview placeholder */}
            <div className="h-40 bg-secondary flex items-center justify-center relative">
              {item.type === "image" ? (
                <ImageIcon className="size-10 text-muted-foreground/40" />
              ) : (
                <Video className="size-10 text-muted-foreground/40" />
              )}
              <Badge 
                variant="secondary" 
                className="absolute top-2 left-2 text-xs"
              >
                {item.type === "image" ? translations.image : translations.video}
              </Badge>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground truncate">
                  {item.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100"
                  aria-label="Delete media"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{item.caption}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{item.tags.length - 3}</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                <span className="tabular-nums">{item.uploadedAt}</span>
                {item.size && <span>{item.size}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="rounded-2xl bg-secondary/50 p-10 text-center text-sm text-muted-foreground mt-4">
          {translations.noMedia}
        </div>
      )}
    </SectionWrapper>
  )
}

interface FileUploadData {
  name: string
  type: "image" | "video"
  caption: string
  tags: string[]
  size: string
  previewUrl?: string
}

function UploadMediaDialog({
  translations,
  tagSuggestions,
  onUpload,
}: {
  translations: Record<string, string>
  tagSuggestions: string[]
  onUpload: (files: FileUploadData[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [captions, setCaptions] = useState<Record<string, string>>({})
  const [tags, setTags] = useState<string[]>([])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files).filter(
      f => f.type.startsWith("image/") || f.type.startsWith("video/")
    )
    setSelectedFiles(prev => [...prev, ...files])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(
        f => f.type.startsWith("image/") || f.type.startsWith("video/")
      )
      setSelectedFiles(prev => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const handleUpload = () => {
    const uploadData: FileUploadData[] = selectedFiles.map(f => ({
      name: f.name,
      type: f.type.startsWith("image/") ? "image" : "video",
      caption: captions[f.name] || "",
      tags,
      size: formatFileSize(f.size),
      previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }))
    onUpload(uploadData)
    resetForm()
    setOpen(false)
  }

  const resetForm = () => {
    setSelectedFiles([])
    setCaptions({})
    setTags([])
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full text-xs gap-1.5">
          <Upload className="size-3.5" />
          {translations.uploadMedia}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle>{translations.uploadTitle}</DialogTitle>
        </DialogHeader>
        
        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
            dragActive 
              ? "border-foreground bg-secondary/50" 
              : "border-border hover:border-muted-foreground"
          )}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Upload className="size-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            {dragActive ? translations.dragActive : translations.uploadDesc}
          </p>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-col gap-3">
            <Label className="text-sm font-medium">{translations.selectedFiles}</Label>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                  {file.type.startsWith("image/") ? (
                    <FileImage className="size-4 text-muted-foreground shrink-0" />
                  ) : (
                    <FileVideo className="size-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Caption for first file (applies to all if batch) */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.caption}</Label>
            <Textarea
              value={captions[selectedFiles[0]?.name] || ""}
              onChange={(e) => setCaptions(prev => ({ ...prev, [selectedFiles[0]?.name]: e.target.value }))}
              placeholder={translations.captionPlaceholder}
              rows={2}
              className="rounded-xl resize-none"
            />
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm">{translations.tags}</Label>
          <SimpleTagInput
            value={tags}
            onChange={setTags}
            suggestions={tagSuggestions}
            placeholder={translations.addTags}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">
            {translations.cancel}
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={selectedFiles.length === 0} 
            className="rounded-full"
          >
            {translations.upload}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
