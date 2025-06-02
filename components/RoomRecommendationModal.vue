<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Рекомендовані аудиторії</h2>
          <button
            class="text-gray-400 hover:text-gray-600"
            @click="$emit('close')"
          >
            <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
          </button>
        </div>

        <div class="px-6 py-4">
          <!-- Информация о созданном занятии -->
          <div class="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 class="font-medium text-green-900 mb-2">✅ Заняття створено успішно!</h3>
            <div class="text-sm text-green-700 space-y-1">
              <p><strong>Предмет:</strong> {{ lessonData?.subject?.name }} ({{ lessonData?.subject?.type }})</p>
              <p><strong>Викладач:</strong> {{ lessonData?.professor?.name }}</p>
              <p><strong>Поточна аудиторія:</strong> {{ lessonData?.room?.name }}</p>
              <p v-if="lessonData?.isOnline" class="text-blue-600">
                <strong>Онлайн:</strong> {{ lessonData.onlineLink }}
              </p>
            </div>
          </div>

          <!-- Рекомендации аудиторий -->
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Альтернативні аудиторії
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              На основі типу заняття та кількості студентів ми знайшли кращі варіанти аудиторій:
            </p>

            <div v-if="recommendedRooms.length === 0" class="text-center py-8 text-gray-500">
              <UIcon name="i-heroicons-building-office" class="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Немає альтернативних рекомендацій</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="room in recommendedRooms"
                :key="room.id"
                class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                :class="{
                  'border-blue-500 bg-blue-50': selectedRecommendation?.id === room.id,
                }"
                @click="selectedRecommendation = room"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h4 class="font-medium text-gray-900">{{ room.name }}</h4>
                      <div class="flex items-center space-x-1">
                        <div class="flex items-center">
                          <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-400" />
                          <span class="text-sm font-medium text-gray-700 ml-1">{{ room.rating }}%</span>
                        </div>
                      </div>
                    </div>

                    <div class="text-sm text-gray-600 space-y-1">
                      <p><strong>Тип:</strong> {{ room.type }}</p>
                      <p><strong>Місткість:</strong> {{ room.capacity }} місць</p>
                      <p><strong>Рекомендація:</strong> {{ room.reason }}</p>
                    </div>
                  </div>

                  <div class="ml-4">
                    <div
                      class="w-16 h-3 bg-gray-200 rounded-full overflow-hidden"
                      :title="`Відповідність: ${room.rating}%`"
                    >
                      <div
                        class="h-full rounded-full transition-all duration-300"
                        :class="{
                          'bg-red-500': room.rating < 75,
                          'bg-yellow-500': room.rating >= 75 && room.rating < 90,
                          'bg-green-500': room.rating >= 90,
                        }"
                        :style="{ width: `${room.rating}%` }"
                      />
                    </div>
                  </div>
                </div>

                <!-- Индикатор выбора -->
                <div v-if="selectedRecommendation?.id === room.id" class="mt-3 pt-3 border-t border-blue-200">
                  <div class="flex items-center text-blue-600 text-sm">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 mr-1" />
                    Обрано для заміни
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Дополнительная информация -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-2">💡 Підказка</h4>
            <p class="text-sm text-gray-600">
              Рейтинг аудиторії розраховується на основі типу заняття, місткості, доступності обладнання
              та поточного завантаження. Ви можете залишити поточну аудиторію або обрати одну з рекомендованих.
            </p>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            @click="$emit('close')"
          >
            Залишити поточну
          </button>

          <div class="flex space-x-3">
            <button
              v-if="selectedRecommendation"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              @click="confirmRecommendation"
            >
              Змінити на {{ selectedRecommendation.name }}
            </button>
            <button
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              @click="$emit('close')"
            >
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  recommendedRooms: {
    type: Array,
    default: () => []
  },
  lessonData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'confirm'])

const selectedRecommendation = ref(null)

const confirmRecommendation = () => {
  if (selectedRecommendation.value) {
    emit('confirm', selectedRecommendation.value)
  }
}

// Автоматически выбираем лучшую рекомендацию
onMounted(() => {
  if (props.recommendedRooms.length > 0) {
    const bestRoom = props.recommendedRooms.reduce((best, current) =>
      current.rating > best.rating ? current : best
    )
    selectedRecommendation.value = bestRoom
  }
})
</script>
