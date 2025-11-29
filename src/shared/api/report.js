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

export async function deleteComplexEntity(id) {
  if (!id) return null
  return callReportMethod('report/deleteComplexData', [id])
}

export const REMOTE_AGGREGATORS = {
  sum: { label: 'сумма', fvFieldVal: 1349, pvFieldVal: 1569 },
  count: { label: 'количество', fvFieldVal: 1350, pvFieldVal: 1570 },
  avg: { label: 'среднее', fvFieldVal: 1351, pvFieldVal: 1571 },
}

export const ROW_TOTAL_META = { fv: 1074, pv: 1565 }
export const COLUMN_TOTAL_META = { fv: 1075, pv: 1568 }
