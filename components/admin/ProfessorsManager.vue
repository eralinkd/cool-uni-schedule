<!-- components/admin/ProfessorsManager.vue -->
<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Управління викладачами</h2>
      <UButton color="primary" @click="openCreateModal">
        Додати викладача
      </UButton>
    </div>

    <UTable
      :data="professors"
      :columns="columns"
      :loading="loading"
    >
      <template #rate-cell="{ row }">
        {{ row.original.rate }}
      </template>
      <template #departments-cell="{ row }">
        {{ row.original.departments.map(d => d.name).join(', ') || '-' }}
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
              <!-- Username & Password (только при создании) -->
              <div v-if="!isEditing">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Логін
                </label>
                <UInput
                  v-model="form.username"
                  placeholder="Введіть логін"
                  required
                />
              </div>
              <div v-if="!isEditing">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Пароль
                </label>
                <UInput
                  v-model="form.password"
                  type="password"
                  placeholder="Введіть пароль"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Ім’я
                </label>
                <UInput
                  v-model="form.firstName"
                  placeholder="Введіть ім’я"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Прізвище
                </label>
                <UInput
                  v-model="form.lastName"
                  placeholder="Введіть прізвище"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Міський посилання (опційно)
                </label>
                <UInput
                  v-model="form.onlineLink"
                  placeholder="Вставте посилання (Zoom тощо)"
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
                  Рейтинг
                </label>
                <UInput
                  v-model.number="form.rate"
                  type="number"
                  min="0"
                  placeholder="Введіть рейтинг"
                  required
                />
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
            <h3 class="text-lg font-semibold">Підтвердження видалення</h3>
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
import { computed, onMounted, ref } from 'vue'
import { useDepartmentStore } from '~/stores/departmentStore'
import { useProfessorStore } from '~/stores/professorStore'

const professorStore = useProfessorStore()
const departmentStore = useDepartmentStore()

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'firstName', header: 'Ім’я' },
  { accessorKey: 'lastName', header: 'Прізвище' },
  { id: 'rate', header: 'Рейтинг' },
  { id: 'departments', header: 'Кафедри' },
  { id: 'actions', header: 'Дії' }
]

const professors = computed(() => {
  const data = professorStore.professors
  return Array.isArray(data) ? data : []
})
const loading = computed(() => professorStore.loading)

const departmentOptions = computed(() => {
  const deps = departmentStore.departments
  if (!Array.isArray(deps)) return []
  return deps.map(d => ({ label: d.name, value: d.id }))
})

// Modal state
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedProfessor = ref(null)
const submitting = ref(false)
const deleting = ref(false)

// Форма данных
const form = ref({
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  onlineLink: '',
  departmentId: null,
  rate: null
})

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    onlineLink: '',
    departmentId: null,
    rate: null
  }
  isModalOpen.value = true
}

const openEditModal = (prof) => {
  isEditing.value = true
  selectedProfessor.value = prof
  form.value = {
    // при редагуванні логін/пароль не потрібні
    username: '',
    password: '',
    firstName: prof.firstName,
    lastName: prof.lastName,
    onlineLink: prof.onlineLink || '',
    departmentId: prof.departments?.[0]?.id || null,
    rate: prof.rate
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  form.value = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    onlineLink: '',
    departmentId: null,
    rate: null
  }
  selectedProfessor.value = null
}

const confirmDelete = (prof) => {
  selectedProfessor.value = prof
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedProfessor.value = null
}

const handleSubmit = async() => {
  // Базова валідація
  if (
    !form.value.firstName.trim()
    || !form.value.lastName.trim()
    || !form.value.departmentId
    || form.value.rate === null
  ) {
    console.error('Всі обов’язкові поля мають бути заповнені')
    return
  }

  submitting.value = true
  try {
    if (isEditing.value) {
      await professorStore.updateProfessor(selectedProfessor.value.id, {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        departmentId: form.value.departmentId,
        rate: form.value.rate,
        onlineLink: form.value.onlineLink || ''
      })
    }
    else {
      // При створенні обов’язкові: username, password
      if (!form.value.username.trim() || !form.value.password) {
        console.error('Логін і пароль обов’язкові при створенні')
        submitting.value = false
        return
      }
      await professorStore.createProfessor({
        username: form.value.username,
        password: form.value.password,
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        departmentId: form.value.departmentId,
        rate: form.value.rate,
        onlineLink: form.value.onlineLink || ''
      })
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
    closeDeleteModal()
  }
  catch (error) {
    console.error('Error deleting professor:', error)
  }
  finally {
    deleting.value = false
  }
}

onMounted(async() => {
  await departmentStore.fetchDepartments()
  await professorStore.fetchProfessors()
})
</script>
