<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Видалити заняття</h2>
        </div>

        <div class="px-6 py-4">
          <div class="mb-4">
            <p class="text-gray-700 mb-2">Ви впевнені, що хочете видалити це заняття?</p>

            <!-- Информация о удаляемом занятии -->
            <div class="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 class="font-medium text-red-900 mb-2">Деталі заняття:</h3>
              <div class="text-sm text-red-700 space-y-1">
                <p><strong>Час і місце:</strong> {{ deleteInfo }}</p>
                <p v-if="lessonData?.lessonData?.subject">
                  <strong>Предмет:</strong> {{ lessonData.lessonData.subject }}
                </p>
                <p v-if="lessonData?.lessonData?.professor">
                  <strong>Викладач:</strong> {{ lessonData.lessonData.professor }}
                </p>
                <p v-if="lessonData?.lessonData?.room">
                  <strong>Аудиторія:</strong> {{ lessonData.lessonData.room }}
                </p>
              </div>
            </div>
          </div>

          <p class="text-sm text-gray-600">
            <strong>Увага!</strong> Ця дія незворотна. Заняття буде повністю видалено з розкладу.
          </p>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            @click="$emit('close')"
          >
            Скасувати
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            @click="handleConfirm"
          >
            Видалити заняття
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  lessonData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

// Информация о удаляемом занятии
const deleteInfo = computed(() => {
  const cellData = props.lessonData?.cellData
  if (!cellData) return 'Невідома ячейка'

  const dayNames = ['', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя']
  const dayName = dayNames[cellData.day?.id] || 'Невідомий день'
  const timeSlot = cellData.timeSlot?.time || 'Невідомий час'
  const groupName = cellData.group?.name || 'Невідома група'

  return `${dayName}, ${timeSlot}, група ${groupName}`
})

const handleConfirm = () => {
  emit('confirm')
}
</script>
