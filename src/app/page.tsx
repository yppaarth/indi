'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { ProjectCard, NewProjectCard } from '@/components/dashboard/ProjectCard'
import { NewProjectModal } from '@/components/dashboard/NewProjectModal'
import { useProjectsStore } from '@/store/projectsStore'

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { projects, isLoaded, loadProjects, setSearchQuery, filteredProjects, searchQuery } =
    useProjectsStore()

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const displayed = filteredProjects()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Projects
            </h1>
            {isLoaded && (
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">{projects.length}</span> Your Projects
                </span>
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">100</span> Creatives by You
                </span>
                <span className="text-sm text-gray-500">
                  Your Spend:{' '}
                  <span className="font-semibold text-gray-700">₹1503.40</span>
                </span>
              </div>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            New Project
          </motion.button>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative mb-6 max-w-xs"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </motion.div>

        {/* Projects Grid */}
        {!isLoaded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-2xl border border-gray-100 shimmer"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {displayed.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
            {!searchQuery && (
              <NewProjectCard
                onClick={() => setModalOpen(true)}
                index={displayed.length}
              />
            )}
            {searchQuery && displayed.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                <p className="text-sm">No projects found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}
          </div>
        )}
      </main>

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
