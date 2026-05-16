# 6E Creative Studio

An AI-powered creative campaign studio built with Next.js 14, TypeScript, and OpenAI APIs. Create projects, generate social media content, write copy, design banners, and generate/edit images — all stored locally.

## ✨ Features

- **Dashboard** — Create and manage projects with real-time search
- **Social Media Generation** — AI-generated content for Instagram, LinkedIn, Facebook, X/Twitter
- **Copywriting** — Headlines, ad copy, slogans, taglines, and email snippets
- **Banner Designer** — AI concepts with live preview and color palettes
- **Image Generation** — DALL-E 3 powered image creation
- **Image Editor** — Fabric.js canvas editor with text, shapes, and export
- **Explore Gallery** — Masonry grid of all generated assets with filters
- **Analytics** — Campaign performance overview

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **State**: Zustand
- **AI**: Azure OpenAI Responses (`gpt-5-mini6`) + DALL-E 3
- **Image Editor**: Fabric.js
- **Storage**: localStorage + IndexedDB
- **UI**: shadcn/ui + Lucide React
- **Notifications**: Sonner

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repo>
cd 6e-creative-studio
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Azure OpenAI Responses configuration:

```
AZURE_OPENAI_RESPONSES_ENDPOINT=https://your-resource.openai.azure.com/openai/responses?api-version=2025-04-01-preview
AZURE_OPENAI_DEPLOYMENT=gpt-5-mini6
AZURE_OPENAI_API_KEY=your-azure-openai-api-key

# Required only for image generation.
OPENAI_API_KEY=sk-your-openai-api-key
```

Text generation uses Azure OpenAI Responses. The image generation route still uses the OpenAI image API.

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/generate/      # OpenAI API routes (server-side)
│   ├── projects/[id]/     # Project workspace
│   ├── explore/           # Asset gallery
│   └── analytics/         # Analytics dashboard
├── components/            # Shared UI components
│   ├── layout/            # Navbar
│   ├── dashboard/         # Project cards, modal
│   └── workspace/         # Sidebar, tab bar
├── features/              # Feature-specific components
│   ├── social/            # Social media tab
│   ├── copywriting/       # Copy tab
│   ├── banner/            # Banner tab
│   ├── imagegen/          # Image generation tab
│   └── imageedit/         # Image editor tab
├── services/              # Data access layer
│   ├── storage.ts         # localStorage service
│   └── assetsDB.ts        # IndexedDB service
├── store/                 # Zustand state stores
│   ├── projectsStore.ts
│   └── workspaceStore.ts
├── types/                 # TypeScript types
└── lib/                   # Utilities
```

## 🔐 API Routes

All AI generation happens server-side to protect your API key:

| Route | Description |
|-------|-------------|
| `POST /api/generate/social` | Generate social media content |
| `POST /api/generate/copy` | Generate marketing copy |
| `POST /api/generate/banner` | Generate banner concepts |
| `POST /api/generate/image` | Generate images with DALL-E 3 |

## 💾 Data Storage

- **Projects & Campaigns** → `localStorage`
- **Generated Images & Edited Assets** → `IndexedDB` (via `idb` library)
- No backend, no database, no authentication required

## ⚠️ Important Note

All AI-generated content must be reviewed and approved by your Marketing team before use in any campaign or external publication.

## 📦 Dependencies

See `package.json` for full list. Key packages:
- `openai` — OpenAI API client
- `fabric` — Canvas image editor
- `zustand` — State management
- `framer-motion` — Animations
- `idb` — IndexedDB wrapper
- `sonner` — Toast notifications
- `date-fns` — Date formatting
