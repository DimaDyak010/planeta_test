export interface MaterialInput {
  title: string
  short_description: string
  datetime: string
  description_html: string
  description_json: Record<string, unknown>
}

export interface Material extends Omit<MaterialInput, 'description_json'> {
  id: number
  description_json?: unknown
}

export const MATERIAL_LIMITS = {
  title: 80,
  short_description: 255,
} as const
