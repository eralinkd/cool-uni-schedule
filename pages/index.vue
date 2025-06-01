<template>
  <div class="space-y-6">
    <ScheduleHeader
      :semester="currentSemester"
      :week="currentWeek"
      :current-week-number="currentWeekNumber"
      :selected-department-id="selectedDepartmentId"
      :selected-course="selectedCourse"
      :departments="departments"
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
import { computed, onMounted, ref, watch } from 'vue'

const { getCurrentWeekNumber, getWeekInfo } = useAcademicWeeks()

// Stores
const departmentStore = useDepartmentStore()
const groupStore = useGroupStore()
const scheduleStore = useScheduleStore()
const authStore = useAuthStore()

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

// Фильтры - теперь работаем с ID департамента
const selectedDepartmentId = ref(null)
const selectedCourse = ref(1)

// Получаем департаменты и группы из stores
const departments = computed(() => departmentStore.departments)

// Фильтрованные группы
const filteredGroups = computed(() => {
  if (!selectedDepartmentId.value) return []

  return groupStore.getGroupsByDepartmentAndCourse(
    selectedDepartmentId.value,
    selectedCourse.value
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

// Данные расписания из store
const scheduleData = computed(() => scheduleStore.scheduleDataForTable)

// Загружаем данные при изменении фильтров
const loadScheduleData = async() => {
  if (!selectedDepartmentId.value) return

  // Подготавливаем данные для фильтра
  const filterData = {
    departmentId: selectedDepartmentId.value,
    course: selectedCourse.value,
    weekNumber: currentWeekNumber.value
    // Можно добавить другие параметры фильтрации
  }

  await scheduleStore.fetchScheduleByFilter(filterData)
}

// Обработчики
const handleWeekChange = async(direction) => {
  if (direction === 'prev' && currentWeekNumber.value > 1) {
    currentWeekNumber.value--
  }
  else if (direction === 'next' && currentWeekNumber.value < 43) {
    currentWeekNumber.value++
  }
  await loadScheduleData()
}

const handleDepartmentChange = async(departmentId) => {
  selectedDepartmentId.value = departmentId
  globalDragSelection.clearSelection()
  globalDragSelection.clearAvailableCells()
  await loadScheduleData()
}

const handleCourseChange = async(course) => {
  selectedCourse.value = course
  globalDragSelection.clearSelection()
  globalDragSelection.clearAvailableCells()
  await loadScheduleData()
}

const handleSpecialtyChange = (specialtyId) => {
  // specialtyId теперь это ID департамента
  handleDepartmentChange(specialtyId)
}

const handleCellSelect = (cellData) => {
  console.log('Cell selected:', cellData)
}

const handleCellEdit = (cellData) => {
  console.log('Cell edited:', cellData)
  // TODO: Открыть модальное окно для редактирования
}

const handleDragSelection = (selection) => {
  console.log('Drag selection:', selection)
  // TODO: Обработать массовое выделение
}

// Загружаем начальные данные
onMounted(async() => {
  await authStore.login('admin', 'admin123')
  // Загружаем департаменты
  await departmentStore.fetchDepartments()

  // Устанавливаем первый департамент по умолчанию
  if (departments.value.length > 0) {
    selectedDepartmentId.value = departments.value[0].id
  }

  // Загружаем все группы
  await groupStore.fetchGroups()

  // Загружаем расписание
  await loadScheduleData()
})
</script>
