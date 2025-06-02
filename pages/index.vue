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

    <!-- Дебаг информация -->
    <div class="p-2 bg-yellow-50 border rounded text-xs">
      <p>
        <strong>Дебаг:</strong> selectedCount = {{ selectedCount }},
        selectedCells = {{ Array.from(globalDragSelection.selectedCells.value).length }}
      </p>
    </div>

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
        <div class="flex items-center space-x-2">
          <button
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
            @click="openCreateLessonModal"
          >
            Створити заняття
          </button>
          <button
            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            @click="globalDragSelection.clearSelection()"
          >
            Очистити вибір
          </button>
        </div>
      </div>
    </div>

    <!-- Альтернативная кнопка для тестирования -->
    <div class="p-4 bg-blue-50 rounded text-sm mt-4">
      <h3 class="font-medium mb-2">🧪 Тестування модального вікна:</h3>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
        @click="testCreateModal"
      >
        Тест створення заняття
      </button>
    </div>

    <!-- Модальное окно создания занятия -->
    <CreateLessonModal
      v-if="showCreateModal"
      :selected-cells="Array.from(globalDragSelection.selectedCells.value)"
      :subjects="subjects"
      :professors="professors"
      :rooms="rooms"
      @close="closeCreateModal"
      @save="handleLessonCreate"
    />

    <!-- Модальное окно рекомендации аудитории -->
    <RoomRecommendationModal
      v-if="showRoomModal"
      :recommended-rooms="recommendedRooms"
      :lesson-data="createdLessonData"
      @close="closeRoomModal"
      @confirm="handleRoomConfirm"
    />
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

// Тестовые данные департаментов
const departments = ref([
  { id: 1, name: 'ІПЗ' },
  { id: 2, name: 'АІ' },
  { id: 3, name: 'КІ' },
  { id: 4, name: 'ТК' }
])

// Тестовые данные предметов
const subjects = ref([
  { id: 1, name: 'Іноземна мова', type: 'Практичне' },
  { id: 2, name: 'Математика', type: 'Лекція' },
  { id: 3, name: 'Програмування', type: 'Лабораторна' },
  { id: 4, name: 'Бази даних', type: 'Практичне' },
  { id: 5, name: 'Фізика', type: 'Лекція' },
  { id: 6, name: 'Алгоритми', type: 'Практичне' },
  { id: 7, name: 'Проектування ПЗ', type: 'Лабораторна' },
  { id: 8, name: 'Веб-технології', type: 'Лабораторна' },
  { id: 9, name: 'Операційні системи', type: 'Лекція' },
  { id: 10, name: 'Комп\'ютерні мережі', type: 'Практичне' }
])

// Тестовые данные преподавателей
const professors = ref([
  { id: 1, name: 'Голубовська І. О.', subjects: [1] },
  { id: 2, name: 'Андрійчук Т. В.', subjects: [1] },
  { id: 3, name: 'Лященко Л. В.', subjects: [2] },
  { id: 4, name: 'Іванов І. І.', subjects: [3, 7] },
  { id: 5, name: 'Петров П. П.', subjects: [4] },
  { id: 6, name: 'Сидоров С. С.', subjects: [5] },
  { id: 7, name: 'Коваленко К. К.', subjects: [6] },
  { id: 8, name: 'Мельник М. М.', subjects: [7, 8] },
  { id: 9, name: 'Ткаченко Т. Т.', subjects: [9] },
  { id: 10, name: 'Шевченко Ш. Ш.', subjects: [10] }
])

// Тестовые данные аудиторий
const rooms = ref([
  { id: 1, name: '109 ауд.', capacity: 25, type: 'звичайна' },
  { id: 2, name: '113 ауд.', capacity: 30, type: 'звичайна' },
  { id: 3, name: '201 ауд.', capacity: 20, type: 'комп\'ютерна' },
  { id: 4, name: '220 ауд.', capacity: 35, type: 'звичайна' },
  { id: 5, name: '305 ауд.', capacity: 40, type: 'лекційна' },
  { id: 6, name: '313 ауд.', capacity: 25, type: 'звичайна' },
  { id: 7, name: '315 ауд.', capacity: 15, type: 'комп\'ютерна' },
  { id: 8, name: '115 ауд.', capacity: 50, type: 'лекційна' },
  { id: 9, name: '401 ауд.', capacity: 30, type: 'звичайна' },
  { id: 10, name: '405 ауд.', capacity: 20, type: 'комп\'ютерна' }
])

const selectedDepartmentId = ref(1)
const selectedCourse = ref(1)

// Состояние модальных окон
const showCreateModal = ref(false)
const showRoomModal = ref(false)
const createdLessonData = ref(null)
const recommendedRooms = ref([])

const allGroups = ref([
  {
    id: 1,
    name: 'ІПЗ-11',
    course: 1,
    departmentId: 1,
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
    departmentId: 1,
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
    departmentId: 1,
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
    departmentId: 1,
    subgroups: [
      { id: 10, name: 'підгрупа 10' }
    ]
  },
  {
    id: 5,
    name: 'ІПЗ-21',
    course: 2,
    departmentId: 1,
    subgroups: [
      { id: 11, name: 'підгрупа 1' },
      { id: 12, name: 'підгрупа 2' }
    ]
  },
  {
    id: 6,
    name: 'АІ-11',
    course: 1,
    departmentId: 2,
    subgroups: [
      { id: 13, name: 'підгрупа 1' },
      { id: 14, name: 'підгрупа 2' }
    ]
  },
  {
    id: 7,
    name: 'КІ-11',
    course: 1,
    departmentId: 3,
    subgroups: [
      { id: 15, name: 'підгрупа 1' },
      { id: 16, name: 'підгрупа 2' }
    ]
  }
])

const filteredGroups = computed(() => {
  return allGroups.value.filter(group =>
    group.departmentId === selectedDepartmentId.value
    && group.course === selectedCourse.value
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

// Тестовые данные расписания с поддержкой дней недели
const scheduleData = ref({
  // Понедельник
  'day-1-slot-1-group-1-subgroup-1': {
    subject: 'Іноземна мова (Пр)',
    professor: 'Голубовська І. О.',
    room: '313 ауд.',
    dates: '26.05 311 ауд.',
    platform: 'zoom'
  },
  'day-1-slot-1-group-1-subgroup-2': {
    subject: 'Іноземна мова (Пр)',
    professor: 'Андрійчук Т. В.',
    room: '109 ауд.',
    platform: 'zoom'
  },
  'day-1-slot-2-group-2-subgroup-5': {
    subject: 'Математика (Лек)',
    professor: 'Лященко Л. В.',
    room: '113 ауд.',
    platform: ''
  },
  // Вторник
  'day-2-slot-1-group-1-subgroup-1': {
    subject: 'Програмування (Лаб)',
    professor: 'Іванов І. І.',
    room: '201 ауд.',
    platform: ''
  },
  'day-2-slot-3-group-2-subgroup-4': {
    subject: 'Базы данных (Пр)',
    professor: 'Петров П. П.',
    room: '305 ауд.',
    platform: ''
  },
  // Среда
  'day-3-slot-2-group-1-subgroup-1': {
    subject: 'Физика (Лек)',
    professor: 'Сидоров С. С.',
    room: '115 ауд.',
    platform: ''
  },
  // Четверг
  'day-4-slot-1-group-3-subgroup-7': {
    subject: 'Алгоритми (Пр)',
    professor: 'Коваленко К. К.',
    room: '220 ауд.',
    platform: ''
  },
  // Пятница
  'day-5-slot-4-group-1-subgroup-2': {
    subject: 'Проектування ПЗ (Лаб)',
    professor: 'Мельник М. М.',
    room: '315 ауд.',
    platform: ''
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

const handleDepartmentChange = (departmentId) => {
  selectedDepartmentId.value = departmentId
  globalDragSelection.clearSelection()
  globalDragSelection.clearAvailableCells()
}

const handleCourseChange = (course) => {
  selectedCourse.value = course
  globalDragSelection.clearSelection()
  globalDragSelection.clearAvailableCells()
}

const handleSpecialtyChange = (departmentId) => {
  selectedDepartmentId.value = departmentId
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

// Функции для модальных окон
const openCreateLessonModal = () => {
  if (selectedCount.value === 0) return
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const handleLessonCreate = (lessonData) => {
  console.log('Creating lesson:', lessonData)

  // Сохраняем данные созданного занятия
  createdLessonData.value = lessonData

  // Сохраняем выбранные ячейки до очистки
  const selectedCells = Array.from(globalDragSelection.selectedCells.value)

  // Добавляем занятие в расписание для каждой выбранной ячейки
  selectedCells.forEach((cellId) => {
    scheduleData.value[cellId] = {
      subject: `${lessonData.subject.name} (${lessonData.subject.type})`,
      professor: lessonData.professor.name,
      room: lessonData.room.name,
      dates: lessonData.additionalDates || '',
      platform: lessonData.isOnline ? lessonData.onlineLink : ''
    }
  })

  // Сохраняем ячейки в данных занятия для последующего обновления
  createdLessonData.value.selectedCells = selectedCells

  // Генерируем рекомендации аудиторий
  generateRoomRecommendations(lessonData)

  // Закрываем модальное окно создания
  closeCreateModal()

  // Показываем модальное окно рекомендаций
  showRoomModal.value = true

  // Очищаем выделение
  globalDragSelection.clearSelection()
}

const generateRoomRecommendations = (lessonData) => {
  // Простая логика рекомендаций на основе типа занятия
  let filteredRooms = []

  if (lessonData.subject.type === 'Лекція') {
    filteredRooms = rooms.value.filter(room => room.type === 'лекційна' || room.capacity >= 40)
  }
  else if (lessonData.subject.type === 'Лабораторна') {
    filteredRooms = rooms.value.filter(room => room.type === 'комп\'ютерна')
  }
  else {
    filteredRooms = rooms.value.filter(room => room.type === 'звичайна' && room.capacity >= 20)
  }

  // Добавляем случайный рейтинг для демонстрации
  recommendedRooms.value = filteredRooms.slice(0, 3).map(room => ({
    ...room,
    rating: Math.floor(Math.random() * 30) + 70, // 70-100%
    reason: getRecommendationReason(room, lessonData.subject.type)
  }))
}

const getRecommendationReason = (room, subjectType) => {
  if (subjectType === 'Лекція' && room.type === 'лекційна') {
    return 'Спеціалізована лекційна аудиторія'
  }
  if (subjectType === 'Лабораторна' && room.type === 'комп\'ютерна') {
    return 'Комп\'ютерна аудиторія для лабораторних робіт'
  }
  if (room.capacity >= 30) {
    return 'Велика місткість аудиторії'
  }
  return 'Підходить за типом та розміром'
}

const closeRoomModal = () => {
  showRoomModal.value = false
  createdLessonData.value = null
  recommendedRooms.value = []
}

const handleRoomConfirm = (selectedRoom) => {
  console.log('Room confirmed:', selectedRoom)

  // Обновляем аудиторию в созданных занятиях
  if (createdLessonData.value && createdLessonData.value.selectedCells) {
    createdLessonData.value.selectedCells.forEach((cellId) => {
      if (scheduleData.value[cellId]) {
        scheduleData.value[cellId].room = selectedRoom.name
      }
    })
  }

  closeRoomModal()
}

// Добавляем новую функцию для тестирования модального окна
const testCreateModal = () => {
  // Симулируем выбранные ячейки для тестирования
  const testCells = [
    'day-1-slot-1-group-1-subgroup-1',
    'day-1-slot-1-group-1-subgroup-2'
  ]

  // Добавляем тестовые ячейки в выделение
  testCells.forEach((cellId) => {
    globalDragSelection.addCellToSelection(cellId)
  })

  // Открываем модальное окно
  showCreateModal.value = true
  console.log('Тестирование модального окна с ячейками:', testCells)
}
</script>
