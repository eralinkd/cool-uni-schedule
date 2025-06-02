<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Управління викладачами</h2>
      <UButton
        color="primary"
        @click="openCreateModal"
      >
        Додати викладача
      </UButton>
    </div>

    <UTable
      :data="professors"
      :columns="columns"
      :loading="loading"
    >
      <template #departments-cell="{ row }">
        {{ row.original.departments?.map(d => d.name).join(', ') || '-' }}
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
              {{ isEditing ? 'Редагувати викладача' : 'Новий викладач' }}
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
                  Імя
                </label>
                <UInput
                  v-model="form.firstName"
                  placeholder="Введіть імя"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Фамілія
                </label>
                <UInput
                  v-model="form.lastName"
                  placeholder="Введіть фамілію"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <UInput
                  v-model="form.email"
                  type="email"
                  placeholder="Введіть email"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Логін
                </label>
                <UInput
                  v-model="form.username"
                  placeholder="Введіть логін"
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
                    Оберіть кафедру
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
              Відміна
            </UButton>
            <UButton
              color="primary"
              :loading="submitting"
              @click="handleSubmit"
            >
              {{ isEditing ? 'Зберегти' : 'Створити' }}
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
              Підтвердження видалення
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
              Ви впевнені, що хочете видалити викладача
              "{{ selectedProfessor?.firstName }} {{ selectedProfessor?.lastName }}"?
            </p>
          </div>

          <div class="flex justify-end gap-3 p-4 border-t">
            <UButton
              color="gray"
              variant="ghost"
              @click="closeDeleteModal"
            >
              Відміна
            </UButton>
            <UButton
              color="red"
              :loading="deleting"
              @click="handleDelete"
            >
              Видалити
            </UButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const professorStore = useProfessorStore()
const departmentStore = useDepartmentStore()

const columns = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'firstName',
    header: 'Імя'
  },
  {
    accessorKey: 'lastName',
    header: 'Фамілія'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    id: 'departments',
    header: 'Кафедри'
  },
  {
    id: 'actions',
    header: 'Дії'
  }
]

const professors = computed(() => {
  const data = professorStore.professors
  return Array.isArray(data) ? data : []
})
const loading = computed(() => professorStore.loading)

// Department options for select
const departmentOptions = computed(() => {
  const departments = departmentStore.departments
  if (!Array.isArray(departments)) return []
  return departments.map(dept => ({
    label: dept.name,
    value: dept.id
  }))
})

// Modal state
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedProfessor = ref(null)
const submitting = ref(false)
const deleting = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  departmentId: '',
  username: ''
})

// Methods
const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
    username: ''
  }
  isModalOpen.value = true
}

const openEditModal = (professor) => {
  isEditing.value = true
  selectedProfessor.value = professor
  form.value = {
    firstName: professor.firstName,
    lastName: professor.lastName,
    email: professor.email,
    departmentId: professor.department?.id || '',
    username: professor.username || ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
    username: ''
  }
  selectedProfessor.value = null
}

const confirmDelete = (professor) => {
  selectedProfessor.value = professor
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedProfessor.value = null
}

const handleSubmit = async() => {
  if (!form.value.firstName.trim() || !form.value.lastName.trim() || !form.value.email.trim()) {
    console.error('Required fields are missing')
    return
  }

  submitting.value = true
  try {
    if (isEditing.value) {
      await professorStore.updateProfessor(selectedProfessor.value.id, form.value)
      console.log('Professor updated successfully')
    }
    else {
      await professorStore.createProfessor(form.value)
      console.log('Professor created successfully')
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
    await professorStore.removeProfessor(selectedProfessor.value.id)
    console.log('Professor deleted successfully')
    closeDeleteModal()
  }
  catch (error) {
    console.error('Error deleting professor:', error)
  }
  finally {
    deleting.value = false
  }
}

// Load initial data
onMounted(async() => {
  await Promise.all([
    professorStore.fetchProfessors(),
    departmentStore.fetchDepartments()
  ])
})
</script>
