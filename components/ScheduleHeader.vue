<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
    <!-- Основная информация -->
    <div class="p-4 bg-yellow-50 border-b border-gray-200 rounded-t-lg">
      <div class="flex flex-col space-y-2">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-semibold text-gray-900">
            ФІТ. Розклад {{ semester }}
          </h1>
          <div class="flex items-center space-x-2">
            <UButton
              variant="ghost"
              size="sm"
              :disabled="!canNavigatePrev"
              @click="$emit('week-change', 'prev')"
            >
              <UIcon name="i-heroicons-chevron-left" />
            </UButton>
            <UButton
              variant="ghost"
              size="sm"
              :disabled="!canNavigateNext"
              @click="$emit('week-change', 'next')"
            >
              <UIcon name="i-heroicons-chevron-right" />
            </UButton>
          </div>
        </div>

        <div class="text-sm text-gray-600">
          <span class="inline-flex items-center space-x-1">
            <span>{{ week.number }} тиждень</span>
            <span>({{ week.start }}-{{ week.end }}),</span>
            <span class="font-medium">{{ week.type }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Селекторы кафедры и курса -->
    <div class="p-3 bg-gray-50 border-b border-gray-200">
      <div class="flex items-center gap-4 text-sm">
        <div class="flex items-center gap-2">
          <label class="text-gray-600">
            Кафедра:
          </label>
          <USelect
            :model-value="props.selectedDepartment"
            :options="departmentOptions"
            size="sm"
            class="w-48"
            @update:model-value="$emit('department-change', $event)"
          />
        </div>

        <div class="flex items-center gap-2">
          <label class="text-gray-600">
            Курс:
          </label>
          <USelect
            :model-value="props.selectedCourse"
            :options="courseOptions"
            size="sm"
            class="w-24"
            @update:model-value="$emit('course-change', $event)"
          />
        </div>
      </div>
    </div>

    <!-- Навигация по специальностям -->
    <div class="p-3 bg-gray-50 border-b border-gray-200">
      <div class="flex flex-wrap gap-2 text-sm">
        <UButton
          v-for="spec in specialties"
          :key="spec.code"
          :variant="spec.active ? 'solid' : 'ghost'"
          size="xs"
          class="text-blue-600 hover:text-blue-800"
          @click="$emit('specialty-change', spec.code)"
        >
          {{ spec.name }}
        </UButton>
      </div>
    </div>

    <!-- Курс информация -->
    <div class="p-3 bg-white rounded-b-lg">
      <div class="flex items-center justify-center">
        <div class="text-center">
          <div class="text-sm font-medium text-gray-900">
            {{ props.selectedCourse }} курс {{ props.selectedDepartment }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  semester: {
    type: String,
    required: true
  },
  week: {
    type: Object,
    required: true
  },
  currentWeekNumber: {
    type: Number,
    default: 1
  },
  selectedDepartment: {
    type: String,
    required: true
  },
  selectedCourse: {
    type: String,
    required: true
  }
})

defineEmits(['week-change', 'department-change', 'course-change', 'specialty-change'])

const { getAllWeeks } = useAcademicWeeks()

const departmentOptions = [
  { label: 'ІПЗ - Інженерія програмного забезпечення', value: 'ІПЗ' },
  { label: 'АІ - Штучний інтелект', value: 'АІ' },
  { label: 'КБ - Кібербезпека', value: 'КБ' },
  { label: 'ІР - Інформаційні ресурси', value: 'ІР' },
  { label: 'МІТ - Медичні інформаційні технології', value: 'МІТ' },
  { label: 'УТБ - Управління та технології баз даних', value: 'УТБ' }
]

const courseOptions = [
  { label: '1 курс', value: '1' },
  { label: '2 курс', value: '2' },
  { label: '3 курс', value: '3' },
  { label: '4 курс', value: '4' },
  { label: 'Магістратура', value: 'М' }
]

const specialties = computed(() => [
  { code: 'ІПЗ', name: 'ІПЗ, ІТЗм', active: props.selectedDepartment === 'ІПЗ' },
  { code: 'АІ', name: 'АІ, ТІ', active: props.selectedDepartment === 'АІ' },
  { code: 'КБ', name: 'КБ, КБм', active: props.selectedDepartment === 'КБ' },
  { code: 'ІР', name: 'ІР, ІРма', active: props.selectedDepartment === 'ІР' },
  { code: 'МІТ', name: 'МІТ, МІТм', active: props.selectedDepartment === 'МІТ' },
  { code: 'УТБ', name: 'УТБ', active: props.selectedDepartment === 'УТБ' }
])

const allWeeks = getAllWeeks()
const canNavigatePrev = computed(() => props.currentWeekNumber > 1)
const canNavigateNext = computed(() => props.currentWeekNumber < allWeeks.length)
</script>
