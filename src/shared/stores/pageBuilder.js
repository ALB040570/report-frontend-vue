import { defineStore } from 'pinia'
import { fetchReportViewTemplates } from '@/shared/services/reportViews'

const PAGE_STORAGE_KEY = 'page-builder-pages'

const layoutPresets = [
  { value: 'single', label: 'Одна колонка', template: '1fr' },
  { value: 'two-column', label: 'Две колонки', template: '1fr 1fr' },
  { value: 'three-column', label: 'Три колонки', template: '1fr 1fr 1fr' },
]

const filterLibrary = [
  {
    key: 'period',
    label: 'Период',
    placeholder: 'Например: 2025-11',
    bindings: {
      plans: 'PlanDateEnd',
      parameters: 'date',
    },
  },
  {
    key: 'area',
    label: 'Участок / зона',
    placeholder: 'Например: Восточный участок',
    bindings: {
      plans: 'nameLocationClsSection',
      parameters: 'objLocation',
    },
  },
  {
    key: 'object',
    label: 'Объект / ID',
    placeholder: 'Введите название или ID',
    bindings: {
      plans: 'fullNameObject',
      parameters: 'objLocationName',
    },
  },
]

function loadFromStorage(key, fallback = []) {
  if (typeof window === 'undefined') return structuredClone(fallback)
  try {
    const raw = window.localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.warn('pageBuilder store load failed', err)
  }
  return structuredClone(fallback)
}

function persist(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function createId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const usePageBuilderStore = defineStore('pageBuilder', {
  state: () => ({
    pages: loadFromStorage(PAGE_STORAGE_KEY, []),
    templates: [],
    templatesLoading: false,
    templatesLoaded: false,
    templatesError: '',
    filters: filterLibrary,
    layoutPresets,
  }),
  getters: {
    getPageById: (state) => (id) => state.pages.find((page) => page.id === id),
    getTemplateById: (state) => (id) => state.templates.find((tpl) => tpl.id === id),
    layoutTemplateMap: (state) =>
      state.layoutPresets.reduce((acc, preset) => {
        acc[preset.value] = preset.template
        return acc
      }, {}),
  },
  actions: {
    savePage(payload) {
      const page = structuredClone(payload)
      page.id = page.id || createId('page')
      if (!page.layout) {
        page.layout = { preset: 'single', containers: [] }
      }
      const index = this.pages.findIndex((item) => item.id === page.id)
      if (index >= 0) {
        this.pages.splice(index, 1, page)
      } else {
        this.pages.push(page)
      }
      persist(PAGE_STORAGE_KEY, this.pages)
      return page.id
    },
    removePage(pageId) {
      const index = this.pages.findIndex((item) => item.id === pageId)
      if (index >= 0) {
        this.pages.splice(index, 1)
        persist(PAGE_STORAGE_KEY, this.pages)
      }
    },
    async fetchTemplates(force = false) {
      if (this.templatesLoading || (this.templatesLoaded && !force)) return
      this.templatesLoading = true
      this.templatesError = ''
      try {
        const remoteTemplates = await fetchReportViewTemplates()
        if (Array.isArray(remoteTemplates) && remoteTemplates.length) {
          this.templates = remoteTemplates
          this.templatesLoaded = true
        } else {
          this.templates = []
          this.templatesLoaded = true
        }
      } catch (err) {
        console.warn('Failed to load report templates', err)
        this.templatesError = 'Не удалось загрузить представления.'
        this.templates = []
      } finally {
        this.templatesLoading = false
      }
    },
  },
})
