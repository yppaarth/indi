'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Trash2, Filter, ImageIcon, Compass } from 'lucide-react'
import { toast } from 'sonner'
import { Navbar } from '@/components/layout/Navbar'
import { assetsDB } from '@/services/assetsDB'
import { projectsService } from '@/services/storage'
import { GeneratedAsset, AssetType } from '@/types'
import { format } from 'date-fns'

const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  image: 'AI Image',
  banner: 'Banner',
  'edited-image': 'Edited Image',
}

export default function ExplorePage() {
  const [assets, setAssets] = useState<GeneratedAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterProject, setFilterProject] = useState('all')
  const [filterType, setFilterType] = useState<AssetType | 'all'>('all')
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const loadData = async () => {
      const [allAssets, allProjects] = await Promise.all([
        assetsDB.getAll(),
        Promise.resolve(projectsService.getAll()),
      ])
      setAssets(allAssets)
      setProjects(allProjects.map((p) => ({ id: p.id, name: p.name })))
      setIsLoading(false)
    }
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    await assetsDB.delete(id)
    setAssets((prev) => prev.filter((a) => a.id !== id))
    toast.success('Asset deleted')
  }

  const handleDownload = (asset: GeneratedAsset) => {
    const link = document.createElement('a')
    link.href = asset.url
    link.download = `${asset.type}-${asset.id}.png`
    link.target = '_blank'
    link.click()
  }

  const filtered = assets.filter((a) => {
    const projectMatch = filterProject === 'all' || a.projectId === filterProject
    const typeMatch = filterType === 'all' || a.type === filterType
    return projectMatch && typeMatch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Explore
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              All generated assets across your projects
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-1.5">
              {filtered.length} assets
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Filter by:</span>
          </div>

          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as AssetType | 'all')}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Types</option>
            <option value="image">AI Images</option>
            <option value="banner">Banners</option>
            <option value="edited-image">Edited Images</option>
          </select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-2xl shimmer"
                style={{ height: `${120 + (i % 3) * 80}px` }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">No assets found</h3>
            <p className="text-sm">
              {assets.length === 0
                ? 'Generate images in your projects to see them here'
                : 'No assets match the selected filters'}
            </p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 md:columns-4 gap-4">
            {filtered.map((asset, i) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="break-inside-avoid mb-4 group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={asset.url}
                    alt={asset.name || asset.type}
                    className="w-full object-cover"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDownload(asset)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-800" />
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {ASSET_TYPE_LABELS[asset.type]}
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(asset.createdAt), 'dd MMM')}
                    </span>
                  </div>
                  {asset.projectName && (
                    <p className="text-xs text-gray-500 mt-1.5 truncate">{asset.projectName}</p>
                  )}
                  {asset.prompt && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {asset.prompt}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
