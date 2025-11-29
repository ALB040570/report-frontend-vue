import axios from 'axios'

const OBJECTS_API_URL = (import.meta.env.VITE_OBJECTS_API_BASE || '/dtj/api/objects').trim()

const objectsApi = axios.create({
  baseURL: OBJECTS_API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export async function callObjectsMethod(method, params = []) {
  const { data } = await objectsApi.post('', { method, params })
  return data
}

export async function fetchMethodTypeRecords() {
  const data = await callObjectsMethod('data/loadFactorValForSelect', ['Prop_MethodTyp'])
  return extractRecords(data)
}

function extractRecords(payload) {
  if (!payload || typeof payload !== 'object') return []
  if (Array.isArray(payload.result?.records)) return payload.result.records
  if (Array.isArray(payload.result)) return payload.result
  if (Array.isArray(payload.records)) return payload.records
  return []
}
