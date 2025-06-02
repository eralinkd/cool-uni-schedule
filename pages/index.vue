<template>
  <div class="space-y-6 pb-20">
    <div v-if="isStudent" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-center space-x-2">
        <UIcon
          name="i-heroicons-information-circle"
          class="w-5 h-5 text-blue-600"
        />
        <div class="text-blue-800">
          <p class="font-medium">Режим перегляду</p>
          <p class="text-sm">Ви переглядаєте розклад у режимі тільки для читання</p>
        </div>
      </div>
    </div>

    <ScheduleHeader
      :semester="currentSemester"
      :week="currentWeek"
      :current-week-number="currentWeekNumber"
      :selected-department-id="selectedDepartmentId"
      :selected-course="selectedCourse"
      :departments="departments"
      :can-edit="canEditSchedule"
      @week-change="handleWeekChange"
      @department-change="handleDepartmentChange"
      @course-change="handleCourseChange"
      @specialty-change="handleSpecialtyChange"
    />

    <ScheduleTable
      :schedule-data="scheduleData"
      :groups="filteredGroups"
      :time-slots="timeSlots"
      :can-edit="canEditSchedule"
      @cell-select="handleCellSelect"
      @cell-edit="handleCellEdit"
      @drag-selection="handleDragSelection"
    />

    <div v-if="selectedCount > 0 && canEditSchedule" class="p-4 bg-gray-100 rounded text-sm">
      <div class="flex items-center justify-between">
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

    <!-- Модальное окно редактирования занятия -->
    <EditLessonModal
      v-if="showEditModal"
      :lesson-data="editingLessonData"
      :subjects="subjects"
      :professors="professors"
      :rooms="rooms"
      @close="closeEditModal"
      @save="handleLessonEdit"
    />

    <!-- Модальное окно удаления занятия -->
    <DeleteLessonModal
      v-if="showDeleteModal"
      :lesson-data="deletingLessonData"
      @close="closeDeleteModal"
      @confirm="handleLessonDelete"
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
import { computed, onMounted, ref } from 'vue'

const { getCurrentWeekNumber, getWeekInfo } = useAcademicWeeks()

const globalDragSelection = useDragSelection()
provide('dragSelection', globalDragSelection)

// Инициализация stores (из indexNew.vue)
const scheduleStore = useScheduleStore()
const groupStore = useGroupStore()
const departmentStore = useDepartmentStore()
const professorStore = useProfessorStore()
const subjectStore = useSubjectStore()
const roomStore = useRoomStore()
const authStore = useAuthStore()
const studentStore = useStudentStore()

// Проверяем роль пользователя
const isStudent = computed(() => authStore.roles.includes('ROLE_STUDENT'))
const canEditSchedule = computed(() => !isStudent.value)

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

// Данные из stores (из indexNew.vue)
const departments = computed(() => departmentStore.departments)
const subjects = computed(() => subjectStore.subjects)
const rawProfessors = computed(() => professorStore.professors)
const rooms = computed(() => roomStore.rooms)

// Преобразуем данные преподавателей для совместимости с CreateLessonModal (из indexNew.vue)
const professors = computed(() => {
  if (!Array.isArray(rawProfessors.value) || !Array.isArray(subjects.value)) return []

  return rawProfessors.value.map((prof) => {
    // Находим предметы по кафедрам преподавателя
    const professorDepartmentIds = prof.departments?.map(d => d.id) || []
    const professorSubjects = subjects.value
      .filter((subject) => {
        const subjectDeptId = subject.department?.id || subject.departmentId || subject.department
        return professorDepartmentIds.includes(subjectDeptId)
      })
      .map(subject => subject.id)

    return {
      ...prof,
      name: `${prof.firstName} ${prof.lastName}`,
      subjects: professorSubjects
    }
  })
})

// Получаем данные текущего студента
const currentStudent = computed(() => {
  if (!isStudent.value) {
    return null
  }

  // Используем первого студента для тестирования, но добавляем безопасные проверки
  const foundStudent = studentStore.students?.[0]
  return foundStudent || null
})

// Группы фильтруем через метод store (из indexNew.vue)
const groups = computed(() => {
  if (!selectedDepartmentId.value) return []

  const allGroups = groupStore.groups || []
  console.log('All groups:', allGroups)
  console.log('Selected department ID:', selectedDepartmentId.value)

  // Фильтруем группы с учетом разных структур данных
  const filtered = allGroups.filter((group) => {
    const deptId = group.department?.id || group.departmentId || group.department

    // Если у группы нет департамента (null), показываем все группы для тестирования
    if (deptId === null || deptId === undefined) {
      console.log('Group has no department, including it:', group.name)
      return true
    }

    const matches = deptId === selectedDepartmentId.value
    if (matches) {
      console.log('Group matches department:', group.name, 'deptId:', deptId)
    }
    return matches
  })

  console.log('Filtered groups by department:', filtered)
  return filtered
})

const selectedDepartmentId = ref(null)
const selectedCourse = ref(1)

// Состояние модальных окон
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showRoomModal = ref(false)
const createdLessonData = ref(null)
const editingLessonData = ref(null)
const deletingLessonData = ref(null)
const recommendedRooms = ref([])

const filteredGroups = computed(() => {
  if (!Array.isArray(groups.value)) {
    return []
  }

  if (isStudent.value) {
    // Безопасные проверки для студента
    if (!currentStudent.value || !currentStudent.value.group?.id) {
      console.warn('Student has no group information')
      return []
    }

    const studentGroupId = currentStudent.value.group.id
    const studentGroup = groups.value.find(group => group.id === studentGroupId)

    if (studentGroup) {
      return [studentGroup]
    }
    else {
      return []
    }
  }

  const sampleGroup = groups.value[0]

  // Временно отключаем фильтрацию по курсу если поля course нет
  let courseFiltered = groups.value
  if (sampleGroup && 'course' in sampleGroup) {
    courseFiltered = groups.value.filter(group => group.course === selectedCourse.value)
  }
  return courseFiltered
})

const timeSlots = ref([
  { id: 1, time: '09:00-10:20', period: 1 },
  { id: 2, time: '10:30-11:50', period: 2 },
  { id: 3, time: '12:10-13:30', period: 3 },
  { id: 4, time: '13:40-15:00', period: 4 },
  { id: 5, time: '15:10-16:30', period: 5 }
])

// Расписание из scheduleStore преобразованное для отображения
const scheduleData = computed(() => {
  const apiScheduleRaw = scheduleStore.entries // Используем entries вместо flatMap

  // Безопасная проверка что данные являются массивом
  const apiSchedule = Array.isArray(apiScheduleRaw) ? apiScheduleRaw : []

  if (!Array.isArray(apiScheduleRaw)) {
    return {}
  }

  const transformedSchedule = {}

  for (const lesson of apiSchedule) {
    try {
      // Получаем данные из stores по ID
      const subject = subjects.value.find(s => s.id === lesson.subject)
      const professor = professors.value.find(p => p.id === lesson.professor)
      const room = rooms.value.find(r => lesson.rooms?.includes(r.id))

      // Преобразуем время в слот
      let timeString
      if (typeof lesson.startTime === 'string') {
        // API возвращает строку "10:30:00"
        timeString = lesson.startTime.substring(0, 5) // "10:30"
      }
      else if (lesson.startTime?.hour !== undefined) {
        // Если это объект с hour/minute
        const startHour = lesson.startTime.hour
        const startMinute = lesson.startTime.minute || 0
        timeString = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`
      }
      else {
        continue
      }

      const timeSlot = timeSlots.value.find((slot) => {
        const [slotStart] = slot.time.split('-')
        const matches = slotStart === timeString
        return matches
      })

      if (!timeSlot) {
        continue
      }

      // Создаем данные для отображения
      const typeLabel = lesson.type === 'LECTURE' ? 'Лек' : lesson.type === 'LABORATORY' ? 'Лаб' : 'Пр'
      const lessonDisplay = {
        id: lesson.id,
        subject: subject ? `${subject.name} (${typeLabel})` : `Предмет ${lesson.subject}`,
        professor: professor ? professor.name : `Викладач ${lesson.professor}`,
        room: room ? room.name : `Ауд. ${lesson.rooms?.[0] || 'невідома'}`,
        dates: lesson.dayOfWeek || lesson.dates?.map(d => d.date || d).join(', ') || '',
        platform: lesson.isOnline ? (lesson.onlineLink || 'онлайн') : ''
      }

      // Определяем день из dayOfWeek
      const dayOfWeekMapping = {
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6,
        SUNDAY: 7
      }
      const dayId = dayOfWeekMapping[lesson.dayOfWeek] || 1

      // Если есть группы, создаем ячейки для каждой группы
      if (lesson.groups && lesson.groups.length > 0) {
        for (const groupId of lesson.groups) {
          const cellKey = `day-${dayId}-slot-${timeSlot.id}-group-${groupId}`
          transformedSchedule[cellKey] = lessonDisplay
        }
      }
    }
    catch {
      return
    }
  }

  return transformedSchedule
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
  // clearAvailableCells будет вызвана автоматически через watcher
}

const handleCourseChange = (course) => {
  selectedCourse.value = course
  globalDragSelection.clearSelection()
  // clearAvailableCells будет вызвана автоматически через watcher
}

const handleSpecialtyChange = (departmentId) => {
  selectedDepartmentId.value = departmentId
}

const handleCellSelect = (cellData) => {
  console.log('Cell selected:', cellData)
}

const handleCellEdit = (cellData) => {
  console.log('Cell edit requested:', cellData)

  if (cellData.lessonData) {
    // Есть занятие - открываем меню редактирования/удаления
    openLessonActionMenu(cellData)
  }
  else {
    // Пустая ячейка - открываем создание
    globalDragSelection.setSelection([cellData.cellId])
    openCreateLessonModal()
  }
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

const openLessonActionMenu = (cellData) => {
  // Показываем простое меню с опциями
  const action = window.confirm(
    'Що ви хочете зробити з цим заняттям?\n\n'
    + 'OK - Редагувати\n'
    + 'Cancel - Видалити'
  )

  if (action) {
    openEditLessonModal(cellData)
  }
  else {
    // Подтверждаем удаление
    const confirmDelete = window.confirm('Ви впевнені, що хочете видалити це заняття?')
    if (confirmDelete) {
      openDeleteLessonModal(cellData)
    }
  }
}

const openEditLessonModal = (cellData) => {
  editingLessonData.value = {
    cellData,
    lessonData: cellData.lessonData,
    cellId: `day-${cellData.day.id}-slot-${cellData.timeSlot.id}-group-${cellData.group.id}`
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingLessonData.value = null
}

const openDeleteLessonModal = (cellData) => {
  deletingLessonData.value = {
    cellData,
    lessonData: cellData.lessonData,
    cellId: `day-${cellData.day.id}-slot-${cellData.timeSlot.id}-group-${cellData.group.id}`
  }
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingLessonData.value = null
}

// handleLessonCreate из indexNew.vue (работа с API)
const handleLessonCreate = async(lessonData) => {
  console.log('Creating lesson:', lessonData)

  // Импортируем композабл для уведомлений
  const { error: showError, success: showSuccess } = useShowNotivue()

  try {
    // Преобразуем выбранные ячейки в структуру для API
    const selectedCells = lessonData.selectedCells || []

    // Парсим выбранные ячейки для получения данных о группах, днях и времени
    const parsedCells = selectedCells.map((cellId) => {
      console.log('🔍 Parsing cell ID:', cellId)
      const match = cellId.match(/day-(\d+)-slot-(\d+)-group-(\d+)/)
      if (match) {
        const parsed = {
          dayId: Number.parseInt(match[1]),
          timeSlotId: Number.parseInt(match[2]),
          groupId: Number.parseInt(match[3])
        }
        console.log('✅ Parsed cell:', parsed)
        return parsed
      }
      console.warn('❌ Failed to parse cell ID:', cellId)
      return null
    }).filter(Boolean)

    if (parsedCells.length === 0) {
      throw new Error('Не вдалося розпарсити вибрані ячейки')
    }

    // Группируем ячейки по временным слотам
    const cellsByTimeSlot = {}
    parsedCells.forEach((cell) => {
      const key = `${cell.dayId}-${cell.timeSlotId}`
      if (!cellsByTimeSlot[key]) {
        cellsByTimeSlot[key] = {
          dayId: cell.dayId,
          timeSlotId: cell.timeSlotId,
          groups: new Set()
        }
      }
      cellsByTimeSlot[key].groups.add(cell.groupId)
    })

    console.log('Grouped cells by time slot:', cellsByTimeSlot)

    // Преобразуем дни в dayOfWeek
    const dayOfWeekMapping = {
      1: 'MONDAY',
      2: 'TUESDAY',
      3: 'WEDNESDAY',
      4: 'THURSDAY',
      5: 'FRIDAY',
      6: 'SATURDAY',
      7: 'SUNDAY'
    }

    const dayNames = {
      1: 'Понеділок',
      2: 'Вівторок',
      3: 'Середа',
      4: 'Четвер',
      5: 'П\'ятниця',
      6: 'Субота',
      7: 'Неділя'
    }

    // Генерируем реальные даты
    const today = new Date()
    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1))

    // Создаем запросы для каждого временного слота
    const createPromises = []
    const createdLessons = []
    const failedLessons = []

    for (const [_key, timeSlotData] of Object.entries(cellsByTimeSlot)) {
      // Получаем время для этого слота
      console.log('🕐 Looking for time slot with ID:', timeSlotData.timeSlotId)
      console.log('🕐 Available time slots:', timeSlots.value)

      const timeSlot = timeSlots.value.find(slot => slot.id === timeSlotData.timeSlotId)
      if (!timeSlot) {
        console.warn('❌ Time slot not found:', timeSlotData.timeSlotId)
        console.warn('Available slot IDs:', timeSlots.value.map(s => s.id))
        continue
      }

      console.log('✅ Found time slot:', timeSlot)

      const [startTimeStr, endTimeStr] = timeSlot.time.split('-')
      const [startHour, startMinute] = startTimeStr.split(':').map(Number)
      const [endHour, endMinute] = endTimeStr.split(':').map(Number)

      console.log('🕐 Parsed time:', { startTimeStr, endTimeStr, startHour, startMinute, endHour, endMinute })

      // Генерируем дату для этого дня
      const dayOfWeek = dayOfWeekMapping[timeSlotData.dayId] || 'MONDAY'
      const lessonDate = new Date(currentWeekStart)
      lessonDate.setDate(currentWeekStart.getDate() + timeSlotData.dayId - 1)
      const dates = [lessonDate.toISOString().split('T')[0]]

      // Создаем DTO для этого временного слота
      const dto = {
        type: lessonData.subject.type,
        startTime: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`,
        endTime: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`,
        isOnline: lessonData.isOnline || false,
        roomIds: [lessonData.room.id],
        professorId: lessonData.professor.id,
        groupIds: Array.from(timeSlotData.groups),
        subgroupIds: [], // Оставляем пустой массив как требуется
        dayOfWeek: dayOfWeek,
        dates: dates,
        subjectId: lessonData.subject.id
      }

      console.log(`Creating lesson for time slot ${timeSlotData.timeSlotId}:`, dto)

      // Добавляем промис создания в массив с обработкой ошибок
      const createPromise = scheduleStore.create(dto)
        .then((result) => {
          createdLessons.push({
            timeSlotId: timeSlotData.timeSlotId,
            timeSlot: timeSlot,
            dayName: dayNames[timeSlotData.dayId],
            result: result,
            dto: dto
          })
          return result
        })
        .catch((error) => {
          console.error(`Failed to create lesson for slot ${timeSlotData.timeSlotId}:`, error)

          // Извлекаем сообщение об ошибке
          let errorMessage = 'Невідома помилка'
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message
          }
          else if (error.message) {
            errorMessage = error.message
          }

          failedLessons.push({
            timeSlotId: timeSlotData.timeSlotId,
            timeSlot: timeSlot,
            dayName: dayNames[timeSlotData.dayId],
            error: errorMessage,
            dto: dto
          })

          // Не прерываем выполнение других запросов
          return null
        })

      createPromises.push(createPromise)
    }

    // Ждем выполнения всех запросов
    console.log(`Sending ${createPromises.length} requests for ${Object.keys(cellsByTimeSlot).length} time slots`)
    const results = await Promise.allSettled(createPromises)

    console.log('All requests completed:', results)
    console.log('Created lessons:', createdLessons)
    console.log('Failed lessons:', failedLessons)

    // Показываем результаты пользователю
    if (createdLessons.length > 0) {
      showSuccess(`Успішно створено ${createdLessons.length} занять`)

      // Сохраняем данные для модального окна рекомендаций (используем первое занятие)
      createdLessonData.value = {
        ...lessonData,
        entryId: createdLessons[0].result?.id,
        dto: createdLessons[0].dto,
        allCreatedLessons: createdLessons
      }

      // Генерируем рекомендации аудиторий
      generateRoomRecommendations(lessonData)

      // Показываем модальное окно рекомендаций
      showRoomModal.value = true
    }

    // Показываем ошибки для конкретных временных слотов
    if (failedLessons.length > 0) {
      failedLessons.forEach((failed) => {
        const timeInfo = `${failed.dayName}, ${failed.timeSlot.time}`

        // Проверяем специфические типы ошибок
        if (failed.error.includes('Professor is busy')) {
          showError(`Викладач зайнятий у часовому слоті: ${timeInfo}`, 'Конфлікт розкладу')
        }
        else if (failed.error.includes('Room is occupied')) {
          showError(`Аудиторія зайнята у часовому слоті: ${timeInfo}`, 'Конфлікт розкладу')
        }
        else {
          showError(`Помилка у часовому слоті ${timeInfo}: ${failed.error}`, 'Помилка створення')
        }
      })
    }

    // Закрываем модальное окно создания
    closeCreateModal()

    // Очищаем выделение
    globalDragSelection.clearSelection()

    // Показываем итоговое сообщение
    const totalRequested = createdLessons.length + failedLessons.length
    console.log(`✅ Completed: ${createdLessons.length}/${totalRequested} lessons created successfully`)
  }
  catch (error) {
    console.error('Error creating lessons:', error)
    showError('Критична помилка при створенні занять', 'Помилка')
  }
}

const generateRoomRecommendations = (lessonData) => {
  // Простая логика рекомендаций на основе типа занятия
  let filteredRooms = []

  if (lessonData.subject.type === 'LECTURE') {
    filteredRooms = rooms.value.filter(room => room.type === 'LECTURE' || room.capacity >= 40)
  }
  else if (lessonData.subject.type === 'LABORATORY') {
    filteredRooms = rooms.value.filter(room => room.type === 'LABORATORY')
  }
  else {
    filteredRooms = rooms.value.filter(room => room.type === 'PRACTICE' && room.capacity >= 20)
  }

  // Добавляем случайный рейтинг для демонстрации
  recommendedRooms.value = filteredRooms.slice(0, 3).map(room => ({
    ...room,
    rating: Math.floor(Math.random() * 30) + 70, // 70-100%
    reason: getRecommendationReason(room, lessonData.subject.type)
  }))
}

const getRecommendationReason = (room, subjectType) => {
  if (subjectType === 'LECTURE' && room.type === 'LECTURE') {
    return 'Спеціалізована лекційна аудиторія'
  }
  if (subjectType === 'LABORATORY' && room.type === 'LABORATORY') {
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

const handleRoomConfirm = async(selectedRoom) => {
  console.log('Room confirmed:', selectedRoom)

  try {
    // Обновляем аудиторию в созданном занятии через scheduleStore
    if (createdLessonData.value && createdLessonData.value.entryId) {
      // Создаем DTO для обновления аудитории
      const updateDto = {
        ...createdLessonData.value.dto,
        roomIds: [selectedRoom.id]
      }
      await scheduleStore.update(createdLessonData.value.entryId, updateDto)
    }
  }
  catch (error) {
    console.error('Error updating room:', error)
  }

  closeRoomModal()
}

// Добавляем новую функцию для тестирования модального окна
const _testCreateModal = () => {
  // Симулируем выбор одной ячейки
  const testCells = ['day-1-slot-1-group-1']
  globalDragSelection.setSelection(testCells)
  showCreateModal.value = true
}

const _testMultipleTimeSlots = () => {
  // Симулируем выбор прямоугольной области: 2 временных слота × 2 группы
  const testCells = [
    'day-1-slot-1-group-1',
    'day-1-slot-2-group-2',
    'day-2-slot-1-group-3',
    'day-2-slot-2-group-4'
  ]
  globalDragSelection.setSelection(testCells)
  showCreateModal.value = true
  console.log('🧪 Testing multiple time slots:', testCells)
}

const _debugAvailableCells = () => {
  const available = globalDragSelection.availableCells.value
  console.log('Available cells count:', available.length)
  console.log('Available cells sample:', available.slice(0, 10))
}

const _testDragSelection = () => {
  const testCells = ['day-1-slot-1-group-1', 'day-1-slot-2-group-2']
  globalDragSelection.setSelection(testCells)
  console.log('🧪 Drag selection test - Selected cells:', globalDragSelection.selectedCells.value)
}

// Отладочная функция для проверки состояния drag selection
const _debugDragSelection = () => {
  console.log('🔍 Drag selection state:')
  console.log('  - Available cells:', globalDragSelection.availableCells.value.length)
  console.log('  - Selected cells:', globalDragSelection.selectedCells.value.size)
  console.log('  - Is selecting:', globalDragSelection.isSelecting.value)
  console.log('  - Can edit schedule:', canEditSchedule.value)
  console.log('  - Available cells sample:', globalDragSelection.availableCells.value.slice(0, 5))
}

// Добавляем в window для тестирования
if (typeof window !== 'undefined') {
  window._debugDragSelection = _debugDragSelection
}

// Инициализация данных (из indexNew.vue)
onMounted(async() => {
  try {
    console.log('🚀 Starting data loading...')

    // Проверяем авторизацию
    if (!authStore.token) {
      await navigateTo('/login')
      return
    }

    // Загружаем информацию о пользователе если её нет
    if (!authStore.user) {
      await authStore.fetchMe()
    }

    // Загружаем все данные параллельно
    await Promise.all([
      departmentStore.fetchDepartments(),
      groupStore.fetchGroups(),
      professorStore.fetchProfessors(),
      subjectStore.fetchSubjects(),
      roomStore.fetchRooms(),
      scheduleStore.fetchAll(),
      // Загружаем студентов для определения группы текущего студента
      isStudent.value ? studentStore.fetchStudents() : Promise.resolve()
    ])

    console.log('✅ All data loaded')
    console.log('🔍 Current user:', authStore.user)
    console.log('🔍 User roles:', authStore.roles)
    console.log('🔍 Is student:', isStudent.value)
    console.log('🔍 Can edit schedule:', canEditSchedule.value)
    console.log('🔍 Current student data:', currentStudent.value)

    // Устанавливаем первый департамент по умолчанию если пользователь может редактировать
    if (departments.value.length > 0 && canEditSchedule.value) {
      selectedDepartmentId.value = departments.value[0].id
      console.log('🎯 Selected department ID:', selectedDepartmentId.value)
      console.log('🎯 Selected department:', departments.value[0])
    }
    else if (departments.value.length > 0 && isStudent.value) {
      // Для студентов определяем кафедру по их группе
      if (currentStudent.value?.group?.id) {
        const studentGroup = groupStore.groups.find(g => g.id === currentStudent.value.group.id)
        if (studentGroup) {
          const departmentId = studentGroup.department?.id || studentGroup.departmentId
          if (departmentId) {
            selectedDepartmentId.value = departmentId
            console.log('🎯 Student department set by group:', departmentId)
          }
          else {
            // Fallback к первой кафедре
            selectedDepartmentId.value = departments.value[0].id
            console.log('🎯 Student view - fallback to first department:', departments.value[0])
          }
        }
        else {
          selectedDepartmentId.value = departments.value[0].id
          console.log('🎯 Student group not found, fallback to first department')
        }
      }
      else {
        selectedDepartmentId.value = departments.value[0].id
        console.log('🎯 No student group info, fallback to first department')
      }
    }
    else {
      console.warn('⚠️ No departments found!')
    }
  }
  catch (error) {
    console.error('❌ Error loading initial data:', error)
  }
})

const handleLessonEdit = async(editedLessonData) => {
  console.log('Editing lesson:', editedLessonData)

  const { error: showError, success: showSuccess } = useShowNotivue()

  try {
    // Найти ID оригинального занятия из scheduleData
    const originalCell = editingLessonData.value
    const cellKey = originalCell.cellId

    // Парсим cellId для получения информации о времени и дне
    const match = cellKey.match(/day-(\d+)-slot-(\d+)-group-(\d+)/)
    if (!match) {
      throw new Error('Не вдалося розпарсити ідентифікатор ячейки')
    }

    const dayId = Number.parseInt(match[1])
    const timeSlotId = Number.parseInt(match[2])
    const groupId = Number.parseInt(match[3])

    // Получаем временной слот
    const timeSlot = timeSlots.value.find(slot => slot.id === timeSlotId)
    if (!timeSlot) {
      throw new Error('Часовий слот не знайдено')
    }

    const [startTimeStr, endTimeStr] = timeSlot.time.split('-')
    const [startHour, startMinute] = startTimeStr.split(':').map(Number)
    const [endHour, endMinute] = endTimeStr.split(':').map(Number)

    // Преобразуем день в dayOfWeek
    const dayOfWeekMapping = {
      1: 'MONDAY',
      2: 'TUESDAY',
      3: 'WEDNESDAY',
      4: 'THURSDAY',
      5: 'FRIDAY',
      6: 'SATURDAY',
      7: 'SUNDAY'
    }
    const dayOfWeek = dayOfWeekMapping[dayId] || 'MONDAY'

    // Генерируем дату
    const today = new Date()
    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1))
    const lessonDate = new Date(currentWeekStart)
    lessonDate.setDate(currentWeekStart.getDate() + dayId - 1)
    const dates = [lessonDate.toISOString().split('T')[0]]

    // Создаем DTO для обновления
    const updateDto = {
      type: editedLessonData.subject.type,
      startTime: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`,
      endTime: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`,
      isOnline: editedLessonData.isOnline || false,
      roomIds: [editedLessonData.room.id],
      professorId: editedLessonData.professor.id,
      groupIds: [groupId],
      subgroupIds: [],
      dayOfWeek: dayOfWeek,
      dates: dates,
      subjectId: editedLessonData.subject.id
    }

    console.log('Update DTO:', updateDto)

    // Находим ID занятия для обновления
    const lessonId = originalCell.lessonData.id

    if (!lessonId) {
      throw new Error('ID заняття не знайдено')
    }

    // Обновляем занятие
    await scheduleStore.update(lessonId, updateDto)

    showSuccess('Заняття успішно оновлено')
    closeEditModal()

    // Перезагружаем данные расписания
    await scheduleStore.fetchAll()
  }
  catch (error) {
    console.error('Error editing lesson:', error)
    showError('Помилка при редагуванні заняття', 'Помилка')
  }
}

const handleLessonDelete = async() => {
  console.log('Deleting lesson:', deletingLessonData.value)

  const { error: showError, success: showSuccess } = useShowNotivue()

  try {
    const originalCell = deletingLessonData.value

    // Находим ID занятия для удаления
    const lessonId = originalCell.lessonData.id

    if (!lessonId) {
      throw new Error('ID заняття не знайдено')
    }

    // Удаляем занятие
    await scheduleStore.remove(lessonId)

    showSuccess('Заняття успішно видалено')
    closeDeleteModal()

    // Перезагружаем данные расписания
    await scheduleStore.fetchAll()
  }
  catch (error) {
    console.error('Error deleting lesson:', error)
    showError('Помилка при видаленні заняття', 'Помилка')
  }
}
</script>
