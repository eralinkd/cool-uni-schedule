<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
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

    <div class="p-3 bg-gray-50 border-b border-gray-200">
      <div class="flex items-center gap-4 text-sm">
        <div class="flex items-center gap-2">
          <label class="text-gray-600">
            Кафедра:
          </label>
          <USelect
            :model-value="selectedDepartmentId"
            :items="departmentOptions"
            size="sm"
            class="w-48"
            :disabled="!canEdit"
            @update:model-value="$emit('department-change', $event)"
          />
        </div>
      </div>
    </div>

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

    <div class="p-3 bg-white rounded-b-lg">
      <div class="flex items-center justify-center">
        <div class="text-center">
          <div class="text-sm font-medium text-gray-900">
            {{ selectedDepartmentName }}
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
  selectedDepartmentId: {
    type: Number,
    default: null
  },
  selectedCourse: {
    type: Number,
    required: true
  },
  departments: {
    type: Array,
    default: () => []
  },
  canEdit: {
    type: Boolean,
    default: true
  }
})

defineEmits(['week-change', 'department-change', 'course-change', 'specialty-change'])

const { getAllWeeks } = useAcademicWeeks()

// Формируем опции департаментов из реальных данных
const departmentOptions = computed(() => {
  return props.departments.map(dept => ({
    label: dept.name,
    value: dept.id
  }))
})

// Получаем выбранный департамент
const selectedDepartment = computed(() => {
  return props.departments.find(d => d.id === props.selectedDepartmentId)
})

// Отображаемое имя департамента
const selectedDepartmentName = computed(() => {
  return selectedDepartment.value?.name || ''
})

// Специальности формируем из департаментов
const specialties = computed(() => {
  return props.departments.map(dept => ({
    code: dept.id,
    name: dept.name,
    active: dept.id === props.selectedDepartmentId
  }))
})

const allWeeks = getAllWeeks()
const canNavigatePrev = computed(() => props.currentWeekNumber > 1)
const canNavigateNext = computed(() => props.currentWeekNumber < allWeeks.length)
</script>
