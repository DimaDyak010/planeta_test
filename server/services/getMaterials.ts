import type { H3Event } from 'h3'
import type { Material } from '#shared/types/material'
import { getMaterialsUrl, invalidMaterialsResponse, parseMaterial } from '../utils/materials'

export async function getMaterials(event: H3Event): Promise<Material[]> {
  const url = getMaterialsUrl(event)
  let response: unknown
  try {
    response = await $fetch<unknown>(url, {
      method: 'GET',
      redirect: 'error',
      retry: 0,
      timeout: 10_000,
    })
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Materials API request failed' })
  }

  if (!Array.isArray(response)) throw invalidMaterialsResponse()

  return response
    .map(item => parseMaterial(item))
    .sort((a, b) => Date.parse(b.datetime) - Date.parse(a.datetime))
}
