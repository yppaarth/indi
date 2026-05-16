import { openDB, IDBPDatabase } from 'idb'
import { GeneratedAsset } from '@/types'

const DB_NAME = '6e_creative_studio'
const DB_VERSION = 1
const ASSETS_STORE = 'assets'

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(ASSETS_STORE)) {
          const store = db.createObjectStore(ASSETS_STORE, { keyPath: 'id' })
          store.createIndex('projectId', 'projectId', { unique: false })
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('createdAt', 'createdAt', { unique: false })
        }
      },
    })
  }
  return dbPromise
}

export const assetsDB = {
  async getAll(): Promise<GeneratedAsset[]> {
    try {
      const db = await getDB()
      const assets = await db.getAll(ASSETS_STORE)
      return assets.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } catch {
      return []
    }
  },

  async getByProjectId(projectId: string): Promise<GeneratedAsset[]> {
    try {
      const db = await getDB()
      const index = db.transaction(ASSETS_STORE).store.index('projectId')
      const assets = await index.getAll(projectId)
      return assets.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } catch {
      return []
    }
  },

  async save(asset: GeneratedAsset): Promise<void> {
    const db = await getDB()
    await db.put(ASSETS_STORE, asset)
  },

  async delete(id: string): Promise<void> {
    const db = await getDB()
    await db.delete(ASSETS_STORE, id)
  },
}
