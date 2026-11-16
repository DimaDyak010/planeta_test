import { MATERIAL_LIMITS, type Material, type MaterialInput } from '#shared/types/material'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<MaterialInput> | null>(event)
  const title = body?.title
  const summary = body?.short_description
  const datetime = body?.datetime
  const html = body?.description_html
  const json = body?.description_json

  if (
    typeof title !== 'string' || !title.trim() || title.length > MATERIAL_LIMITS.title ||
    typeof summary !== 'string' || !summary.trim() || summary.length > MATERIAL_LIMITS.short_description ||
    typeof datetime !== 'string' || !isIsoDate(datetime) ||
    typeof html !== 'string' || !html.trim() ||
    !json || json.type !== 'doc' || !Array.isArray(json.content)
  ) throw createError({ statusCode: 400, statusMessage: 'Invalid material fields' })

  const input: MaterialInput = {
    title: title.trim(),
    short_description: summary.trim(),
    datetime,
    description_html: html,
    description_json: json,
  }

  const { materialsAlias } = useRuntimeConfig(event)
  if (!materialsAlias) {
    return { ...input, id: crypto.randomUUID() }
  }

  const response = await requestMaterials(materialsAlias, input)
  const envelope = response as { data?: unknown, material?: unknown } | null
  return parseMaterial(envelope?.data ?? envelope?.material ?? response, input)
})

function isIsoDate(value: string) {
  const date = new Date(value)
  return !Number.isNaN(date.getTime()) && date.toISOString() === value
}

function parseMaterial(value: unknown, submitted: MaterialInput): Material {
  if (!value || typeof value !== 'object') throw invalidResponse()
  const item = { ...submitted, ...value } as Partial<Material>
  if (
    (typeof item.id !== 'string' && typeof item.id !== 'number') ||
    item.id === '' ||
    typeof item.title !== 'string' ||
    typeof item.short_description !== 'string' ||
    typeof item.datetime !== 'string' ||
    typeof item.description_html !== 'string'
  ) throw invalidResponse()

  return {
    id: item.id,
    title: item.title,
    short_description: item.short_description,
    datetime: item.datetime,
    description_html: item.description_html,
    description_json: item.description_json,
  }
}

function invalidResponse() {
  return createError({ statusCode: 502, statusMessage: 'Unexpected materials API response' })
}

async function requestMaterials(alias: string, body: MaterialInput): Promise<unknown> {
  const baseUrl = 'https://naukatv.ru/api/test/materials'
  const path = `${baseUrl}/${encodeURIComponent(alias)}/save`
  try {
    return await $fetch<unknown>(path, { method: 'POST', body, retry: 0, timeout: 10_000 })
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Materials API request failed' })
  }
}
