'use client'

import { Loader2, Sparkles } from 'lucide-react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { CampaignType, WorkspaceTab } from '@/types'
import { CAMPAIGN_TYPE_LABELS } from '@/lib/utils'
import { toast } from 'sonner'

const CAMPAIGN_TYPES: CampaignType[] = [
  'product-launch',
  'festival-offer',
  'brand-awareness',
  'social-engagement',
  'recruitment',
  'event-promotion',
  'seasonal-sale',
]

interface CampaignSidebarProps {
  projectId: string
  projectName: string
}

export function CampaignSidebar({ projectId, projectName }: CampaignSidebarProps) {
  const {
    campaignType,
    campaignDescription,
    isGenerating,
    activeTab,
    setCampaignType,
    setCampaignDescription,
    generateSocial,
    generateCopy,
    generateBanner,
  } = useWorkspaceStore()

  const handleGenerate = async () => {
    if (!campaignType) {
      toast.error('Please select a campaign type')
      return
    }
    if (!campaignDescription.trim()) {
      toast.error('Please describe your campaign')
      return
    }

    switch (activeTab) {
      case 'social':
        await generateSocial(projectId)
        break
      case 'copywriting':
        await generateCopy(projectId)
        break
      case 'banner':
        await generateBanner(projectId)
        break
      default:
        toast.info('Use the Generate button in the tab above')
        return
    }
    toast.success('Content generated!')
  }

  return (
    <aside className="w-72 shrink-0 bg-white border border-gray-100 rounded-2xl p-5 h-fit">
      <h2 className="text-sm font-bold text-gray-800 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
        Campaign Details
      </h2>

      <div className="space-y-4">
        {/* Campaign Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Campaign Type <span className="text-red-500">*</span>
          </label>
          <select
            value={campaignType}
            onChange={(e) => setCampaignType(e.target.value as CampaignType | '')}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
          >
            <option value="">Select campaign type...</option>
            {CAMPAIGN_TYPES.map((type) => (
              <option key={type} value={type}>
                {CAMPAIGN_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        {/* Campaign Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Describe your campaign <span className="text-red-500">*</span>
          </label>
          <textarea
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
            placeholder={`e.g. I want to launch a new summer collection for my sustainable fashion brand 'EcoStyle'. The goal is to drive sales among millennials. The tone should be fun, energetic, and youthful. Key message: Look good while saving the planet, 20% off all weekend.`}
            rows={8}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-relaxed"
          />
        </div>

        {/* Generate Button */}
        {activeTab !== 'image-edit' && activeTab !== 'image-gen' && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !campaignType || !campaignDescription.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
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
        )}
      </div>
    </aside>
  )
}
