<template>
  <tr class="border-b border-gray-200 hover:bg-gray-50">
    <td class="sticky left-0 z-10 bg-white border-r border-gray-200 p-2 text-xs font-medium text-gray-900 w-20">
      {{ timeSlot.time }}
    </td>

    <template v-for="group in groups" :key="`row-${group.id}`">
      <ScheduleCell
        v-for="subgroup in group.subgroups"
        :key="`cell-${day.id}-${timeSlot.id}-${group.id}-${subgroup.id}`"
        :day="day"
        :time-slot="timeSlot"
        :group="group"
        :subgroup="subgroup"
        :lesson-data="getLessonData(day.id, timeSlot.id, group.id, subgroup.id)"
        @select="$emit('cell-select', $event)"
        @edit="$emit('cell-edit', $event)"
        @drag-end="handleDragEnd"
      />
    </template>
  </tr>
</template>

<script setup>
const props = defineProps({
  day: {
    type: Object,
    required: true
  },
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

const getLessonData = (dayId, timeSlotId, groupId, subgroupId) => {
  const key = `day-${dayId}-slot-${timeSlotId}-group-${groupId}-subgroup-${subgroupId}`
  return props.scheduleData[key] || null
}

const handleDragEnd = (selection) => {
  console.log('Row drag end:', selection)
  emit('drag-selection', selection)
}
</script>
