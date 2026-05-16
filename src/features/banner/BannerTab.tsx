'use client'

import { motion } from 'framer-motion'
import { RefreshCw, Layers, Palette } from 'lucide-react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { BannerContent } from '@/types'

function BannerPreview({ banner }: { banner: BannerContent }) {
  const primaryColor = banner.colorPalette?.[0] || '#1a56db'
  const secondaryColor = banner.colorPalette?.[1] || '#0d9488'
  const accentColor = banner.colorPalette?.[2] || '#f59e0b'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-2xl overflow-hidden aspect-[16/6] shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-20"
        style={{ background: accentColor }}
      />
      <div
        className="absolute right-20 bottom-0 w-32 h-32 rounded-full opacity-10"
        style={{ background: primaryColor }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-8">
        <p className="text-white/70 text-xs font-medium tracking-widest uppercase mb-1">
          Campaign Banner
        </p>
        <h2 className="text-white font-bold text-2xl md:text-3xl leading-tight mb-2">
          {banner.headline}
        </h2>
        <p className="text-white/80 text-sm mb-4 max-w-md">{banner.subtext}</p>
        <div
          className="inline-flex self-start items-center px-4 py-2 rounded-full text-sm font-semibold"
          style={{ background: accentColor, color: '#1a1a1a' }}
        >
          {banner.cta}
        </div>
      </div>
    </motion.div>
  )
}

interface BannerTabProps {
  projectId: string
}

export function BannerTab({ projectId }: BannerTabProps) {
  const { bannerContent, isGenerating, generateBanner } = useWorkspaceStore()

  if (isGenerating) {
    return (
      <div className="space-y-4">
        <div className="aspect-[16/6] bg-gray-100 rounded-2xl shimmer" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-gray-100 rounded-xl shimmer" />
          <div className="h-32 bg-gray-100 rounded-xl shimmer" />
        </div>
      </div>
    )
  }

  if (!bannerContent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
          <Layers className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium">No banner generated yet</p>
        <p className="text-xs mt-1">Fill in campaign details and click Generate</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Banner Preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Banner Preview</h3>
          <button
            onClick={() => generateBanner(projectId)}
            disabled={isGenerating}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:border-gray-300 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Regenerate
          </button>
        </div>
        <BannerPreview banner={bannerContent} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Concept */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Concept</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{bannerContent.concept}</p>
          <div className="mt-3 pt-3 border-t border-gray-50">
            <p className="text-xs font-medium text-gray-400 mb-1">Layout</p>
            <p className="text-xs text-gray-600">{bannerContent.layout}</p>
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-teal-50 rounded-lg flex items-center justify-center">
              <Palette className="w-3.5 h-3.5 text-teal-500" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Color Palette</span>
          </div>
          <div className="flex gap-2">
            {bannerContent.colorPalette?.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-xl shadow-sm border border-black/5"
                  style={{ background: color }}
                />
                <span className="text-[10px] text-gray-500 font-mono">{color}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-50">
            <p className="text-xs font-medium text-gray-400 mb-1">CTA Text</p>
            <p className="text-sm font-semibold text-blue-600">{bannerContent.cta}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
