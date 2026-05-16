'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Download, Loader2, ImageIcon, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { assetsDB } from '@/services/assetsDB'
import { GeneratedAsset } from '@/types'

interface ImageCardProps {
  asset: GeneratedAsset
  onDelete: (id: string) => void
}

function ImageCard({ asset, onDelete }: ImageCardProps) {
  const handleDownload = async () => {
    const link = document.createElement('a')
    link.href = asset.url
    link.download = `image-${asset.id}.png`
    link.target = '_blank'
    link.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-gray-100 rounded-2xl overflow-hidden aspect-square"
    >
      <img
        src={asset.url}
        alt={asset.prompt || 'Generated image'}
        className="w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          onClick={handleDownload}
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(asset.id)}
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {/* Prompt label */}
      {asset.prompt && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-xs line-clamp-2">{asset.prompt}</p>
        </div>
      )}
    </motion.div>
  )
}

interface ImageGenTabProps {
  projectId: string
  projectName: string
}

export function ImageGenTab({ projectId, projectName }: ImageGenTabProps) {
  const { imagePrompt, setImagePrompt, generateImage, generatedImages, isGenerating, loadImages } =
    useWorkspaceStore()
  const [localImages, setLocalImages] = useState<GeneratedAsset[]>(generatedImages)

  const handleGenerate = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }
    await generateImage(projectId, projectName)
    // Refresh local state
    const images = await assetsDB.getByProjectId(projectId)
    setLocalImages(images)
  }

  const handleDelete = async (id: string) => {
    await assetsDB.delete(id)
    setLocalImages((prev) => prev.filter((img) => img.id !== id))
    toast.success('Image deleted')
  }

  const displayImages = generatedImages.length > 0 ? generatedImages : localImages

  return (
    <div className="space-y-5">
      {/* Prompt Input */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Image Prompt
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="e.g. A festive Diwali celebration with lanterns and fireworks, vibrant colors..."
            className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !imagePrompt.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Powered by DALL-E 3. Images are saved locally and appear in the Explore page.
        </p>
      </div>

      {/* Loading skeleton */}
      {isGenerating && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="aspect-square bg-gray-100 rounded-2xl shimmer" />
        </div>
      )}

      {/* Gallery */}
      {displayImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {displayImages.map((asset) => (
            <ImageCard key={asset.id} asset={asset} onDelete={handleDelete} />
          ))}
        </div>
      ) : !isGenerating ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium">No images generated yet</p>
          <p className="text-xs mt-1">Enter a prompt above to get started</p>
        </div>
      ) : null}
    </div>
  )
}
