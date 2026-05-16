'use client'

import { Share2, PenLine, Layers, Edit2, ImageIcon } from 'lucide-react'
import { WorkspaceTab } from '@/types'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { cn } from '@/lib/utils'

const TABS: { id: WorkspaceTab; label: string; Icon: React.ElementType }[] = [
  { id: 'social', label: 'Social', Icon: Share2 },
  { id: 'copywriting', label: 'Copywriting', Icon: PenLine },
  { id: 'banner', label: 'Banner', Icon: Layers },
  { id: 'image-edit', label: 'Image Edit', Icon: Edit2 },
  { id: 'image-gen', label: 'Image Gen', Icon: ImageIcon },
]

export function WorkspaceTabBar() {
  const { activeTab, setActiveTab } = useWorkspaceStore()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all',
            activeTab === id
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-800'
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </button>
      ))}
    </div>
  )
}
