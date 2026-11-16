import { MATERIAL_LIMITS, type MaterialInput } from '#shared/types/material'
import { parseMaterial, requestMaterials } from '../utils/materials'

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

  const response = await requestMaterials(event, input)
  const envelope = response as { data?: unknown, material?: unknown } | null
  return parseMaterial(envelope?.data ?? envelope?.material ?? response, input)
})

function isIsoDate(value: string) {
  const date = new Date(value)
  return !Number.isNaN(date.getTime()) && date.toISOString() === value
}
