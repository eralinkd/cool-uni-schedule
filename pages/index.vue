<template>
  <div class="space-y-6">
    <ScheduleHeader
      :semester="currentSemester"
      :week="currentWeek"
      :current-week-number="currentWeekNumber"
      :selected-department="selectedDepartment"
      :selected-course="selectedCourse"
      @week-change="handleWeekChange"
      @department-change="handleDepartmentChange"
      @course-change="handleCourseChange"
      @specialty-change="handleSpecialtyChange"
    />

    <ScheduleTable
      :schedule-data="scheduleData"
      :groups="filteredGroups"
      :time-slots="timeSlots"
      @cell-select="handleCellSelect"
      @cell-edit="handleCellEdit"
      @drag-selection="handleDragSelection"
    />

    <div v-if="selectedCount > 0" class="p-4 bg-gray-100 rounded text-sm">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium mb-1">Выбрано ячеек: {{ selectedCount }}</h3>
          <p class="text-gray-600 text-xs">
            • Клик - добавить/убрать ячейку<br />
            • Перетаскивание - добавить область к выбору<br />
            • Shift+клик или правая кнопка - очистить весь выбор
          </p>
        </div>
        <button
          class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          @click="globalDragSelection.clearSelection()"
        >
          Очистить выбор
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const { getCurrentWeekNumber, getWeekInfo } = useAcademicWeeks()

const globalDragSelection = useDragSelection()
provide('dragSelection', globalDragSelection)

const selectedCount = computed(() => globalDragSelection.selectedCells.value.size)

const currentWeekNumber = ref(getCurrentWeekNumber())
const currentSemester = ref('2 семестр 2024-2025')

const currentWeek = computed(() => {
  return getWeekInfo(currentWeekNumber.value) || {
    number: 1,
    start: '1 вересня',
    end: '7 вересня',
    type: 'навчання'
  }
})

const selectedDepartment = ref('ІПЗ')
const selectedCourse = ref('1')

const allGroups = ref([
  {
    id: 1,
    name: 'ІПЗ-11',
    course: 1,
    department: 'ІПЗ',
    subgroups: [
      { id: 1, name: 'підгрупа 1' },
      { id: 2, name: 'підгрупа 2' },
      { id: 3, name: 'підгрупа 3' }
    ]
  },
  {
    id: 2,
    name: 'ІПЗ-12',
    course: 1,
    department: 'ІПЗ',
    subgroups: [
      { id: 4, name: 'підгрупа 4' },
      { id: 5, name: 'підгрупа 5' },
      { id: 6, name: 'підгрупа 6' }
    ]
  },
  {
    id: 3,
    name: 'ІПЗ-13',
    course: 1,
    department: 'ІПЗ',
    subgroups: [
      { id: 7, name: 'підгрупа 7' },
      { id: 8, name: 'підгрупа 8' },
      { id: 9, name: 'підгрупа 9' }
    ]
  },
  {
    id: 4,
    name: 'ІПЗ-14',
    course: 1,
    department: 'ІПЗ',
    subgroups: [
      { id: 10, name: 'підгрупа 10' }
    ]
  },
  {
    id: 5,
    name: 'ІПЗ-21',
    course: 2,
    department: 'ІПЗ',
    subgroups: [
      { id: 11, name: 'підгрупа 1' },
      { id: 12, name: 'підгрупа 2' }
    ]
  },
  {
    id: 6,
    name: 'АІ-11',
    course: 1,
    department: 'АІ',
    subgroups: [
      { id: 13, name: 'підгрупа 1' },
      { id: 14, name: 'підгрупа 2' }
    ]
  }
])

const filteredGroups = computed(() => {
  return allGroups.value.filter(group =>
    group.department === selectedDepartment.value
    && group.course.toString() === selectedCourse.value
  )
})

// Отслеживаем изменения в фильтрованных группах
watch(filteredGroups, () => {
  // Очищаем зарегистрированные ячейки при изменении списка групп
  globalDragSelection.clearAvailableCells()
}, { deep: true })

const timeSlots = ref([
  { id: 1, time: '9:00-10:20', period: 1 },
  { id: 2, time: '10:30-11:50', period: 2 },
  { id: 3, time: '12:10-13:30', period: 3 },
  { id: 4, time: '13:40-15:00', period: 4 },
  { id: 5, time: '15:10-16:30', period: 5 }
])

const scheduleData = ref({
  'slot-1-group-1-subgroup-1': {
    subject: 'Іноземна мова (Пр)',
    professor: 'Голубовська І. О.',
    room: '313 ауд.',
    dates: '26.05 311 ауд.',
    link: 'zoom',
    platform: 'zoom'
  },
  'slot-1-group-1-subgroup-2': {
    subject: 'Іноземна мова (Пр)',
    professor: 'Андрійчук Т. В.',
    room: '109 ауд.',
    platform: 'zoom'
  },
  'slot-2-group-2-subgroup-5': {
    subject: 'Іноземна мова (Пр)',
    professor: 'Лященко Л. В.',
    room: '113 ауд.',
    platform: 'zoom'
  }
})

const handleWeekChange = (direction) => {
  if (direction === 'prev' && currentWeekNumber.value > 1) {
    currentWeekNumber.value--
  }
  else if (direction === 'next' && currentWeekNumber.value < 43) {
    currentWeekNumber.value++
  }
}

const handleDepartmentChange = (department) => {
  selectedDepartment.value = department
  globalDragSelection.clearSelection()
  globalDragSelection.clearAvailableCells()
}

const handleCourseChange = (course) => {
  selectedCourse.value = course
  globalDragSelection.clearSelection()
  globalDragSelection.clearAvailableCells()
}

const handleSpecialtyChange = (specialty) => {
  selectedDepartment.value = specialty
}

const handleCellSelect = (cellData) => {
  console.log('Cell selected:', cellData)
}

const handleCellEdit = (cellData) => {
  console.log('Cell edited:', cellData)
}

const handleDragSelection = (selection) => {
  console.log('Drag selection:', selection)
}
</script>
