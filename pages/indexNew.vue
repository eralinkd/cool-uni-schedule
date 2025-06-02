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

    <!-- Подробная отладочная информация для ScheduleTable -->
    <div class="p-4 bg-green-50 border border-green-200 rounded text-sm">
      <h4 class="font-medium text-green-800 mb-2">🔍 Отладка передачи данных в ScheduleTable:</h4>
      <div class="space-y-1 text-xs">
        <p><strong>filteredGroups.length:</strong> {{ filteredGroups.length }}</p>
        <p><strong>timeSlots.length:</strong> {{ timeSlots.length }}</p>
        <p><strong>scheduleData keys:</strong> {{ Object.keys(scheduleData).length }}</p>

        <div v-if="filteredGroups.length > 0" class="mt-2">
          <p><strong>Детали групп:</strong></p>
          <div
            v-for="(group, index) in filteredGroups"
            :key="group.id"
            class="ml-2"
          >
            <p>{{ index + 1 }}. {{ group.name }} (ID: {{ group.id }})</p>
            <p class="ml-4 text-gray-600">Подгруппы: {{ group.subgroups?.length || 0 }}</p>
            <div v-if="group.subgroups?.length" class="ml-6">
              <span
                v-for="sub in group.subgroups"
                :key="sub.id"
                class="inline-block mr-2"
              >
                {{ sub.name }} ({{ sub.id }})
              </span>
            </div>
          </div>
        </div>

        <div v-else class="mt-2 text-red-600">
          <p><strong>⚠️ Группы отсутствуют!</strong> Проверьте:</p>
          <ul class="ml-4 list-disc">
            <li>Загружены ли группы из API</li>
            <li>Правильно ли работает фильтрация по департаменту</li>
            <li>Есть ли группы для выбранного курса</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Дополнительная отладочная информация для ScheduleTable -->
    <div v-if="filteredGroups.length === 0" class="p-4 bg-red-50 border border-red-200 rounded text-sm">
      <h4 class="font-medium text-red-800 mb-2">⚠️ Нет групп для отображения</h4>
      <p class="text-red-700">
        Проверьте: выбран ли департамент, есть ли группы для выбранного департамента и курса.
      </p>
      <details class="mt-2">
        <summary class="cursor-pointer text-red-600">
          Детали отладки
        </summary>
        <pre class="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">{{ {
          selectedDepartmentId,
          selectedCourse,
          totalGroups: groupStore.groups?.length || 0,
          filteredByDepartment: groups.length,
          filteredByourse: filteredGroups.length,
          allDepartments: departments.map(d => ({ id: d.id, name: d.name })),
        } }}</pre>
      </details>
    </div>

    <!-- Дебаг информация -->
    <div class="p-2 bg-yellow-50 border rounded text-xs">
      <p>
        <strong>Департамент:</strong> {{ selectedDepartmentId }},
        <strong>Курс:</strong> {{ selectedCourse }}
      </p>
      <p>
        <strong>Данные:</strong>
        departments={{ departments.length }},
        groups={{ groups.length }},
        filteredGroups={{ filteredGroups.length }},
        subjects={{ subjects.length }},
        professors={{ professors.length }},
        rooms={{ rooms.length }},
        scheduleEntries={{ Object.keys(scheduleData).length }}
      </p>
      <p v-if="filteredGroups.length > 0">
        <strong>Группы:</strong> {{ filteredGroups.map(g => g.name).join(', ') }}
      </p>
      <p v-if="Object.keys(scheduleData).length > 0">
        <strong>Расписание (первые 3):</strong>
        <span
          v-for="(entry, key, index) in scheduleData"
          :key="key"
          class="block text-xs"
        >
          <span v-if="index < 3">{{ key }}: {{ entry.subject }} ({{ entry.professor }})</span>
        </span>
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
      <div class="space-x-2">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
          @click="testCreateModal"
        >
          Тест створення заняття
        </button>
        <button
          class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm font-medium"
          @click="debugAvailableCells"
        >
          Показати доступні ячейки
        </button>
        <button
          class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm font-medium"
          @click="testDragSelection"
        >
          Тест драг селекту
        </button>
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
import { computed, onMounted, ref, watch } from 'vue'

const { getCurrentWeekNumber, getWeekInfo } = useAcademicWeeks()

const globalDragSelection = useDragSelection()
provide('dragSelection', globalDragSelection)

// Инициализация stores
const scheduleStore = useScheduleStore()
const groupStore = useGroupStore()
const departmentStore = useDepartmentStore()
const professorStore = useProfessorStore()
const subjectStore = useSubjectStore()
const roomStore = useRoomStore()

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

// Данные из stores
const departments = computed(() => departmentStore.departments)
const subjects = computed(() => subjectStore.subjects)
const rawProfessors = computed(() => professorStore.professors)
const rooms = computed(() => roomStore.rooms)

// Преобразуем данные преподавателей для совместимости с CreateLessonModal
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

// Группы фильтруем через метод store, но с исправленной логикой
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
const showRoomModal = ref(false)
const createdLessonData = ref(null)
const recommendedRooms = ref([])

// Фильтрованные группы по курсу с генерацией подгрупп
const filteredGroups = computed(() => {
  if (!Array.isArray(groups.value)) {
    console.log('Groups is not an array:', groups.value)
    return []
  }

  console.log('Groups before course filter:', groups.value)

  // Проверяем, есть ли поле course у групп
  const sampleGroup = groups.value[0]
  if (sampleGroup) {
    console.log('Sample group structure:', sampleGroup)
    console.log('Available fields:', Object.keys(sampleGroup))
  }

  // Временно отключаем фильтрацию по курсу если поля course нет
  let courseFiltered = groups.value
  if (sampleGroup && 'course' in sampleGroup) {
    courseFiltered = groups.value.filter(group => group.course === selectedCourse.value)
    console.log('Filtered by course:', courseFiltered)
  }
  else {
    console.log('No course field found, showing all groups from department')
  }

  // Убеждаемся, что у каждой группы есть подгруппы
  const withSubgroups = courseFiltered.map((group) => {
    console.log(`Processing group ${group.name}, current subgroups:`, group.subgroups)

    if (!group.subgroups || group.subgroups.length === 0) {
      const newGroup = {
        ...group,
        subgroups: [
          { id: `${group.id}-1`, name: 'підгрупа 1' },
          { id: `${group.id}-2`, name: 'підгрупа 2' },
          { id: `${group.id}-3`, name: 'підгрупа 3' },
          { id: `${group.id}-4`, name: 'підгрупа 4' },
          { id: `${group.id}-5`, name: 'підгрупа 5' }
        ]
      }
      console.log(`Generated subgroups for ${group.name}:`, newGroup.subgroups)
      return newGroup
    }
    console.log(`Group ${group.name} already has subgroups:`, group.subgroups)
    return group
  })

  console.log('Final filtered groups with subgroups:', withSubgroups)
  return withSubgroups
})

// Отслеживаем изменения в фильтрованных группах
watch(filteredGroups, (newGroups, oldGroups) => {
  // Очищаем выделение при изменении списка групп
  globalDragSelection.clearSelection()

  // Не очищаем ячейки при первом запуске (когда oldGroups undefined)
  if (!oldGroups) {
    console.log('First filteredGroups load, skipping cell clearing')
    return
  }

  // Очищаем зарегистрированные ячейки только если действительно изменился состав групп
  const oldGroupIds = oldGroups?.map(g => g.id).sort().join(',') || ''
  const newGroupIds = newGroups?.map(g => g.id).sort().join(',') || ''

  if (oldGroupIds !== newGroupIds) {
    console.log('Groups composition changed, clearing available cells')
    console.log('Old group IDs:', oldGroupIds)
    console.log('New group IDs:', newGroupIds)
    globalDragSelection.clearAvailableCells()
  }
  else {
    console.log('Groups composition unchanged, keeping available cells')
  }
}, { deep: true })

const timeSlots = ref([
  { id: 1, time: '9:00-10:20', period: 1 },
  { id: 2, time: '10:30-11:50', period: 2 },
  { id: 3, time: '12:10-13:30', period: 3 },
  { id: 4, time: '13:40-15:00', period: 4 },
  { id: 5, time: '15:10-16:30', period: 5 }
])

// Расписание из scheduleStore
const scheduleData = computed(() => scheduleStore.flatMap)

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

const handleLessonCreate = async(lessonData) => {
  console.log('Creating lesson:', lessonData)

  try {
    // Преобразуем выбранные ячейки в структуру для API
    const selectedCells = lessonData.selectedCells || []

    // Парсим выбранные ячейки для получения данных о группах, днях и времени
    const parsedCells = selectedCells.map((cellId) => {
      const match = cellId.match(/day-(\d+)-slot-(\d+)-group-(\d+)-subgroup-(\d+)/)
      if (match) {
        return {
          dayId: Number.parseInt(match[1]),
          timeSlotId: Number.parseInt(match[2]),
          groupId: Number.parseInt(match[3]),
          subgroupId: Number.parseInt(match[4])
        }
      }
      return null
    }).filter(Boolean)

    if (parsedCells.length === 0) {
      throw new Error('Не вдалося розпарсити вибрані ячейки')
    }

    // Получаем уникальные группы и подгруппы
    const uniqueGroups = [...new Set(parsedCells.map(cell => cell.groupId))]
    const uniqueSubgroups = [...new Set(parsedCells.map(cell => cell.subgroupId))]
    const uniqueTimeSlots = [...new Set(parsedCells.map(cell => cell.timeSlotId))]
    const uniqueDays = [...new Set(parsedCells.map(cell => cell.dayId))]

    // Преобразуем timeSlot в startTime/endTime
    const timeSlot = timeSlots.value.find(slot => slot.id === uniqueTimeSlots[0])
    const [startTimeStr, endTimeStr] = timeSlot.time.split('-')
    const [startHour, startMinute] = startTimeStr.split(':').map(Number)
    const [endHour, endMinute] = endTimeStr.split(':').map(Number)

    // Преобразуем дни в даты (пример - текущая неделя)
    const today = new Date()
    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1)) // Понедельник
    const dates = uniqueDays.map((dayId) => {
      const lessonDate = new Date(currentWeekStart)
      lessonDate.setDate(currentWeekStart.getDate() + dayId - 1) // dayId: 1=понедельник, 2=вторник, etc.
      return lessonDate.toISOString().split('T')[0] // YYYY-MM-DD формат
    })

    // Создаем DTO для API согласно новому формату
    const dto = {
      type: lessonData.subject.type, // "LECTURE", "PRACTICE", "LABORATORY"
      startTime: {
        hour: startHour,
        minute: startMinute,
        second: 0,
        nano: 0
      },
      endTime: {
        hour: endHour,
        minute: endMinute,
        second: 0,
        nano: 0
      },
      isOnline: lessonData.isOnline || false,
      roomIds: [lessonData.room.id],
      professorId: lessonData.professor.id,
      groupIds: uniqueGroups,
      subgroupIds: uniqueSubgroups.filter(id => id !== 0), // исключаем нулевые подгруппы
      dates: dates,
      subjectId: lessonData.subject.id
    }

    console.log('DTO for API:', dto)

    // Используем scheduleStore для создания занятия
    const result = await scheduleStore.create(dto)

    // Сохраняем данные созданного занятия для модального окна рекомендаций
    createdLessonData.value = {
      ...lessonData,
      entryId: result?.id, // ID созданной записи если возвращается API
      dto
    }

    // Генерируем рекомендации аудиторий
    generateRoomRecommendations(lessonData)

    // Закрываем модальное окно создания
    closeCreateModal()

    // Показываем модальное окно рекомендаций
    showRoomModal.value = true

    // Очищаем выделение
    globalDragSelection.clearSelection()
  }
  catch (error) {
    console.error('Error creating lesson:', error)
    // Можно добавить уведомление об ошибке для пользователя
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
const testCreateModal = () => {
  // Используем реальные группы для тестирования
  if (filteredGroups.value.length === 0) {
    console.warn('No filtered groups available for testing')
    alert('Нет доступных групп для тестирования. Выберите департамент и убедитесь, что группы загружены.')
    return
  }

  const firstGroup = filteredGroups.value[0]
  const firstSubgroup = firstGroup.subgroups?.[0]

  if (!firstSubgroup) {
    console.warn('No subgroups available for testing')
    alert('У группы нет подгрупп для тестирования.')
    return
  }

  console.log('Testing with group:', firstGroup)
  console.log('Testing with subgroup:', firstSubgroup)

  // Симулируем выбранные ячейки для тестирования с реальными ID
  const testCells = [
    `day-1-slot-1-group-${firstGroup.id}-subgroup-${firstSubgroup.id}`,
    `day-1-slot-2-group-${firstGroup.id}-subgroup-${firstSubgroup.id}`
  ]

  // Очищаем предыдущее выделение
  globalDragSelection.clearSelection()

  // Добавляем тестовые ячейки в выделение
  testCells.forEach((cellId) => {
    globalDragSelection.addCellToSelection(cellId)
  })

  // Открываем модальное окно
  showCreateModal.value = true
  console.log('Тестирование модального окна с ячейками:', testCells)
  console.log('Доступные данные:', {
    subjects: subjects.value.length,
    professors: professors.value.length,
    rooms: rooms.value.length
  })
}

// Функция для отладки доступных ячеек
const debugAvailableCells = () => {
  console.log('=== DEBUG AVAILABLE CELLS ===')
  console.log('Filtered groups:', filteredGroups.value)

  // Проверяем, какие ячейки должны быть зарегистрированы
  const expectedCells = []
  filteredGroups.value.forEach((group) => {
    group.subgroups?.forEach((subgroup) => {
      for (let day = 1; day <= 5; day++) {
        for (let slot = 1; slot <= 5; slot++) {
          expectedCells.push(`day-${day}-slot-${slot}-group-${group.id}-subgroup-${subgroup.id}`)
        }
      }
    })
  })

  console.log('Expected cells count:', expectedCells.length)
  console.log('Expected cells (first 10):', expectedCells.slice(0, 10))

  // Проверяем какие ячейки отсутствуют
  const missing = expectedCells.filter(cellId => !globalDragSelection.isCellAvailable(cellId))
  console.log('Missing cells count:', missing.length)
  console.log('Missing cells (first 10):', missing.slice(0, 10))
}

// Инициализация данных
onMounted(async() => {
  try {
    console.log('🚀 Starting data loading...')

    // Загружаем все данные параллельно
    await Promise.all([
      departmentStore.fetchDepartments(),
      groupStore.fetchGroups(),
      professorStore.fetchProfessors(),
      subjectStore.fetchSubjects(),
      roomStore.fetchRooms(),
      scheduleStore.fetchAll()
    ])

    console.log('✅ All data loaded')
    console.log('Departments:', departments.value)
    console.log('All groups from store:', groupStore.groups)

    // Устанавливаем первый департамент по умолчанию
    if (departments.value.length > 0) {
      selectedDepartmentId.value = departments.value[0].id
      console.log('🎯 Selected department ID:', selectedDepartmentId.value)
      console.log('🎯 Selected department:', departments.value[0])
    }
    else {
      console.warn('⚠️ No departments found!')
    }
  }
  catch (error) {
    console.error('❌ Error loading initial data:', error)
  }
})
</script>
