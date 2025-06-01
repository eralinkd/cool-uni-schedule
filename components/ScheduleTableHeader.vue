<template>
  <thead class="bg-gray-50">
    <tr>
      <th
        rowspan="2"
        class="sticky left-0 z-20 bg-gray-50 border-r border-gray-200 p-2 text-left w-16 text-xs font-medium text-gray-600"
      >
        день
      </th>
      <th
        rowspan="2"
        class="sticky left-16 z-20 bg-gray-50 border-r border-gray-200 p-2 text-left w-20 text-xs font-medium text-gray-600"
      >
        час
      </th>

      <th
        v-for="group in groups"
        :key="group.id"
        :colspan="group.subgroups.length"
        class="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-900 bg-white min-w-32"
      >
        група {{ group.name }}
      </th>
    </tr>

    <tr>
      <template v-for="group in groups" :key="`subgroups-${group.id}`">
        <th
          v-for="subgroup in group.subgroups"
          :key="subgroup.id"
          class="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-gray-50 min-w-32"
        >
          {{ subgroup.name }}
        </th>
      </template>
    </tr>
  </thead>
</template>

<script setup>
defineProps({
  groups: {
    type: Array,
    required: true
  }
})
</script>
