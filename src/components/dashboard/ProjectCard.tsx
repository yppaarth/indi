'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, Folder, Plus } from 'lucide-react'
import { Project } from '@/types'
import { getProjectColorByName } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const router = useRouter()
  const colors = getProjectColorByName(project.name)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => router.push(`/projects/${project.id}`)}
      className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer card-hover group relative overflow-hidden"
    >
      {/* Subtle gradient accent */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] rounded-bl-full bg-blue-500 group-hover:opacity-[0.06] transition-opacity" />

      <div className="flex flex-col gap-3">
        {/* Icon */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors.bg} ${colors.border} border`}
        >
          <Folder className={`w-4.5 h-4.5 ${colors.icon}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
            {project.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {project.description || 'No description provided.'}
          </p>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{format(new Date(project.createdAt), 'd MMM yyyy')}</span>
        </div>
      </div>
    </motion.div>
  )
}

interface NewProjectCardProps {
  onClick: () => void
  index: number
}

export function NewProjectCard({ onClick, index }: NewProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className="border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all group flex flex-col items-center justify-center min-h-[130px] gap-2"
    >
      <div className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
        <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
      <span className="text-sm text-gray-400 group-hover:text-blue-500 font-medium transition-colors">
        New Project
      </span>
    </motion.div>
  )
}
