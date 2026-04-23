"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowLeft, Globe, LogOut, Check } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────
type Step =
  | "login"
  | "account"
  | "verify-send"
  | "verify-enter"
  | "advertiser"
  | "billing"

// ─── Shared Input Class ───────────────────────────────────────────────────────
const inputCls =
  "w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors"

// ─── Primary Button ───────────────────────────────────────────────────────────
const primaryBtn =
  "bg-foreground text-background font-semibold py-3 px-8 rounded-xl text-sm transition-all hover:opacity-80 active:scale-[0.98]"

// ─── Progress Stepper ────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: "account" | "advertiser" | "billing" }) {
  const steps = [
    { id: "account", label: "用户账户", num: 1 },
    { id: "advertiser", label: "商家资料", num: 2 },
    { id: "billing", label: "账单信息", num: 3 },
  ]
  const order = { account: 0, advertiser: 1, billing: 2 }
  const currentIdx = order[current]

  return (
    <div className="flex items-center justify-center gap-0 py-5 border-b border-border bg-background">
      {steps.map((step, idx) => {
        const done = idx < currentIdx
        const active = idx === currentIdx
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`
                  flex items-center justify-center w-7 h-7 rounded-lg border text-sm font-semibold transition-colors
                  ${done ? "border-foreground bg-foreground text-background" : ""}
                  ${active ? "border-foreground bg-background text-foreground" : ""}
                  ${!done && !active ? "border-border bg-background text-muted-foreground" : ""}
                `}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : step.num}
              </div>
              <span
                className={`text-sm font-medium whitespace-nowrap ${
                  active ? "text-foreground" : done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-20 h-px mx-4 ${idx < currentIdx ? "bg-foreground/40" : "bg-border"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Left Panel ───────────────────────────────────────────────────────────────
function LeftPanel({
  title,
  subtitle,
  showLogout = false,
}: {
  title: string
  subtitle: string
  showLogout?: boolean
}) {
  return (
    <div className="w-[300px] min-h-full bg-secondary/60 flex flex-col shrink-0 border-r border-border">
      <div className="flex items-center justify-between px-6 py-5">
        <span className="font-black text-xl tracking-tight text-foreground">Nohi</span>
        <div className="flex items-center gap-2">
          {showLogout && (
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-lg px-3 py-1.5 bg-background hover:bg-secondary transition-colors">
              <LogOut className="w-3 h-3" />
              退出
            </button>
          )}
          <button className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
            <Globe className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="px-6 mt-auto pb-10 pt-16">
        <h2 className="text-lg font-bold text-foreground leading-snug mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
      </div>
      <div className="h-32" />
    </div>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-border py-4 px-8 flex items-center justify-between text-xs text-muted-foreground bg-background">
      <div className="flex items-center gap-4">
        {["销售条款", "Cookie 管理", "隐私政策", "Nohi公司简介", "联系人"].map((item, i, arr) => (
          <span key={item} className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">{item}</Link>
            {i < arr.length - 1 && <span className="text-border">|</span>}
          </span>
        ))}
      </div>
      <span>Copyright &copy; 2026 Nohi. All rights reserved.</span>
    </footer>
  )
}

// ─── Skip Button (test) ───────────────────────────────────────────────────────
function SkipButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 text-xs text-muted-foreground border border-border rounded-xl px-3 py-1.5 bg-background hover:bg-secondary hover:text-foreground shadow-sm transition-colors"
    >
      跳过（测试）
    </button>
  )
}

// ─── Custom Select ────────────────────────────────────────────────────────────
function SelectField({
  label,
  placeholder,
  options,
  value,
  onChange,
  required,
}: {
  label: string
  placeholder: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <div className="relative">
      <label className="block text-sm text-foreground mb-1.5">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between hover:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-colors"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 w-full mt-1 bg-popover border border-border rounded-xl shadow-md overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-secondary ${
                opt.value === value
                  ? "text-foreground font-semibold bg-secondary"
                  : "text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Step 0: Login ────────────────────────────────────────────────────────────
function LoginStep({ onNext, onRegister }: { onNext: () => void; onRegister: () => void }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <span className="font-black text-2xl tracking-tight text-foreground mb-8">Nohi</span>

        <div className="w-full max-w-md border border-border rounded-2xl bg-background px-10 py-10 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">登录</h2>

          <div className="mb-4">
            <label className="block text-sm text-foreground mb-1.5">
              电子邮箱<span className="text-destructive ml-0.5">*</span>
            </label>
            <input type="email" placeholder="mail@company.com" className={inputCls} />
          </div>

          <div className="mb-2">
            <label className="block text-sm text-foreground mb-1.5">
              密码<span className="text-destructive ml-0.5">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
              忘记密码？
            </Link>
          </div>

          <button onClick={onNext} className={`${primaryBtn} w-full mb-4`}>
            登录
          </button>

          <p className="text-center text-sm text-muted-foreground">
            还没有账户？{" "}
            <button type="button" onClick={onRegister} className="text-foreground font-semibold hover:underline underline-offset-2 transition-colors">
              立即注册
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

// ─── Step 1: Account ─────────────────────────────────────────────────────────
function AccountStep({ onNext }: { onNext: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [marketing, setMarketing] = useState(false)

  const checks = [
    { label: "最少8个字符（最多40个）", test: (p: string) => p.length >= 8 && p.length <= 40 },
    { label: "一个小写字母", test: (p: string) => /[a-z]/.test(p) },
    { label: "一个大写字母", test: (p: string) => /[A-Z]/.test(p) },
    { label: "一个特殊字符", test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
    { label: "一个数字", test: (p: string) => /[0-9]/.test(p) },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StepIndicator current="account" />
      <div className="flex flex-1">
        <LeftPanel
          title="开始使用 Nohi!"
          subtitle="创建您的账户即可免费获得全部访问权限，只需点击几下即可启动基于 AI 的商品推荐。"
        />
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 px-14 py-10 max-w-2xl">
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm text-foreground mb-1.5">名字<span className="text-destructive ml-0.5">*</span></label>
                <input type="text" placeholder="Jane" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-foreground mb-1.5">姓氏<span className="text-destructive ml-0.5">*</span></label>
                <input type="text" placeholder="Doe" className={inputCls} />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm text-foreground mb-1.5">电子邮箱<span className="text-destructive ml-0.5">*</span></label>
              <input type="email" placeholder="mail@company.com" className={inputCls} />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-foreground mb-1.5">密码<span className="text-destructive ml-0.5">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-sm text-foreground mb-2">密码要求</p>
              <div className="space-y-1.5">
                {checks.map((c) => {
                  const passed = password.length > 0 && c.test(password)
                  return (
                    <div key={c.label} className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        passed ? "border-foreground bg-foreground" : "border-border bg-background"
                      }`}>
                        {passed && <Check className="w-2.5 h-2.5 text-background" />}
                      </div>
                      <span className="text-sm text-muted-foreground">{c.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                id="marketing"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-0.5 w-4 h-4 border-border rounded accent-foreground"
              />
              <label htmlFor="marketing" className="text-sm text-muted-foreground leading-relaxed">
                本人同意接收来自 Nohi 的有关其产品、服务、活动及新闻的营销信息。本人随时可以取消订阅。
              </label>
            </div>

            <button onClick={onNext} className={`${primaryBtn} w-full`}>
              创建账户
            </button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              已经有账户？{" "}
              <Link href="/register" className="text-foreground font-semibold hover:underline underline-offset-2">
                登录
              </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
              点击"创建账户"即表明本人确认已阅读并理解对本人权利作出规定的{" "}
              <Link href="#" className="text-foreground underline underline-offset-2 hover:opacity-70">Nohi隐私政策</Link>。
              本人可以随时通过发送电子邮件的方式行使本人的权利。
            </p>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

// ─── Step 2: Verify Send ──────────────────────────────────────────────────────
function VerifySendStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md border border-border rounded-2xl bg-background px-10 py-12 text-center shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-3">验证您的电子邮件</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            选择"发送验证码"，以便通过您在上一步中提供的电子邮箱接收验证码。
          </p>
          <button onClick={onNext} className={primaryBtn}>
            发送验证码
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

// ─── Step 3: Verify Enter ─────────────────────────────────────────────────────
function VerifyEnterStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md border border-border rounded-2xl bg-background px-10 py-12 shadow-sm">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          <h2 className="text-lg font-bold text-foreground mb-6 text-center">输入您的验证码</h2>
          <input
            type="text"
            placeholder="输入验证码"
            className={`${inputCls} mb-5`}
          />
          <div className="flex justify-center mb-6">
            <button onClick={onNext} className={primaryBtn}>
              确认
            </button>
          </div>
          <p className="text-center">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
              未收到此封电子邮件？
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

// ─── Step 4: Advertiser Profile ───────────────────────────────────────────────
function AdvertiserStep({ onNext }: { onNext: () => void }) {
  const [country, setCountry] = useState("")
  const [currency, setCurrency] = useState("")
  const [sector, setSector] = useState("")
  const [field, setField] = useState("")
  const [manager, setManager] = useState("")

  const countries = [
    { value: "cn", label: "中国" },
    { value: "us", label: "美国" },
    { value: "uk", label: "英国" },
    { value: "jp", label: "日本" },
  ]
  const currencies = [
    { value: "cny", label: "CNY - 人民币" },
    { value: "usd", label: "USD - 美元" },
    { value: "eur", label: "EUR - 欧元" },
  ]
  const sectors = [
    { value: "retail", label: "零售" },
    { value: "fashion", label: "时尚" },
    { value: "electronics", label: "电子产品" },
    { value: "beauty", label: "美妆" },
  ]
  const fields = [
    { value: "b2c", label: "B2C" },
    { value: "b2b", label: "B2B" },
    { value: "d2c", label: "D2C" },
  ]
  const managers = [
    { value: "self", label: "I will manage this account for my own company" },
    { value: "agency-manages", label: "I am creating my company's account but an agency will manage it" },
    { value: "agency-client", label: "I am an agency creating an account on behalf of my client" },
    { value: "agency-own", label: "I am an agency and I want to create my agency account" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StepIndicator current="advertiser" />
      <div className="flex flex-1">
        <LeftPanel
          title="告诉我们您的业务信息"
          subtitle="这将帮助我们创建您的商家资料，以便根据您所在的行业和地区为您定制使用体验。"
          showLogout
        />
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 px-14 py-10 max-w-2xl">
            <div className="mb-5">
              <label className="block text-sm text-foreground mb-1.5">
                Website URL<span className="text-destructive ml-0.5">*</span>
              </label>
              <input type="url" placeholder="e.g. https://mywebsite.com" className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <SelectField label="Country" placeholder="Select country" options={countries} value={country} onChange={setCountry} required />
              <SelectField label="Currency" placeholder="Select currency" options={currencies} value={currency} onChange={setCurrency} required />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <SelectField label="Professional sector" placeholder="Select sector" options={sectors} value={sector} onChange={setSector} required />
              <SelectField label="Field" placeholder="Select your option" options={fields} value={field} onChange={setField} required />
            </div>

            <div className="mb-8">
              <SelectField
                label="Who will manage this Nohi account?"
                placeholder="Select an option..."
                options={managers}
                value={manager}
                onChange={setManager}
                required
              />
            </div>

            <button onClick={onNext} className={`${primaryBtn} w-full`}>
              Create advertiser profile
            </button>

            <p className="text-center text-xs text-muted-foreground mt-5 leading-relaxed">
              By clicking "Create advertiser profile" I confirm that I have read and accepted the{" "}
              <Link href="#" className="text-foreground underline underline-offset-2 hover:opacity-70">Terms and Conditions</Link>.
              {" "}I guarantee that the information that I have entered is accurate, complete, and up-to-date.
              I accept that Nohi reserves the right to verify any information entered to provide the Nohi services.
            </p>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

// ─── Step 5: Billing ──────────────────────────────────────────────────────────
function BillingStep({ onNext }: { onNext: () => void }) {
  const [country, setCountry] = useState("us")
  const [state, setState] = useState("")

  const countries = [
    { value: "us", label: "United States" },
    { value: "cn", label: "China" },
    { value: "uk", label: "United Kingdom" },
  ]
  const states = [
    { value: "ca", label: "California" },
    { value: "ny", label: "New York" },
    { value: "tx", label: "Texas" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StepIndicator current="billing" />
      <div className="flex flex-1">
        <LeftPanel
          title="Fill in your billing information"
          subtitle="This will help us verify your account faster, so you can launch your first campaign in no time."
          showLogout
        />
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 px-14 py-10 max-w-2xl">
            <div className="mb-5">
              <label className="block text-sm text-foreground mb-1.5">
                Company name<span className="text-destructive ml-0.5">*</span>
              </label>
              <input type="text" placeholder="My company name" className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <SelectField label="Country" placeholder="Select country" options={countries} value={country} onChange={setCountry} required />
              <SelectField label="State" placeholder="All states" options={states} value={state} onChange={setState} required />
            </div>

            <div className="mb-5">
              <label className="block text-sm text-foreground mb-1.5">
                Billing address<span className="text-destructive ml-0.5">*</span>
              </label>
              <input type="text" placeholder="123 street name" className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm text-foreground mb-1.5">Postal code<span className="text-destructive ml-0.5">*</span></label>
                <input type="text" placeholder="00000" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-foreground mb-1.5">City<span className="text-destructive ml-0.5">*</span></label>
                <input type="text" placeholder="City name" className={inputCls} />
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-sm text-foreground mb-1.5">
                Company number<span className="text-destructive ml-0.5">*</span>
              </label>
              <input type="text" className={inputCls} />
            </div>

            <div className="flex justify-center">
              <button onClick={onNext} className={primaryBtn}>
                Start my onboarding
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("login")

  const next: Record<Step, Step | null> = {
    login: "account",
    account: "verify-send",
    "verify-send": "verify-enter",
    "verify-enter": "advertiser",
    advertiser: "billing",
    billing: null,
  }

  const handleNext = () => {
    const n = next[step]
    if (n) setStep(n)
    else router.push("/seller")
  }

  const handleSkip = () => {
    const n = next[step]
    if (n) setStep(n)
    else router.push("/seller")
  }

  const handleRegister = () => setStep("account")
  const showSkip = step !== "login"

  return (
    <>
      {step === "login" && <LoginStep onNext={handleNext} onRegister={handleRegister} />}
      {step === "account" && <AccountStep onNext={handleNext} />}
      {step === "verify-send" && <VerifySendStep onNext={handleNext} />}
      {step === "verify-enter" && (
        <VerifyEnterStep onBack={() => setStep("verify-send")} onNext={handleNext} />
      )}
      {step === "advertiser" && <AdvertiserStep onNext={handleNext} />}
      {step === "billing" && <BillingStep onNext={handleNext} />}
      {showSkip && <SkipButton onClick={handleSkip} />}
    </>
  )
}
