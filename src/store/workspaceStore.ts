import { create } from 'zustand'
import {
  CampaignType,
  SocialContent,
  CopyContent,
  BannerContent,
  WorkspaceTab,
  GeneratedAsset,
} from '@/types'
import { campaignsService } from '@/services/storage'
import { assetsDB } from '@/services/assetsDB'
import { v4 as uuidv4 } from 'uuid'

interface WorkspaceState {
  activeTab: WorkspaceTab
  campaignType: CampaignType | ''
  campaignDescription: string
  isGenerating: boolean
  error: string | null

  // Generated content
  socialContent: SocialContent[]
  copyContent: CopyContent[]
  bannerContent: BannerContent | null
  generatedImages: GeneratedAsset[]
  imagePrompt: string

  // Actions
  setActiveTab: (tab: WorkspaceTab) => void
  setCampaignType: (type: CampaignType | '') => void
  setCampaignDescription: (desc: string) => void
  setImagePrompt: (prompt: string) => void

  generateSocial: (projectId: string) => Promise<void>
  generateCopy: (projectId: string) => Promise<void>
  generateBanner: (projectId: string) => Promise<void>
  generateImage: (projectId: string, projectName: string) => Promise<void>

  saveImageAsset: (asset: GeneratedAsset) => Promise<void>
  loadImages: (projectId: string) => Promise<void>

  saveCampaign: (projectId: string) => void
  loadCampaign: (projectId: string) => void
  reset: () => void
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  activeTab: 'social',
  campaignType: '',
  campaignDescription: '',
  isGenerating: false,
  error: null,
  socialContent: [],
  copyContent: [],
  bannerContent: null,
  generatedImages: [],
  imagePrompt: '',

  setActiveTab: (tab) => set({ activeTab: tab }),
  setCampaignType: (type) => set({ campaignType: type }),
  setCampaignDescription: (desc) => set({ campaignDescription: desc }),
  setImagePrompt: (prompt) => set({ imagePrompt: prompt }),

  async generateSocial(projectId) {
    const { campaignType, campaignDescription } = get()
    if (!campaignType || !campaignDescription) return
    set({ isGenerating: true, error: null })
    try {
      const res = await fetch('/api/generate/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignType, campaignDescription }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      set({ socialContent: data.content })
      get().saveCampaign(projectId)
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to generate' })
    } finally {
      set({ isGenerating: false })
    }
  },

  async generateCopy(projectId) {
    const { campaignType, campaignDescription } = get()
    if (!campaignType || !campaignDescription) return
    set({ isGenerating: true, error: null })
    try {
      const res = await fetch('/api/generate/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignType, campaignDescription }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      set({ copyContent: data.content })
      get().saveCampaign(projectId)
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to generate' })
    } finally {
      set({ isGenerating: false })
    }
  },

  async generateBanner(projectId) {
    const { campaignType, campaignDescription } = get()
    if (!campaignType || !campaignDescription) return
    set({ isGenerating: true, error: null })
    try {
      const res = await fetch('/api/generate/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignType, campaignDescription }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      set({ bannerContent: data.content })
      get().saveCampaign(projectId)
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to generate' })
    } finally {
      set({ isGenerating: false })
    }
  },

  async generateImage(projectId, projectName) {
    const { imagePrompt } = get()
    if (!imagePrompt) return
    set({ isGenerating: true, error: null })
    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      })
      if (!res.ok) throw new Error('Image generation failed')
      const data = await res.json()
      const asset: GeneratedAsset = {
        id: uuidv4(),
        projectId,
        projectName,
        type: 'image',
        url: data.url,
        prompt: imagePrompt,
        createdAt: new Date().toISOString(),
        name: imagePrompt.slice(0, 40),
      }
      await assetsDB.save(asset)
      set((state) => ({ generatedImages: [asset, ...state.generatedImages] }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to generate image' })
    } finally {
      set({ isGenerating: false })
    }
  },

  async saveImageAsset(asset) {
    await assetsDB.save(asset)
    set((state) => ({ generatedImages: [asset, ...state.generatedImages] }))
  },

  async loadImages(projectId) {
    const images = await assetsDB.getByProjectId(projectId)
    set({ generatedImages: images.filter((a) => a.type === 'image' || a.type === 'edited-image') })
  },

  saveCampaign(projectId) {
    const { campaignType, campaignDescription } = get()
    if (!campaignType) return
    campaignsService.save({
      id: uuidv4(),
      projectId,
      type: campaignType,
      description: campaignDescription,
      createdAt: new Date().toISOString(),
    })
  },

  loadCampaign(projectId) {
    const campaign = campaignsService.getByProjectId(projectId)
    if (campaign) {
      set({
        campaignType: campaign.type,
        campaignDescription: campaign.description,
      })
    }
  },

  reset() {
    set({
      activeTab: 'social',
      campaignType: '',
      campaignDescription: '',
      isGenerating: false,
      error: null,
      socialContent: [],
      copyContent: [],
      bannerContent: null,
      generatedImages: [],
      imagePrompt: '',
    })
  },
}))
