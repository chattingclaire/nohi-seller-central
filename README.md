# Nohi Seller Central

> [Chinese Version / 中文版](README.zh.md)

> AI-powered seller platform for brand management, agentic catalog, channel control, and analytics.

Built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, and **Radix UI**.

---

## Brand Context — AI-Assisted Brand Setup

The Brand Context module is the core brand configuration hub. Instead of a traditional multi-page form, it uses an **AI-assisted chat + form wizard** pattern — merchants upload brand files on the left, and Nohi auto-fills the structured form on the right.

### Demo

![Brand Context Demo](docs/brand-context/brand-context-demo.gif)

> Onboarding → file upload → auto-fill → step-by-step review

### Architecture

```
┌─────────────────────────────────────────────────────┐
│  Step Bar: Details → Brand Story → Visual Style → … │
├──────────────┬──────────────────────────────────────┤
│  Chat Panel  │         Form Wizard (scrollable)     │
│  (300px)     │         (flex-1)                     │
│              │                                      │
│  Guide Card  │  Step 1: Core Category, AOV,         │
│  or Chat     │          Audience, Scenario, Intent  │
│  Messages    │  Step 2: Brand Story, Founder Note   │
│              │  Step 3: Style Tags, Preview         │
│  ──────────  │  Step 4: Excluded Audiences,         │
│  Input Box   │          Prohibited Scenarios,       │
│  (Claude-    │          Blocked Keywords            │
│   style)     │  Step 5: Processing Time, Return     │
│              │          Policy, Metrics             │
└──────────────┴──────────────────────────────────────┘
```

### Key Features

#### 1. Onboarding Guide Card
When the merchant first lands on the page, a handwriting-style card warmly welcomes them and explains how to use the tool:
- Paste or attach brand files in the input below
- Nohi will read through them and auto-fill all form steps
- Or skip and edit the form directly

![Initial State](docs/brand-context/01-initial-onboarding.png)

#### 2. File Upload — Paste, Attach, or Drop
The Claude-style combined input supports multiple ways to add files:
- **Paste**: `Ctrl/Cmd+V` files directly into the textarea
- **Attach**: Click the paperclip button to open file picker
- **Supported formats**: PDF, PPT, DOC, images (PNG/JPG/SVG), CSV, XLSX, TXT

Files appear as removable chips inside the input area before sending.

![File Chips](docs/brand-context/02-file-chips-pending.png)

#### 3. AI Auto-Fill — All Steps at Once
When files are sent, Nohi parses them and fills **all 5 steps simultaneously**:

| Step | What Gets Filled |
|------|-----------------|
| Details | Core category, AOV tier, purchase type, audience/scenario/intent tags |
| Brand Story | 150-word narrative + founder note |
| Visual Style | Style tags (Minimalist, Scandinavian, etc.) |
| Guardrails | Excluded audiences, prohibited scenarios, blocked keywords |
| Fulfillment | Processing time, on-time rate, return metrics |

> **Principle: Preserve original wording.** Nohi prioritizes the merchant's own language and expressions when filling form fields — brand stories, founder notes, and taglines are extracted as close to the original source material as possible, rather than being rewritten or paraphrased by AI. This ensures the brand voice stays authentic.

The AI response shows a detailed breakdown:
- **Filled sections** with direct links to each step for review
- **Incomplete sections** with suggestions for what additional files to upload

![Auto-Filled](docs/brand-context/03-auto-filled-response.png)

#### 4. Smart Conversation Logic

The chat handles different scenarios intelligently:

| User Action | Nohi Response | Form Effect |
|-------------|--------------|-------------|
| **Upload files (PDF/PPT/IMG...)** | Parses all files, shows detailed breakdown of what was filled vs. what's still missing, suggests additional uploads | Auto-fills ALL 5 steps at once |
| **Text-only (no files yet)** | "Upload brand files and Nohi will auto-fill the form for you. You can also edit the form directly." | No changes to form |
| **Text-only (files already uploaded)** | "Use @ to reference uploaded files, or edit the fields directly on the right." | No changes to form |
| **Type `@` in input** | File picker dropdown appears — click a file to insert `@filename` reference | No changes to form |

**Scenario A: Text-only message without files** — Nohi guides the user to upload files, no form fields are touched:

![Text Only Response](docs/brand-context/08-text-only-no-files.png)

**Scenario B: @ file mention** — After files are uploaded, typing `@` shows a dropdown of all uploaded files to reference in the conversation:

![@ File Mention](docs/brand-context/09-at-mention-file-picker.png)

#### 5. Collapsible File List
After uploading, files appear in a compact collapsible header at the top of the chat panel:
- Shows `"📎 3 files >"` in one line by default — minimal vertical footprint
- **Click to expand** and see individual file names, types, and sizes; click again to collapse
- Files persist across step navigation — always accessible no matter which step you're on

#### 6. Step-by-Step Wizard (Right Panel)
Each step preserves the original form design:
- **TagInput** component with tag clouds, custom tags, and "Generate more" overlay
- **Button selectors** for categories, AOV tiers, purchase types
- **Textareas** with word counts for brand story / founder note
- **Metric inputs** for fulfillment SLA numbers
- **Select dropdowns** for refund time
- Independent scrolling — right panel scrolls separately from left chat

![Brand Story](docs/brand-context/04-brand-story-filled.png)
![Visual Style](docs/brand-context/05-visual-style.png)
![Guardrails](docs/brand-context/06-guardrails.png)
![Fulfillment](docs/brand-context/07-fulfillment.png)

#### 7. Bilingual Support (EN / ZH)
All text — guide cards, placeholders, AI responses, form labels — supports English and Chinese via `useLanguage()` hook. The language auto-detects from user settings.

### Conversation Flow Diagram

```
User lands on Brand Context
         │
         ▼
┌─────────────────────┐
│  Guide Card shown   │
│  "Hey! Welcome..."  │
│  Form is empty      │
└─────────┬───────────┘
          │
    ┌─────┴──────┐
    │            │
    ▼            ▼
 Upload      Type text
 files       (no files)
    │            │
    ▼            ▼
 Nohi parses  Nohi says:
 & fills ALL  "Upload files
 5 steps      and I'll fill
    │          the form"
    ▼            │
 AI response     ▼
 shows:       User can:
 ✓ Filled     - Upload files
 ⚠ Incomplete - Edit form
 → Click to     directly
   review
    │
    ▼
 User reviews each step
 Edits fields as needed
    │
    ▼
 ┌──────────────────┐
 │ Type text with    │
 │ files uploaded:   │
 │ "Use @ to ref     │
 │  files, or edit   │
 │  form directly"   │
 └──────────────────┘
```

### File Structure

```
app/seller/brand-context/
  page.tsx              # Main page — chat + form wizard

components/seller/
  tag-input.tsx         # TagInput with tag cloud + Generate overlay
  simple-tag-input.tsx  # SimpleTagInput with suggestions dropdown
```

### Tech Stack

| Technology | Version | Usage |
|-----------|---------|-------|
| Next.js | 16.2.0 | App Router, Server/Client Components |
| React | 19 | UI rendering |
| Tailwind CSS | 4 | Styling |
| Radix UI | Latest | Select, Collapsible, ScrollArea primitives |
| Lucide React | Latest | Icons |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/seller/brand-context](http://localhost:3000/seller/brand-context) to see the Brand Context page.

---

## Other Modules

- **Agentic Catalog** — AI-powered product catalog management
- **Channel Control** — Multi-channel distribution settings
- **Analytics** — Performance dashboards and reporting

---

Built by the Nohi team.
