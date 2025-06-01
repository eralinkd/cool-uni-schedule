<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Управление предметами</h2>
      <UButton
        color="primary"
        @click="openCreateModal"
      >
        Добавить предмет
      </UButton>
    </div>

    <UTable
      :data="subjects"
      :columns="columns"
      :loading="loading"
    >
      <template #department-cell="{ row }">
        {{ row.original.department?.name || '-' }}
      </template>
      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-pencil-square"
            @click="openEditModal(row.original)"
          />
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="confirmDelete(row.original)"
          />
        </div>
      </template>
    </UTable>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        @click.self="closeModal"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50" />
        <div
          class="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-[101]"
          @click.stop
        >
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-lg font-semibold">
              {{ isEditing ? 'Редактировать предмет' : 'Новый предмет' }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="closeModal"
            />
          </div>

          <form
            class="p-4"
            @submit.prevent="handleSubmit"
            @click.stop
          >
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Название
                </label>
                <UInput
                  v-model="form.name"
                  placeholder="Введите название предмета"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Кафедра
                </label>
                <select
                  v-model="form.departmentId"
                  required
                  class="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">
                    Выберите кафедру
                  </option>
                  <option
                    v-for="dept in departmentOptions"
                    :key="dept.value"
                    :value="dept.value"
                  >
                    {{ dept.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Тип
                </label>
                <select
                  v-model="form.type"
                  class="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">
                    Выберите тип предмета
                  </option>
                  <option
                    v-for="type in subjectTypeOptions"
                    :key="type.value"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </option>
                </select>
              </div>
            </div>
          </form>

          <div class="flex justify-end gap-3 p-4 border-t">
            <UButton
              color="gray"
              variant="ghost"
              @click="closeModal"
            >
              Отмена
            </UButton>
            <UButton
              color="primary"
              :loading="submitting"
              @click="handleSubmit"
            >
              {{ isEditing ? 'Сохранить' : 'Создать' }}
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        @click.self="closeDeleteModal"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50" />
        <div
          class="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 z-[101]"
          @click.stop
        >
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-lg font-semibold">
              Подтверждение удаления
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="closeDeleteModal"
            />
          </div>

          <div class="p-4">
            <p>
              Вы уверены, что хотите удалить предмет "{{ selectedSubject?.name }}"?
            </p>
          </div>

          <div class="flex justify-end gap-3 p-4 border-t">
            <UButton
              color="gray"
              variant="ghost"
              @click="closeDeleteModal"
            >
              Отмена
            </UButton>
            <UButton
              color="red"
              :loading="deleting"
              @click="handleDelete"
            >
              Удалить
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const subjectStore = useSubjectStore()
const departmentStore = useDepartmentStore()

const columns = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Название'
  },
  {
    id: 'department',
    header: 'Кафедра'
  },
  {
    accessorKey: 'type',
    header: 'Тип'
  },
  {
    id: 'actions',
    header: 'Действия'
  }
]

const subjects = computed(() => {
  const data = subjectStore.subjects
  return Array.isArray(data) ? data : []
})
const loading = computed(() => subjectStore.loading)

// Department options for select
const departmentOptions = computed(() => {
  const departments = departmentStore.departments
  if (!Array.isArray(departments)) return []
  return departments.map(dept => ({
    label: dept.name,
    value: dept.id
  }))
})

const subjectTypeOptions = [
  { label: 'Лекция', value: 'LECTURE' },
  { label: 'Практика', value: 'PRACTICE' },
  { label: 'Лабораторная', value: 'LABORATORY' }
]

// Modal state
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedSubject = ref(null)
const submitting = ref(false)
const deleting = ref(false)

const form = ref({
  name: '',
  departmentId: null,
  type: null
})

// Methods
const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    name: '',
    departmentId: null,
    type: null
  }
  isModalOpen.value = true
}

const openEditModal = (subject) => {
  isEditing.value = true
  selectedSubject.value = subject
  form.value = {
    name: subject.name,
    departmentId: subject.department?.id,
    type: subject.type
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  form.value = {
    name: '',
    departmentId: null,
    type: null
  }
  selectedSubject.value = null
}

const confirmDelete = (subject) => {
  selectedSubject.value = subject
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedSubject.value = null
}

const handleSubmit = async() => {
  if (!form.value.name.trim()) {
    console.error('Name is required')
    return
  }

  submitting.value = true
  try {
    if (isEditing.value) {
      await subjectStore.updateSubject(selectedSubject.value.id, form.value)
      console.log('Subject updated successfully')
    }
    else {
      await subjectStore.createSubject(form.value)
      console.log('Subject created successfully')
    }
    closeModal()
  }
  catch (error) {
    console.error('Error submitting form:', error)
  }
  finally {
    submitting.value = false
  }
}

const handleDelete = async() => {
  deleting.value = true
  try {
    await subjectStore.removeSubject(selectedSubject.value.id)
    console.log('Subject deleted successfully')
    closeDeleteModal()
  }
  catch (error) {
    console.error('Error deleting subject:', error)
  }
  finally {
    deleting.value = false
  }
}

// Load initial data
onMounted(async() => {
  await Promise.all([
    subjectStore.fetchSubjects(),
    departmentStore.fetchDepartments()
  ])
})
</script>
