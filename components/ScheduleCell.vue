<template>
  <td
    ref="cellRef"
    class="border-r border-gray-200 p-1 align-top min-w-32 h-20 cursor-pointer
           hover:bg-blue-50 focus:bg-blue-50 relative group select-none"
    :class="{
      'bg-blue-100': isSelected,
      'bg-green-50': hasLesson,
      'bg-blue-200': isDragSelected,
      'cursor-crosshair': dragSelection && dragSelection.isSelecting.value,
    }"
    tabindex="0"
    @mousedown="handleMouseDown"
    @mouseenter="handleMouseEnter"
    @click="handleCellClick"
    @dblclick="handleDoubleClick"
    @contextmenu="handleRightClick"
  >
    <div v-if="lessonData" class="text-xs space-y-1 pointer-events-none">
      <div class="font-medium text-gray-900 leading-tight">
        {{ lessonData.subject }}
      </div>

      <div class="text-gray-700 leading-tight">
        {{ lessonData.professor }}
      </div>

      <div class="flex flex-col space-y-0.5">
        <div v-if="lessonData.platform" class="text-blue-600 underline">
          {{ lessonData.platform }}
        </div>

        <div v-if="lessonData.room" class="text-gray-600">
          {{ lessonData.room }}
        </div>

        <div v-if="lessonData.dates" class="text-gray-600">
          {{ lessonData.dates }}
        </div>
      </div>
    </div>

    <div v-else class="w-full h-full flex items-center justify-center pointer-events-none">
      <div class="w-2 h-2 bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>

    <div
      v-if="isSelected"
      class="absolute inset-0 border-2 border-blue-500 pointer-events-none"
    />

    <div
      v-if="isDragSelected"
      class="absolute inset-0 border-2 border-blue-400 bg-blue-100 bg-opacity-50 pointer-events-none"
    />
  </td>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  day: {
    type: Object,
    required: true
  },
  timeSlot: {
    type: Object,
    required: true
  },
  group: {
    type: Object,
    required: true
  },
  subgroup: {
    type: Object,
    required: true
  },
  lessonData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select', 'edit', 'drag-start', 'drag-update', 'drag-end'])

const cellRef = ref(null)
let wasDragging = false
let dragStarted = false
let startMousePos = { x: 0, y: 0 }
const MIN_DRAG_DISTANCE = 8

const dragSelection = inject('dragSelection', null)

if (!dragSelection) {
  console.error('DragSelection not provided')
}
else {
  onMounted(() => {
    if (cellId.value) {
      dragSelection.registerAvailableCell(cellId.value)
    }
  })
}

const cellId = computed(() => {
  if (!dragSelection) return null
  return `day-${props.day.id}-slot-${props.timeSlot.id}-group-${props.group.id}-subgroup-${props.subgroup.id}`
})

const hasLesson = computed(() => {
  return props.lessonData !== null
})

const isSelected = computed(() => {
  if (!dragSelection || !cellId.value) return false
  return dragSelection.isCellSelected(cellId.value)
})

const isDragSelected = computed(() => {
  return isSelected.value
})

const handleMouseDown = (event) => {
  if (event.button !== 0) return
  if (!dragSelection || !cellId.value) return

  event.preventDefault()

  dragStarted = true
  wasDragging = false

  startMousePos = { x: event.clientX, y: event.clientY }

  document.addEventListener('mouseup', handleGlobalMouseUp)
  document.addEventListener('mousemove', handleGlobalMouseMove)
}

const handleGlobalMouseMove = (event) => {
  if (dragStarted && !wasDragging) {
    const dx = event.clientX - startMousePos.x
    const dy = event.clientY - startMousePos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance >= MIN_DRAG_DISTANCE) {
      wasDragging = true
      console.log('Drag started after moving', distance, 'pixels')

      if (!dragSelection || !cellId.value) return

      const cellData = {
        day: props.day,
        timeSlot: props.timeSlot,
        group: props.group,
        subgroup: props.subgroup,
        lessonData: props.lessonData
      }

      dragSelection.startSelection(cellId.value, cellData, true)
      emit('drag-start', { cellId: cellId.value, cellData })
    }
  }
}

const handleMouseEnter = () => {
  if (!dragSelection || !dragSelection.isSelecting.value || !cellId.value) return

  const cellData = {
    day: props.day,
    timeSlot: props.timeSlot,
    group: props.group,
    subgroup: props.subgroup,
    lessonData: props.lessonData
  }

  dragSelection.updateSelection(cellId.value, cellData)
  emit('drag-update', { cellId: cellId.value, cellData })
}

const handleMouseUp = () => {
  if (!dragSelection || !dragSelection.isSelecting.value) return

  const selectedCells = dragSelection.endSelection()
  emit('drag-end', { selectedCells, bounds: dragSelection.getSelectionBounds() })

  document.removeEventListener('mouseup', handleGlobalMouseUp)
  document.removeEventListener('mousemove', handleGlobalMouseMove)
}

const handleGlobalMouseUp = () => {
  dragStarted = false

  if (dragSelection && dragSelection.isSelecting.value) {
    handleMouseUp()
  }

  document.removeEventListener('mousemove', handleGlobalMouseMove)
  document.removeEventListener('mouseup', handleGlobalMouseUp)
}

const handleCellClick = (event) => {
  if (!dragSelection || !cellId.value) return

  if (wasDragging) {
    wasDragging = false
    return
  }

  console.log('Cell click:', cellId.value)

  if (event.shiftKey) {
    dragSelection.clearSelection()
    console.log('Selection cleared with Shift+click')
    return
  }

  const isCurrentlySelected = dragSelection.isCellSelected(cellId.value)

  if (isCurrentlySelected) {
    dragSelection.removeCellFromSelection(cellId.value)
    console.log('Cell removed from selection')
  }
  else {
    dragSelection.addCellToSelection(cellId.value)
    console.log('Cell added to selection')
  }

  const cellData = {
    day: props.day,
    timeSlot: props.timeSlot,
    group: props.group,
    subgroup: props.subgroup,
    lessonData: props.lessonData,
    selected: dragSelection.isCellSelected(cellId.value)
  }

  emit('select', cellData)
}

const handleRightClick = (event) => {
  event.preventDefault()

  if (!dragSelection) return

  dragSelection.clearSelection()
  console.log('Selection cleared')
}

const handleDoubleClick = () => {
  const cellData = {
    day: props.day,
    timeSlot: props.timeSlot,
    group: props.group,
    subgroup: props.subgroup,
    lessonData: props.lessonData
  }

  emit('edit', cellData)
}

onUnmounted(() => {
  document.removeEventListener('mouseup', handleGlobalMouseUp)
  document.removeEventListener('mousemove', handleGlobalMouseMove)
})
</script>
