import { defineStore } from 'pinia'
import { DEFAULT_PLAN_PAYLOAD } from '@/shared/api/plan'
import { DEFAULT_PARAMETER_PAYLOAD } from '@/shared/api/parameter'

const STORAGE_KEY = 'report-data-sources'

const defaultSources = [
  {
    id: 'source-plans',
    name: 'Планы (loadPlan)',
    description: 'Загрузка планов из /dtj/api/plan',
    url: '/dtj/api/plan',
    httpMethod: 'POST',
    rawBody: JSON.stringify(
      {
        method: 'data/loadPlan',
        params: [DEFAULT_PLAN_PAYLOAD],
      },
      null,
      2,
    ),
    headers: { 'Content-Type': 'application/json' },
    supportsPivot: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'source-parameters',
    name: 'Параметры (loadParameterLog)',
    description: 'Параметры инспекций из /dtj/api/inspections',
    url: '/dtj/api/inspections',
    httpMethod: 'POST',
    rawBody: JSON.stringify(
      {
        method: 'data/loadParameterLog',
        params: [DEFAULT_PARAMETER_PAYLOAD],
      },
      null,
      2,
    ),
    headers: { 'Content-Type': 'application/json' },
    supportsPivot: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

function loadSources() {
  if (typeof window === 'undefined') return structuredClone(defaultSources)
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch (err) {
    console.warn('Failed to load data sources', err)
  }
  return structuredClone(defaultSources)
}

function persistSources(list) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function createId(prefix = 'source') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const useDataSourcesStore = defineStore('dataSources', {
  state: () => ({
    sources: loadSources(),
  }),
  getters: {
    getById: (state) => (id) => state.sources.find((source) => source.id === id),
  },
  actions: {
    saveSource(payload) {
      const base = structuredClone(payload)
      base.id = base.id || createId()
      base.name = base.name?.trim() || 'Без названия'
      base.url = base.url?.trim() || ''
      base.httpMethod = base.httpMethod?.toUpperCase?.() || 'POST'
      base.rawBody = base.rawBody || ''
      base.headers = base.headers || { 'Content-Type': 'application/json' }
      base.supportsPivot = payload.supportsPivot !== false
      base.updatedAt = new Date().toISOString()
      if (!base.createdAt) {
        base.createdAt = base.updatedAt
      }

      const index = this.sources.findIndex((item) => item.id === base.id)
      if (index >= 0) {
        this.sources.splice(index, 1, base)
      } else {
        this.sources.push(base)
      }
      persistSources(this.sources)
      return base.id
    },
    removeSource(sourceId) {
      const index = this.sources.findIndex((item) => item.id === sourceId)
      if (index === -1) return
      this.sources.splice(index, 1)
      persistSources(this.sources)
    },
  },
})
