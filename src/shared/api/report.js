import axios from 'axios'

const REPORT_API_URL = (import.meta.env.VITE_REPORT_API_BASE || '/dtj/api/report').trim()

const reportApi = axios.create({
  baseURL: REPORT_API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export async function callReportMethod(method, params = []) {
  const { data } = await reportApi.post('', {
    method,
    params,
  })
  return data
}

export async function loadReportConfigurations() {
  const data = await callReportMethod('report/loadReportConfiguration', [0])
  if (Array.isArray(data?.result?.records)) return data.result.records
  if (Array.isArray(data?.result)) return data.result
  return []
}

export async function loadReportPresentations() {
  const data = await callReportMethod('report/loadReportPresentation', [0])
  if (Array.isArray(data?.result?.records)) return data.result.records
  if (Array.isArray(data?.result)) return data.result
  return []
}

export async function loadReportSources() {
  const data = await callReportMethod('report/loadReportSource', [0])
  if (Array.isArray(data?.result?.records)) return data.result.records
  if (Array.isArray(data?.result)) return data.result
  return []
}

export async function saveReportConfiguration(operation, payload) {
  const data = await callReportMethod('report/saveReportConfiguration', [operation, payload])
  if (Array.isArray(data?.result?.records)) return data.result.records[0]
  if (Array.isArray(data?.result)) return data.result[0]
  return data?.result || null
}

export async function saveComplexMetric(operation, payload) {
  const data = await callReportMethod('report/saveComplexMetrics', [operation, payload])
  if (Array.isArray(data?.result?.records)) return data.result.records[0]
  if (Array.isArray(data?.result)) return data.result[0]
  return data?.result || null
}

export async function saveReportPresentation(operation, payload) {
  const data = await callReportMethod('report/saveReportPresentation', [operation, payload])
  if (Array.isArray(data?.result?.records)) return data.result.records[0]
  if (Array.isArray(data?.result)) return data.result[0]
  return data?.result || null
}

export async function loadReportPages() {
  const data = await callReportMethod('report/loadReportPage', [0])
  if (Array.isArray(data?.result?.records)) return data.result.records
  if (Array.isArray(data?.result)) return data.result
  return []
}

export async function saveReportPage(operation, payload) {
  const data = await callReportMethod('report/saveReportPage', [operation, payload])
  if (Array.isArray(data?.result?.records)) return data.result.records[0]
  if (Array.isArray(data?.result)) return data.result[0]
  return data?.result || null
}

export async function loadPageContainers(pageId) {
  if (!pageId) return []
  const data = await callReportMethod('report/loadComplexPageContainer', [pageId])
  if (Array.isArray(data?.result?.records)) return data.result.records
  if (Array.isArray(data?.result)) return data.result
  return []
}

export async function savePageContainer(operation, payload) {
  const data = await callReportMethod('report/saveComplexPageContainer', [operation, payload])
  if (Array.isArray(data?.result?.records)) return data.result.records[0]
  if (Array.isArray(data?.result)) return data.result[0]
  return data?.result || null
}

export async function deleteComplexEntity(id) {
  if (!id) return null
  return callReportMethod('report/deleteComplexData', [id])
}

export async function deleteObjectWithProperties(id) {
  if (!id) return null
  return callReportMethod('report/deleteObjWithProperties', [id])
}

export async function loadReportFilterOptions(payload = {}) {
  if (!payload || typeof payload !== 'object') return []
  const data = await callReportMethod('report/loadReportFilterOptions', [payload])
  return normalizeFilterOptionResponse(data)
}

export const ROW_TOTAL_META = { fv: 1074, pv: 1565 }
export const COLUMN_TOTAL_META = { fv: 1075, pv: 1568 }

function normalizeFilterOptionResponse(payload) {
  const records = extractArray(payload)
  if (!records.length) return []
  return records
    .map((entry) => normalizeFilterOptionEntry(entry))
    .filter(Boolean)
}

function extractArray(payload) {
  if (!payload || typeof payload !== 'object') {
    return Array.isArray(payload) ? payload : []
  }
  if (Array.isArray(payload.result?.records)) return payload.result.records
  if (Array.isArray(payload.result)) return payload.result
  if (Array.isArray(payload.records)) return payload.records
  return []
}

function normalizeFilterOptionEntry(entry) {
  if (entry == null) return null
  if (typeof entry !== 'object') {
    const value = String(entry)
    return { value, label: value || 'пусто' }
  }
  const value =
    entry.value ??
    entry.Value ??
    entry.code ??
    entry.Code ??
    entry.id ??
    entry.Id ??
    entry.key ??
    entry.Key ??
    ''
  const label =
    entry.label ??
    entry.Label ??
    entry.name ??
    entry.Name ??
    entry.title ??
    entry.Title ??
    value
  const normalizedValue =
    value === null || typeof value === 'undefined' ? '' : String(value)
  const normalizedLabel =
    label === null || typeof label === 'undefined'
      ? normalizedValue || 'пусто'
      : String(label) || 'пусто'
  if (!normalizedValue && !normalizedLabel) return null
  return {
    value: normalizedValue,
    label: normalizedLabel,
  }
}
