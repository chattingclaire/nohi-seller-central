"use client"

import Link from "next/link"
import { SectionWrapper } from "@/components/seller/section-wrapper"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, Image as ImageIcon, Star, Users, 
  ArrowRight, CheckCircle2, Clock
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function PostsUGCPage() {
  const { language } = useLanguage()

  const translations = {
    title: language === "zh" ? "帖子与 UGC 素材" : "Posts & UGC Assets",
    subtitle: language === "zh" ? "管理 Agent 向购物者展示的品牌内容。" : "Manage your brand content that agents surface to shoppers.",
    posts: language === "zh" ? "Nohi 帖子" : "Nohi Posts",
    postsDesc: language === "zh" ? "创建和管理帮助 Agent 理解您品牌的帖子内容。" : "Create posts that help agents understand and represent your brand.",
    media: language === "zh" ? "品牌媒体库" : "Brand Media",
    mediaDesc: language === "zh" ? "上传品牌图片和视频素材供 Agent 展示。" : "Upload brand images and videos for agents to showcase.",
    reviews: language === "zh" ? "认证评价" : "Verified Reviews",
    reviewsDesc: language === "zh" ? "管理客户评价，Agent 可向购物者展示这些内容。" : "Manage customer reviews that agents can surface to shoppers.",
    ugc: language === "zh" ? "UGC 素材" : "UGC Assets",
    ugcDesc: language === "zh" ? "记录和批准用户生成的内容供 Agent 引用。" : "Track and approve user-generated content for agents to reference.",
    manage: language === "zh" ? "管理" : "Manage",
    items: language === "zh" ? "项" : "items",
    published: language === "zh" ? "已发布" : "published",
    approved: language === "zh" ? "已批准" : "approved",
    pending: language === "zh" ? "待审核" : "pending",
  }

  // Mock data counts
  const stats = {
    posts: { total: 3, published: 2 },
    media: { total: 3 },
    reviews: { total: 4 },
    ugc: { total: 4, approved: 2, pending: 2 },
  }

  const sections = [
    {
      href: "/seller/brand-context/posts-ugc/posts",
      icon: FileText,
      title: translations.posts,
      description: translations.postsDesc,
      stats: (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {stats.posts.total} {translations.items}
          </Badge>
          <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
            <CheckCircle2 className="size-3 mr-1" />
            {stats.posts.published} {translations.published}
          </Badge>
        </div>
      ),
    },
    {
      href: "/seller/brand-context/posts-ugc/media",
      icon: ImageIcon,
      title: translations.media,
      description: translations.mediaDesc,
      stats: (
        <Badge variant="secondary" className="text-xs">
          {stats.media.total} {translations.items}
        </Badge>
      ),
    },
    {
      href: "/seller/brand-context/posts-ugc/reviews",
      icon: Star,
      title: translations.reviews,
      description: translations.reviewsDesc,
      stats: (
        <Badge variant="secondary" className="text-xs">
          {stats.reviews.total} {translations.items}
        </Badge>
      ),
    },
    {
      href: "/seller/brand-context/posts-ugc/ugc",
      icon: Users,
      title: translations.ugc,
      description: translations.ugcDesc,
      stats: (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
            <CheckCircle2 className="size-3 mr-1" />
            {stats.ugc.approved} {translations.approved}
          </Badge>
          <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-600">
            <Clock className="size-3 mr-1" />
            {stats.ugc.pending} {translations.pending}
          </Badge>
        </div>
      ),
    },
  ]

  return (
    <SectionWrapper
      title={translations.title}
      subtitle={translations.subtitle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-2xl bg-secondary/50 p-6 flex flex-col gap-4 hover:bg-secondary/80 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="size-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                <section.icon className="size-5 text-foreground" />
              </div>
              <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h3 className="text-base font-medium text-foreground">{section.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-auto pt-2">
              {section.stats}
            </div>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  )
}
