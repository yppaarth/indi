import { Project, Campaign } from '@/types'

const PROJECTS_KEY = '6e_projects'
const CAMPAIGNS_KEY = '6e_campaigns'

export const projectsService = {
  getAll(): Project[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(PROJECTS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },

  getById(id: string): Project | null {
    const projects = this.getAll()
    return projects.find((p) => p.id === id) ?? null
  },

  save(project: Project): void {
    const projects = this.getAll()
    const existing = projects.findIndex((p) => p.id === project.id)
    if (existing >= 0) {
      projects[existing] = { ...project, updatedAt: new Date().toISOString() }
    } else {
      projects.unshift(project)
    }
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
  },

  delete(id: string): void {
    const projects = this.getAll().filter((p) => p.id !== id)
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
  },
}

export const campaignsService = {
  getAll(): Campaign[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(CAMPAIGNS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },

  getByProjectId(projectId: string): Campaign | null {
    const campaigns = this.getAll()
    return campaigns.find((c) => c.projectId === projectId) ?? null
  },

  save(campaign: Campaign): void {
    const campaigns = this.getAll()
    const existing = campaigns.findIndex((c) => c.projectId === campaign.projectId)
    if (existing >= 0) {
      campaigns[existing] = campaign
    } else {
      campaigns.push(campaign)
    }
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns))
  },
}
