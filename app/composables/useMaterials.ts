import type { Material } from '#shared/types/material'
import { mockMaterials } from '~/mocks/materials'

export function useMaterials() {
  const created = useState<Material[]>('created-materials', () => [])
  const materials = computed(() => {
    const byId = new Map([...mockMaterials, ...created.value].map(material => [String(material.id), material]))
    return [...byId.values()].sort((a, b) => Date.parse(b.datetime) - Date.parse(a.datetime))
  })

  function addMaterial(material: Material) {
    created.value.push(material)
  }

  return { materials, addMaterial }
}
