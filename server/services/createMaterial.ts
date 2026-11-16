import type { H3Event } from 'h3'
import type { Material, MaterialInput } from '#shared/types/material'
import { getMaterialsUrl, parseMaterial } from '../utils/materials'

export async function createMaterial(event: H3Event, input: MaterialInput): Promise<Material> {
  const url = `${getMaterialsUrl(event)}/save`
  let response: unknown
  try {
    response = await $fetch<unknown>(url, {
      method: 'POST',
      body: input,
      redirect: 'error',
      retry: 0,
      timeout: 10_000,
    })
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Materials API request failed' })
  }

  return parseMaterial(response, input)
}
