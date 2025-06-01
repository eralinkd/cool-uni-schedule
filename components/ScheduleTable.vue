<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full table-fixed border-collapse">
        <ScheduleTableHeader :groups="groups" />

        <tbody>
          <ScheduleTableRow
            v-for="timeSlot in timeSlots"
            :key="timeSlot.id"
            :time-slot="timeSlot"
            :groups="groups"
            :schedule-data="scheduleData"
            @cell-select="$emit('cell-select', $event)"
            @cell-edit="$emit('cell-edit', $event)"
            @drag-selection="handleDragSelection"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  scheduleData: {
    type: Object,
    required: true
  },
  groups: {
    type: Array,
    required: true
  },
  timeSlots: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['cell-select', 'cell-edit', 'drag-selection'])

const handleDragSelection = (selection) => {
  console.log('Table drag selection:', selection)
  emit('drag-selection', selection)
}
</script>
