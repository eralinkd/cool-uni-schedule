<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Створити заняття</h2>
          <button
            class="text-gray-400 hover:text-gray-600"
            @click="$emit('close')"
          >
            <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
          </button>
        </div>

        <div class="px-6 py-4">
          <!-- Информация о выбранных ячейках -->
          <div class="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 class="font-medium text-blue-900 mb-2">Вибрані ячейки:</h3>
            <p class="text-sm text-blue-700">{{ selectedCellsInfo }}</p>
          </div>

          <!-- Форма создания занятия -->
          <div class="space-y-6">
            <!-- Выбор предмета -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Предмет *
              </label>
              <select
                v-model="selectedSubject"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">
                  Оберіть предмет
                </option>
                <option
                  v-for="subject in subjects"
                  :key="subject.id"
                  :value="subject"
                >
                  {{ subject.name }} ({{ subject.type }})
                </option>
              </select>
            </div>

            <!-- Выбор преподавателя -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Викладач *
              </label>
              <select
                v-model="selectedProfessor"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="!selectedSubject"
                required
              >
                <option value="">
                  Оберіть викладача
                </option>
                <option
                  v-for="professor in filteredProfessors"
                  :key="professor.id"
                  :value="professor"
                >
                  {{ professor.name }}
                </option>
              </select>
              <p v-if="!selectedSubject" class="text-xs text-gray-500 mt-1">
                Спочатку оберіть предмет
              </p>
            </div>

            <!-- Выбор аудитории -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Аудиторія *
              </label>
              <select
                v-model="selectedRoom"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">
                  Оберіть аудиторію
                </option>
                <option
                  v-for="room in recommendedRoomsForType"
                  :key="room.id"
                  :value="room"
                >
                  {{ room.name }} ({{ room.capacity }} місць, {{ room.type }})
                </option>
              </select>
            </div>

            <!-- Онлайн опции -->
            <div class="space-y-3">
              <div class="flex items-center">
                <input
                  id="isOnline"
                  v-model="isOnline"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="isOnline" class="ml-2 block text-sm text-gray-700">
                  Онлайн заняття
                </label>
              </div>

              <div v-if="isOnline" class="ml-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Посилання
                </label>
                <input
                  v-model="onlineLink"
                  type="url"
                  placeholder="https://zoom.us/..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Дополнительные даты -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Додаткові дати (опціонально)
              </label>
              <input
                v-model="additionalDates"
                type="text"
                placeholder="напр. 26.05 311 ауд."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            @click="$emit('close')"
          >
            Скасувати
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            :disabled="!isFormValid"
            @click="handleSave"
          >
            Створити
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  selectedCells: {
    type: Array,
    required: true
  },
  subjects: {
    type: Array,
    required: true
  },
  professors: {
    type: Array,
    required: true
  },
  rooms: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

// Форма данных
const selectedSubject = ref('')
const selectedProfessor = ref('')
const selectedRoom = ref('')
const isOnline = ref(false)
const onlineLink = ref('')
const additionalDates = ref('')

// Информация о выбранных ячейках
const selectedCellsInfo = computed(() => {
  const cellCount = props.selectedCells.length
  const cellDetails = props.selectedCells.map((cellId) => {
    const match = cellId.match(/day-(\d+)-slot-(\d+)-group-(\d+)-subgroup-(\d+)/)
    if (match) {
      const dayNames = ['', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця']
      const timeSlots = ['', '9:00-10:20', '10:30-11:50', '12:10-13:30', '13:40-15:00', '15:10-16:30']
      return `${dayNames[Number.parseInt(match[1])]} ${timeSlots[Number.parseInt(match[2])]}`
    }
    return cellId
  })

  return `${cellCount} ячейок: ${cellDetails.join(', ')}`
})

// Фильтрованные преподаватели по выбранному предмету
const filteredProfessors = computed(() => {
  if (!selectedSubject.value) return []
  return props.professors.filter(prof =>
    prof.subjects.includes(selectedSubject.value.id)
  )
})

// Рекомендованные аудитории по типу занятия
const recommendedRoomsForType = computed(() => {
  if (!selectedSubject.value) return props.rooms

  let filteredRooms = []
  if (selectedSubject.value.type === 'Лекція') {
    filteredRooms = props.rooms.filter(room => room.type === 'лекційна' || room.capacity >= 40)
  }
  else if (selectedSubject.value.type === 'Лабораторна') {
    filteredRooms = props.rooms.filter(room => room.type === 'комп\'ютерна')
  }
  else {
    filteredRooms = props.rooms.filter(room => room.type === 'звичайна' && room.capacity >= 20)
  }

  // Если нет подходящих, показываем все
  return filteredRooms.length > 0 ? filteredRooms : props.rooms
})

// Валидация формы
const isFormValid = computed(() => {
  return selectedSubject.value && selectedProfessor.value && selectedRoom.value
})

// Обработка сохранения
const handleSave = () => {
  if (!isFormValid.value) return

  const lessonData = {
    subject: selectedSubject.value,
    professor: selectedProfessor.value,
    room: selectedRoom.value,
    isOnline: isOnline.value,
    onlineLink: onlineLink.value,
    additionalDates: additionalDates.value,
    selectedCells: props.selectedCells
  }

  emit('save', lessonData)
}

// Автоматически выбираем первого подходящего преподавателя
watch(selectedSubject, (newSubject) => {
  if (newSubject && filteredProfessors.value.length > 0) {
    selectedProfessor.value = filteredProfessors.value[0]
  }
  else {
    selectedProfessor.value = ''
  }
})

// Автоматически выбираем первую подходящую аудиторию
watch([selectedSubject, recommendedRoomsForType], ([newSubject, newRooms]) => {
  if (newSubject && newRooms.length > 0) {
    selectedRoom.value = newRooms[0]
  }
})
</script>
