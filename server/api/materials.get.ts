import { invalidMaterialsResponse, parseMaterial, requestMaterials } from '../utils/materials'

export default defineEventHandler(async (event) => {
  const response = await requestMaterials(event)
  const envelope = response as { data?: unknown, materials?: unknown } | null
  const list: unknown = Array.isArray(response) ? response : envelope?.data ?? envelope?.materials
  if (!Array.isArray(list)) throw invalidMaterialsResponse()

  return list
    .map(item => parseMaterial(item))
    .sort((a, b) => Date.parse(b.datetime) - Date.parse(a.datetime))
})
