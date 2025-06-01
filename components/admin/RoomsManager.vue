<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Управление аудиториями</h2>
      <UButton
        color="primary"
        @click="openCreateModal"
      >
        Добавить аудиторию
      </UButton>
    </div>

    <UTable
      :data="rooms"
      :columns="columns"
      :loading="loading"
    >
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
              {{ isEditing ? 'Редактировать аудиторию' : 'Новая аудитория' }}
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
                  Номер
                </label>
                <UInput
                  v-model="form.number"
                  placeholder="Введите номер аудитории"
                  required
                />
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
                    Выберите тип аудитории
                  </option>
                  <option
                    v-for="type in roomTypeOptions"
                    :key="type.value"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Вместимость
                </label>
                <UInput
                  v-model="form.capacity"
                  type="number"
                  placeholder="Введите вместимость"
                  min="1"
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
              Вы уверены, что хотите удалить аудиторию "{{ selectedRoom?.number }}"?
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
const roomStore = useRoomStore()

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
    accessorKey: 'capacity',
    header: 'Вместимость'
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

const rooms = computed(() => {
  const data = roomStore.rooms
  return Array.isArray(data) ? data : []
})
const loading = computed(() => roomStore.loading)

const roomTypeOptions = [
  { label: 'Лекционная', value: 'LECTURE' },
  { label: 'Практическая', value: 'PRACTICE' },
  { label: 'Лабораторная', value: 'LABORATORY' },
  { label: 'Компьютерная', value: 'COMPUTER' }
]

// Modal state
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedRoom = ref(null)
const submitting = ref(false)
const deleting = ref(false)

const form = ref({
  number: '',
  capacity: null,
  type: null
})

// Methods
const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    number: '',
    capacity: null,
    type: null
  }
  isModalOpen.value = true
}

const openEditModal = (room) => {
  isEditing.value = true
  selectedRoom.value = room
  form.value = {
    number: room.number,
    capacity: room.capacity,
    type: room.type
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  form.value = {
    number: '',
    capacity: null,
    type: null
  }
  selectedRoom.value = null
}

const confirmDelete = (room) => {
  selectedRoom.value = room
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedRoom.value = null
}

const handleSubmit = async() => {
  if (!form.value.number.trim()) {
    console.error('Number is required')
    return
  }

  submitting.value = true
  try {
    if (isEditing.value) {
      await roomStore.updateRoom(selectedRoom.value.id, form.value)
      console.log('Room updated successfully')
    }
    else {
      await roomStore.createRoom(form.value)
      console.log('Room created successfully')
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
    await roomStore.removeRoom(selectedRoom.value.id)
    console.log('Room deleted successfully')
    closeDeleteModal()
  }
  catch (error) {
    console.error('Error deleting room:', error)
  }
  finally {
    deleting.value = false
  }
}
</script>
