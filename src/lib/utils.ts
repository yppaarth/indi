import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const PROJECT_COLORS = [
  { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-200' },
  { bg: 'bg-teal-50', icon: 'text-teal-500', border: 'border-teal-200' },
  { bg: 'bg-blue-50', icon: 'text-blue-500', border: 'border-blue-200' },
  { bg: 'bg-purple-50', icon: 'text-purple-500', border: 'border-purple-200' },
  { bg: 'bg-rose-50', icon: 'text-rose-500', border: 'border-rose-200' },
  { bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-200' },
]

export function getProjectColor(index: number) {
  return PROJECT_COLORS[index % PROJECT_COLORS.length]
}

export function getProjectColorByName(name: string) {
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return PROJECT_COLORS[index % PROJECT_COLORS.length]
}

export const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  'product-launch': 'Product Launch',
  'festival-offer': 'Festival Offer',
  'brand-awareness': 'Brand Awareness',
  'social-engagement': 'Social Engagement',
  'recruitment': 'Recruitment',
  'event-promotion': 'Event Promotion',
  'seasonal-sale': 'Seasonal Sale',
}
