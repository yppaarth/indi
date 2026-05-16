export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  color?: string
}

export interface Campaign {
  id: string
  projectId: string
  type: CampaignType
  description: string
  createdAt: string
}

export type CampaignType =
  | 'product-launch'
  | 'festival-offer'
  | 'brand-awareness'
  | 'social-engagement'
  | 'recruitment'
  | 'event-promotion'
  | 'seasonal-sale'

export interface SocialContent {
  platform: 'instagram' | 'linkedin' | 'facebook' | 'twitter'
  caption: string
  cta: string
  hashtags: string[]
}

export interface CopyContent {
  type: 'headline' | 'ad-copy' | 'slogan' | 'tagline' | 'email-snippet'
  title: string
  content: string
}

export interface BannerContent {
  concept: string
  headline: string
  layout: string
  colorPalette: string[]
  cta: string
  subtext: string
}

export type AssetType = 'image' | 'banner' | 'edited-image'

export interface GeneratedAsset {
  id: string
  projectId: string
  projectName: string
  type: AssetType
  url: string
  prompt?: string
  createdAt: string
  name?: string
}

export interface GenerationState {
  isLoading: boolean
  error: string | null
}

export type WorkspaceTab = 'social' | 'copywriting' | 'banner' | 'image-edit' | 'image-gen'
