import type { H3Event } from 'h3'
import sanitizeHtml from 'sanitize-html'
import type { Material, MaterialInput } from '#shared/types/material'

const MATERIALS_URL = 'https://naukatv.ru/api/test/materials'

export function getMaterialsUrl(event: H3Event): string {
  const { materialsAlias } = useRuntimeConfig(event)
  if (!materialsAlias) throw createError({ statusCode: 503, statusMessage: 'Materials API is unavailable' })

  return `${MATERIALS_URL}/${encodeURIComponent(materialsAlias)}`
}

export function parseMaterial(value: unknown, submitted?: MaterialInput): Material {
  if (!value || typeof value !== 'object') throw invalidMaterialsResponse()
  const item = { ...submitted, ...value } as Partial<Material>
  if (
    (typeof item.id !== 'string' && typeof item.id !== 'number') ||
    item.id === '' ||
    typeof item.title !== 'string' ||
    typeof item.short_description !== 'string' ||
    typeof item.datetime !== 'string' ||
    Number.isNaN(Date.parse(item.datetime)) ||
    typeof item.description_html !== 'string'
  ) throw invalidMaterialsResponse()

  return {
    id: item.id,
    title: item.title,
    short_description: item.short_description,
    datetime: item.datetime,
    description_html: sanitizeHtml(item.description_html, {
      allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
      allowedAttributes: {
        a: ['href', 'title'],
        img: ['src', 'alt', 'title', 'width', 'height'],
        ol: ['start'],
      },
    }),
    description_json: item.description_json,
  }
}

export function invalidMaterialsResponse() {
  return createError({ statusCode: 502, statusMessage: 'Unexpected materials API response' })
}
