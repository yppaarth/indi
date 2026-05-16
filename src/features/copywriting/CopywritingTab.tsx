'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RefreshCw, PenLine, Check } from 'lucide-react'
import { toast } from 'sonner'
import { CopyContent } from '@/types'
import { useWorkspaceStore } from '@/store/workspaceStore'

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  headline: { label: 'Headline', color: 'text-purple-600', bg: 'bg-purple-50' },
  'ad-copy': { label: 'Ad Copy', color: 'text-blue-600', bg: 'bg-blue-50' },
  slogan: { label: 'Slogan', color: 'text-teal-600', bg: 'bg-teal-50' },
  tagline: { label: 'Tagline', color: 'text-amber-600', bg: 'bg-amber-50' },
  'email-snippet': { label: 'Email Snippet', color: 'text-rose-600', bg: 'bg-rose-50' },
}

interface CopyCardProps {
  content: CopyContent
  projectId: string
}

function CopyCard({ content, projectId }: CopyCardProps) {
  const [copied, setCopied] = useState(false)
  const { generateCopy, isGenerating } = useWorkspaceStore()
  const config = TYPE_CONFIG[content.type] || { label: content.type, color: 'text-gray-600', bg: 'bg-gray-50' }

  const handleCopy = () => {
    navigator.clipboard.writeText(content.content)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}>
          {config.label}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => generateCopy(projectId)}
            disabled={isGenerating}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      <h3 className="font-semibold text-gray-700 text-xs mb-1.5">{content.title}</h3>
      <p className="text-gray-800 text-sm leading-relaxed font-medium">{content.content}</p>
    </motion.div>
  )
}

interface CopyTabProps {
  projectId: string
}

export function CopywritingTab({ projectId }: CopyTabProps) {
  const { copyContent, isGenerating } = useWorkspaceStore()

  if (isGenerating) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-2xl shimmer" />
        ))}
      </div>
    )
  }

  if (copyContent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
          <PenLine className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium">No copy generated yet</p>
        <p className="text-xs mt-1">Fill in campaign details and click Generate</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {copyContent.map((item, i) => (
        <CopyCard key={i} content={item} projectId={projectId} />
      ))}
    </div>
  )
}
