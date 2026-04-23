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
import { SimpleTagInput } from "@/components/seller/simple-tag-input"
import { Plus, Trash2, ArrowLeft, Edit2, Calendar, Eye } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface NohiPost {
  id: string
  title: string
  content: string
  tags: string[]
  image?: string
  publishedAt: string
  scheduledAt?: string
  status: "published" | "draft" | "scheduled"
}

const initialPosts: NohiPost[] = [
  {
    id: "1",
    title: "Spring Collection 2026",
    content: "Introducing our new sustainable spring line. Each piece is crafted from organic cotton and recycled materials, designed for everyday versatility.",
    tags: ["Spring", "Sustainable", "New Arrival"],
    publishedAt: "2026-02-10",
    status: "published",
  },
  {
    id: "2",
    title: "Behind the Design: Minimal Essentials",
    content: "A look at how we design our bestselling essentials collection, from concept sketches to final production.",
    tags: ["Behind the Scenes", "Design"],
    publishedAt: "2026-02-15",
    status: "published",
  },
  {
    id: "3",
    title: "Summer Preview",
    content: "Sneak peek at our upcoming summer range, featuring breathable fabrics and resort-ready silhouettes.",
    tags: ["Summer", "Preview"],
    publishedAt: "2026-03-01",
    scheduledAt: "2026-04-01",
    status: "scheduled",
  },
]

const postTagSuggestions = [
  "New Arrival", "Sale", "Sustainable", "Behind the Scenes",
  "Spring", "Summer", "Fall", "Winter", "Campaign",
  "Design", "Preview", "Collaboration", "Limited Edition",
]

export default function PostsPage() {
  const { t, language } = useLanguage()
  const [posts, setPosts] = useState(initialPosts)
  const [editingPost, setEditingPost] = useState<NohiPost | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const translations = {
    title: language === "zh" ? "Nohi 帖子" : "Nohi Posts",
    subtitle: language === "zh" ? "创建和管理帮助 Agent 理解您品牌的帖子内容。" : "Create and manage posts that help agents understand your brand.",
    back: language === "zh" ? "返回" : "Back",
    newPost: language === "zh" ? "新建帖子" : "New Post",
    postsTotal: language === "zh" ? "篇帖子" : "posts",
    noPosts: language === "zh" ? "暂无帖子。创建第一篇帖子来吸引 Agent。" : "No posts yet. Create your first post to engage agents.",
    published: language === "zh" ? "已发布" : "Published",
    scheduled: language === "zh" ? "已计划" : "Scheduled",
    draft: language === "zh" ? "草稿" : "Draft",
    all: language === "zh" ? "全部" : "All",
    filterBy: language === "zh" ? "筛选" : "Filter",
    createPost: language === "zh" ? "创建帖子" : "Create Post",
    editPost: language === "zh" ? "编辑帖子" : "Edit Post",
    createPostDesc: language === "zh" ? "帖子帮助 Agent 理解您的品牌并向购物者展示内容。" : "Posts help agents understand your brand and surface content to shoppers.",
    postTitle: language === "zh" ? "标题" : "Title",
    postTitlePlaceholder: language === "zh" ? "帖子标题..." : "Post title...",
    postContent: language === "zh" ? "内容" : "Content",
    postContentPlaceholder: language === "zh" ? "撰写帖子内容..." : "Write your post content...",
    imageUrl: language === "zh" ? "图片URL（可选）" : "Image URL (optional)",
    tags: language === "zh" ? "标签" : "Tags",
    addTags: language === "zh" ? "添加标签..." : "Add tags...",
    status: language === "zh" ? "状态" : "Status",
    scheduledDate: language === "zh" ? "计划发布日期" : "Scheduled Date",
    create: language === "zh" ? "创建" : "Create",
    save: language === "zh" ? "保存" : "Save",
    cancel: language === "zh" ? "取消" : "Cancel",
    preview: language === "zh" ? "预览" : "Preview",
    edit: language === "zh" ? "编辑" : "Edit",
    delete: language === "zh" ? "删除" : "Delete",
  }

  const getStatusText = (status: NohiPost["status"]) => {
    switch (status) {
      case "published": return translations.published
      case "scheduled": return translations.scheduled
      case "draft": return translations.draft
      default: return status
    }
  }

  const filteredPosts = filterStatus === "all" 
    ? posts 
    : posts.filter(p => p.status === filterStatus)

  const handleCreatePost = (post: Omit<NohiPost, "id" | "publishedAt">) => {
    setPosts(prev => [{
      ...post,
      id: String(Date.now()),
      publishedAt: new Date().toISOString().slice(0, 10),
    }, ...prev])
  }

  const handleEditPost = (post: NohiPost) => {
    setPosts(prev => prev.map(p => p.id === post.id ? post : p))
    setEditingPost(null)
  }

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id))
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
            {filteredPosts.length} {translations.postsTotal}
          </p>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 h-8 text-xs rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{translations.all}</SelectItem>
              <SelectItem value="published">{translations.published}</SelectItem>
              <SelectItem value="scheduled">{translations.scheduled}</SelectItem>
              <SelectItem value="draft">{translations.draft}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CreatePostDialog
          translations={translations}
          tagSuggestions={postTagSuggestions}
          onSubmit={handleCreatePost}
        />
      </div>

      {/* Posts List */}
      <div className="flex flex-col rounded-2xl divide-y divide-secondary bg-secondary/50 overflow-hidden mt-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {post.title}
                  </h3>
                  <PostStatusBadge status={post.status} statusText={getStatusText(post.status)} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {post.content}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setEditingPost(post)}
                >
                  <Edit2 className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              <span className="text-xs text-muted-foreground tabular-nums ml-auto">
                {post.status === "scheduled" && post.scheduledAt 
                  ? `${translations.scheduledDate}: ${post.scheduledAt}` 
                  : post.publishedAt}
              </span>
            </div>
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            {translations.noPosts}
          </div>
        )}
      </div>

      {/* Edit Post Dialog */}
      {editingPost && (
        <EditPostDialog
          post={editingPost}
          translations={translations}
          tagSuggestions={postTagSuggestions}
          onSave={handleEditPost}
          onClose={() => setEditingPost(null)}
        />
      )}
    </SectionWrapper>
  )
}

function PostStatusBadge({ status, statusText }: { status: NohiPost["status"]; statusText: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-xs capitalize",
        status === "published" && "bg-foreground/10 text-foreground",
        status === "scheduled" && "bg-blue-500/10 text-blue-600",
        status === "draft" && "bg-secondary text-muted-foreground"
      )}
    >
      {statusText}
    </Badge>
  )
}

function CreatePostDialog({
  translations,
  tagSuggestions,
  onSubmit,
}: {
  translations: Record<string, string>
  tagSuggestions: string[]
  onSubmit: (post: Omit<NohiPost, "id" | "publishedAt">) => void
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [image, setImage] = useState("")
  const [status, setStatus] = useState<NohiPost["status"]>("draft")
  const [scheduledAt, setScheduledAt] = useState("")

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return
    onSubmit({ 
      title, 
      content, 
      tags, 
      image: image || undefined, 
      status,
      scheduledAt: status === "scheduled" ? scheduledAt : undefined,
    })
    resetForm()
    setOpen(false)
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setTags([])
    setImage("")
    setStatus("draft")
    setScheduledAt("")
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full text-xs gap-1.5">
          <Plus className="size-3.5" />
          {translations.newPost}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle>{translations.createPost}</DialogTitle>
          <DialogDescription>{translations.createPostDesc}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.postTitle}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={translations.postTitlePlaceholder}
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.postContent}</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={translations.postContentPlaceholder}
              rows={4}
              className="rounded-xl resize-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.imageUrl}</Label>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.tags}</Label>
            <SimpleTagInput
              value={tags}
              onChange={setTags}
              suggestions={tagSuggestions}
              placeholder={translations.addTags}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">{translations.status}</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as NohiPost["status"])}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{translations.draft}</SelectItem>
                  <SelectItem value="published">{translations.published}</SelectItem>
                  <SelectItem value="scheduled">{translations.scheduled}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === "scheduled" && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">{translations.scheduledDate}</Label>
                <Input
                  type="date"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">
            {translations.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !content.trim()} className="rounded-full">
            {translations.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditPostDialog({
  post,
  translations,
  tagSuggestions,
  onSave,
  onClose,
}: {
  post: NohiPost
  translations: Record<string, string>
  tagSuggestions: string[]
  onSave: (post: NohiPost) => void
  onClose: () => void
}) {
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [tags, setTags] = useState(post.tags)
  const [image, setImage] = useState(post.image || "")
  const [status, setStatus] = useState(post.status)
  const [scheduledAt, setScheduledAt] = useState(post.scheduledAt || "")

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return
    onSave({ 
      ...post,
      title, 
      content, 
      tags, 
      image: image || undefined, 
      status,
      scheduledAt: status === "scheduled" ? scheduledAt : undefined,
    })
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle>{translations.editPost}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.postTitle}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={translations.postTitlePlaceholder}
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.postContent}</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={translations.postContentPlaceholder}
              rows={4}
              className="rounded-xl resize-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.imageUrl}</Label>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">{translations.tags}</Label>
            <SimpleTagInput
              value={tags}
              onChange={setTags}
              suggestions={tagSuggestions}
              placeholder={translations.addTags}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">{translations.status}</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as NohiPost["status"])}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{translations.draft}</SelectItem>
                  <SelectItem value="published">{translations.published}</SelectItem>
                  <SelectItem value="scheduled">{translations.scheduled}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === "scheduled" && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">{translations.scheduledDate}</Label>
                <Input
                  type="date"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-full">
            {translations.cancel}
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || !content.trim()} className="rounded-full">
            {translations.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
