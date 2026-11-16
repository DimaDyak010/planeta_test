<template>
  <main class="page-width materials">
    <h1 class="page-title">Материалы</h1>

    <ul class="materials__list">
      <li v-for="material in materials" :key="material.id">
        <MaterialCard :material="material" />
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
const { materials } = useMaterials()
</script>

<style scoped lang="less">
.materials {
  display: grid;
  gap: 48px;
  padding-block: var(--page-top) 64px;

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--space-40);
    margin: 0;
    padding: 0;
    list-style: none;
  }
}

@media (max-width: 600px) {
  .materials {
    gap: var(--space-32);
    &__list {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--space-16);
    }
  }
}
</style>
