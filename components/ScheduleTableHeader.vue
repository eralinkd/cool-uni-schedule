<template>
  <thead class="bg-gray-50">
    <tr>
      <th
        class="sticky left-0 z-20 bg-gray-50 border-r border-gray-200 p-2 text-left w-20 text-xs font-medium text-gray-600"
      >
        час
      </th>

      <th
        v-for="group in groups"
        :key="group.id"
        class="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-900 bg-white min-w-32"
      >
        група {{ group.name }}
      </th>
    </tr>
  </thead>
</template>

<script setup>
defineProps({
  groups: {
    type: Array,
    required: true
  },
  canEdit: {
    type: Boolean,
    default: false
  }
})
</script>
