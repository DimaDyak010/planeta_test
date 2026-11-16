import { getMaterials } from '../../services/getMaterials'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  const material = Number.isSafeInteger(id)
    ? (await getMaterials(event)).find(item => item.id === id)
    : undefined

  if (!material) throw createError({ statusCode: 404, statusMessage: 'Material not found' })

  return material
})
