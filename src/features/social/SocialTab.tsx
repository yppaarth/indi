'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RefreshCw, Instagram, Linkedin, Facebook, Twitter, Check } from 'lucide-react'
import { toast } from 'sonner'
import { SocialContent } from '@/types'
import { useWorkspaceStore } from '@/store/workspaceStore'

const PLATFORM_CONFIG = {
  instagram: {
    label: 'Instagram',
    Icon: Instagram,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    gradient: 'from-pink-500 to-purple-500',
  },
  linkedin: {
    label: 'LinkedIn',
    Icon: Linkedin,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    gradient: 'from-blue-600 to-blue-800',
  },
  facebook: {
    label: 'Facebook',
    Icon: Facebook,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    gradient: 'from-blue-500 to-blue-700',
  },
  twitter: {
    label: 'X / Twitter',
    Icon: Twitter,
    color: 'text-gray-800',
    bg: 'bg-gray-50',
    border: 'border-gray-100',
    gradient: 'from-gray-700 to-gray-900',
  },
}

interface SocialCardProps {
  content: SocialContent
  projectId: string
}

function SocialCard({ content, projectId }: SocialCardProps) {
  const [copied, setCopied] = useState(false)
  const { generateSocial, isGenerating } = useWorkspaceStore()
  const config = PLATFORM_CONFIG[content.platform]

  const fullText = `${content.caption}\n\n${content.cta}\n\n${content.hashtags.map((h) => `#${h}`).join(' ')}`

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border ${config.border} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Header */}
      <div className={`${config.bg} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center`}>
            <config.Icon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm text-gray-800">{config.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/70 text-gray-500 hover:text-gray-700 transition-colors"
            title="Copy"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => generateSocial(projectId)}
            disabled={isGenerating}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/70 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            title="Regenerate"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Caption</p>
          <p className="text-sm text-gray-700 leading-relaxed">{content.caption}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">CTA</p>
          <p className="text-sm font-semibold text-blue-600">{content.cta}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Hashtags</p>
          <div className="flex flex-wrap gap-1.5">
            {content.hashtags.map((tag) => (
              <span
                key={tag}
                className={`text-xs px-2 py-0.5 ${config.bg} ${config.color} rounded-full font-medium`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface SocialTabProps {
  projectId: string
}

export function SocialTab({ projectId }: SocialTabProps) {
  const { socialContent, isGenerating } = useWorkspaceStore()

  if (isGenerating) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-2xl shimmer" />
        ))}
      </div>
    )
  }

  if (socialContent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
          <Instagram className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium">No content generated yet</p>
        <p className="text-xs mt-1">Fill in campaign details and click Generate</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {socialContent.map((item, i) => (
        <SocialCard key={i} content={item} projectId={projectId} />
      ))}
    </div>
  )
}
