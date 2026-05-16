import { create } from 'zustand'
import { Project } from '@/types'
import { projectsService } from '@/services/storage'
import { v4 as uuidv4 } from 'uuid'

interface ProjectsState {
  projects: Project[]
  searchQuery: string
  isLoaded: boolean
  loadProjects: () => void
  addProject: (name: string, description: string) => Project
  deleteProject: (id: string) => void
  setSearchQuery: (q: string) => void
  filteredProjects: () => Project[]
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  searchQuery: '',
  isLoaded: false,

  loadProjects() {
    const projects = projectsService.getAll()
    set({ projects, isLoaded: true })
  },

  addProject(name: string, description: string) {
    const project: Project = {
      id: uuidv4(),
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    projectsService.save(project)
    set((state) => ({ projects: [project, ...state.projects] }))
    return project
  },

  deleteProject(id: string) {
    projectsService.delete(id)
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }))
  },

  setSearchQuery(q: string) {
    set({ searchQuery: q })
  },

  filteredProjects() {
    const { projects, searchQuery } = get()
    if (!searchQuery.trim()) return projects
    const q = searchQuery.toLowerCase()
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )
  },
}))
