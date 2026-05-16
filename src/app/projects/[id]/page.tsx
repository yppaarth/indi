'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { CampaignSidebar } from '@/components/workspace/CampaignSidebar'
import { WorkspaceTabBar } from '@/components/workspace/WorkspaceTabBar'
import { SocialTab } from '@/features/social/SocialTab'
import { CopywritingTab } from '@/features/copywriting/CopywritingTab'
import { BannerTab } from '@/features/banner/BannerTab'
import { ImageGenTab } from '@/features/imagegen/ImageGenTab'
import { ImageEditTab } from '@/features/imageedit/ImageEditTab'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { projectsService } from '@/services/storage'
import { Project } from '@/types'

export default function ProjectWorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { activeTab, loadCampaign, reset } = useWorkspaceStore()

  useEffect(() => {
    const found = projectsService.getById(projectId)
    if (found) {
      setProject(found)
      loadCampaign(projectId)
    } else {
      router.push('/')
    }
    setIsLoading(false)
  }, [projectId, router, loadCampaign])

  useEffect(() => {
    return () => reset()
  }, [reset])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="px-6 py-8 max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 rounded-xl shimmer mb-6" />
          <div className="flex gap-5">
            <div className="w-72 h-96 bg-gray-200 rounded-2xl shimmer" />
            <div className="flex-1 h-96 bg-gray-200 rounded-2xl shimmer" />
          </div>
        </div>
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link href="/" className="flex items-center gap-1 hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Projects
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{project.name}</span>
        </div>

        <div className="mb-5">
          <WorkspaceTabBar />
        </div>

        <div className="flex gap-5 items-start">
          <CampaignSidebar projectId={projectId} projectName={project.name} />

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'social' && <SocialTab projectId={projectId} />}
                {activeTab === 'copywriting' && <CopywritingTab projectId={projectId} />}
                {activeTab === 'banner' && <BannerTab projectId={projectId} />}
                {activeTab === 'image-gen' && (
                  <ImageGenTab projectId={projectId} projectName={project.name} />
                )}
                {activeTab === 'image-edit' && (
                  <ImageEditTab projectId={projectId} projectName={project.name} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}
