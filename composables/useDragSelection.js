export const useDragSelection = () => {
  const isSelecting = ref(false)
  const selectedCells = ref(new Set())
  const startCell = ref(null)
  const currentCell = ref(null)
  const initialSelection = ref(new Set()) // Сохраняем изначальный выбор

  const startSelection = (cellId, cellData, addToSelection = false) => {
    console.log('startSelection called:', { cellId, addToSelection, currentSize: selectedCells.value.size })
    
    isSelecting.value = true
    startCell.value = { id: cellId, data: cellData }
    currentCell.value = { id: cellId, data: cellData }
    
    // Сохраняем текущий выбор если добавляем
    if (addToSelection) {
      initialSelection.value = new Set(selectedCells.value)
    } else {
      initialSelection.value.clear()
      selectedCells.value.clear()
      console.log('Selection cleared in startSelection')
    }
    
    selectedCells.value.add(cellId)
  }

  const updateSelection = (cellId, cellData) => {
    if (!isSelecting.value || !startCell.value) return

    currentCell.value = { id: cellId, data: cellData }

    // Получаем координаты начальной и текущей ячейки
    const startCoords = parseCellId(startCell.value.id)
    const currentCoords = parseCellId(cellId)

    if (!startCoords || !currentCoords) return

    // Определяем область выделения
    const minSlot = Math.min(startCoords.timeSlotId, currentCoords.timeSlotId)
    const maxSlot = Math.max(startCoords.timeSlotId, currentCoords.timeSlotId)
    const minGroup = Math.min(startCoords.groupId, currentCoords.groupId)
    const maxGroup = Math.max(startCoords.groupId, currentCoords.groupId)
    const minSubgroup = Math.min(startCoords.subgroupId, currentCoords.subgroupId)
    const maxSubgroup = Math.max(startCoords.subgroupId, currentCoords.subgroupId)

    // Начинаем с изначального выбора
    selectedCells.value = new Set(initialSelection.value)

    // Добавляем новые ячейки
    for (let slot = minSlot; slot <= maxSlot; slot++) {
      for (let group = minGroup; group <= maxGroup; group++) {
        for (let subgroup = minSubgroup; subgroup <= maxSubgroup; subgroup++) {
          const cellId = `slot-${slot}-group-${group}-subgroup-${subgroup}`
          selectedCells.value.add(cellId)
        }
      }
    }
  }

  const endSelection = () => {
    isSelecting.value = false
    initialSelection.value.clear() // Очищаем временное хранилище
    // Сохраняем выделение
    return Array.from(selectedCells.value)
  }

  const clearSelection = () => {
    console.log('clearSelection called, clearing', selectedCells.value.size, 'cells')
    selectedCells.value.clear()
    initialSelection.value.clear()
    isSelecting.value = false
    startCell.value = null
    currentCell.value = null
  }

  const isCellSelected = (cellId) => {
    return selectedCells.value.has(cellId)
  }

  // Добавляем или удаляем одну ячейку из выбора
  const toggleCellSelection = (cellId) => {
    if (selectedCells.value.has(cellId)) {
      selectedCells.value.delete(cellId)
    } else {
      selectedCells.value.add(cellId)
    }
  }

  // Добавляем ячейку в выбор
  const addCellToSelection = (cellId) => {
    selectedCells.value.add(cellId)
  }

  // Удаляем ячейку из выбора
  const removeCellFromSelection = (cellId) => {
    selectedCells.value.delete(cellId)
  }

  // Получаем количество выбранных ячеек
  const getSelectedCount = () => {
    return selectedCells.value.size
  }

  // Парсим ID ячейки для получения координат
  const parseCellId = (cellId) => {
    const match = cellId.match(/slot-(\d+)-group-(\d+)-subgroup-(\d+)/)
    if (!match) return null

    return {
      timeSlotId: parseInt(match[1]),
      groupId: parseInt(match[2]),
      subgroupId: parseInt(match[3])
    }
  }

  // Создаем ID ячейки из компонентов
  const createCellId = (timeSlotId, groupId, subgroupId) => {
    return `slot-${timeSlotId}-group-${groupId}-subgroup-${subgroupId}`
  }

  const getSelectionBounds = () => {
    if (selectedCells.value.size === 0) return null

    const coords = Array.from(selectedCells.value)
      .map(parseCellId)
      .filter(Boolean)

    if (coords.length === 0) return null

    return {
      minSlot: Math.min(...coords.map(c => c.timeSlotId)),
      maxSlot: Math.max(...coords.map(c => c.timeSlotId)),
      minGroup: Math.min(...coords.map(c => c.groupId)),
      maxGroup: Math.max(...coords.map(c => c.groupId)),
      minSubgroup: Math.min(...coords.map(c => c.subgroupId)),
      maxSubgroup: Math.max(...coords.map(c => c.subgroupId))
    }
  }

  return {
    isSelecting,
    selectedCells,
    startSelection,
    updateSelection,
    endSelection,
    clearSelection,
    isCellSelected,
    toggleCellSelection,
    addCellToSelection,
    removeCellFromSelection,
    getSelectedCount,
    createCellId,
    getSelectionBounds
  }
}
