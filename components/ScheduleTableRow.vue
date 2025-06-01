<template>
  <tr class="border-b border-gray-200 hover:bg-gray-50">
    <!-- Колонка дня (пока пустая для времени) -->
    <td class="sticky left-0 z-10 bg-white border-r border-gray-200 p-2 text-xs text-gray-600 w-16">
      {{ dayLabel }}
    </td>

    <!-- Колонка времени -->
    <td class="sticky left-16 z-10 bg-white border-r border-gray-200 p-2 text-xs font-medium text-gray-900 w-20">
      {{ timeSlot.time }}
    </td>

    <!-- Ячейки для каждой подгруппы -->
    <template v-for="group in groups" :key="`row-${group.id}`">
      <ScheduleCell
        v-for="subgroup in group.subgroups"
        :key="`cell-${timeSlot.id}-${group.id}-${subgroup.id}`"
        :time-slot="timeSlot"
        :group="group"
        :subgroup="subgroup"
        :lesson-data="getLessonData(timeSlot.id, group.id, subgroup.id)"
        @select="$emit('cell-select', $event)"
        @edit="$emit('cell-edit', $event)"
        @drag-end="handleDragEnd"
      />
    </template>
  </tr>
</template>

<script setup>
const props = defineProps({
  timeSlot: {
    type: Object,
    required: true
  },
  groups: {
    type: Array,
    required: true
  },
  scheduleData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['cell-select', 'cell-edit', 'drag-selection'])

// Определяем день для первой строки времени
const dayLabel = computed(() => {
  return props.timeSlot.period === 1 ? 'понед' : ''
})

// Получаем данные урока для конкретной ячейки
const getLessonData = (timeSlotId, groupId, subgroupId) => {
  const key = `slot-${timeSlotId}-group-${groupId}-subgroup-${subgroupId}`
  return props.scheduleData[key] || null
}

// Обработка завершения drag selection
const handleDragEnd = (selection) => {
  console.log('Row drag end:', selection)
  emit('drag-selection', selection)
}
</script>
