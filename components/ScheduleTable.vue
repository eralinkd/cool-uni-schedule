<template>
  <div class="space-y-6">
    <!-- Отдельная таблица для каждого дня недели -->
    <div v-for="day in weekDays" :key="day.id">
      <h3 class="text-lg font-semibold mb-2">{{ day.name }}</h3>
      <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full table-fixed border-collapse">
            <ScheduleTableHeader :groups="groups" />

            <tbody>
              <ScheduleTableRow
                v-for="timeSlot in timeSlots"
                :key="`${day.id}-${timeSlot.id}`"
                :day="day"
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

// Дни недели
const weekDays = [
  { id: 1, name: 'Понеділок' },
  { id: 2, name: 'Вівторок' },
  { id: 3, name: 'Середа' },
  { id: 4, name: 'Четвер' },
  { id: 5, name: 'Пʼятница' }
]

const handleDragSelection = (selection) => {
  console.log('Table drag selection:', selection)
  emit('drag-selection', selection)
}
</script>
