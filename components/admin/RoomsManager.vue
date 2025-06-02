<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Управління аудиторіями</h2>
      <UButton
        color="primary"
        @click="openCreateModal"
      >
        Додати аудиторію
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
              {{ isEditing ? 'Редагувати аудиторію' : 'Нова аудиторія' }}
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
                  Назва
                </label>
                <UInput
                  v-model="form.name"
                  placeholder="Введіть назву аудиторії"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Місткість
                </label>
                <UInput
                  v-model.number="form.capacity"
                  type="number"
                  placeholder="Введіть місткість"
                  min="1"
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
              Скасувати
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
              Ви впевнені, що хочете видалити аудиторію "{{ selectedRoom?.name }}"?
            </p>
          </div>

          <div class="flex justify-end gap-3 p-4 border-t">
            <UButton
              color="gray"
              variant="ghost"
              @click="closeDeleteModal"
            >
              Скасувати
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
const roomStore = useRoomStore()

const columns = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Назва'
  },
  {
    accessorKey: 'capacity',
    header: 'Місткість'
  },
  {
    id: 'actions',
    header: 'Дії'
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
  name: '',
  capacity: null,
  type: null
})

// Methods
const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    name: '',
    capacity: null,
    type: null
  }
  isModalOpen.value = true
}

const openEditModal = (room) => {
  isEditing.value = true
  selectedRoom.value = room
  form.value = {
    name: room.name,
    capacity: room.capacity,
    type: room.type
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  form.value = {
    name: '',
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
  if (!form.value.name.trim()) {
    console.error('Name is required')
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
