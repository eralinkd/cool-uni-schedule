export const useDragSelection = () => {
  const isSelecting = ref(false)
  const selectedCells = ref(new Set())
  const startCell = ref(null)
  const currentCell = ref(null)
  const initialSelection = ref(new Set())
  const availableCells = ref(new Set())

  const registerAvailableCell = (cellId) => {
    availableCells.value.add(cellId)
  }

  const clearAvailableCells = () => {
    availableCells.value.clear()
  }

  const getAvailableCellsCount = () => {
    return availableCells.value.size
  }

  const isCellAvailable = (cellId) => {
    return availableCells.value.has(cellId)
  }

  const startSelection = (cellId, cellData, addToSelection = false) => {
    console.log('startSelection called:', { cellId, addToSelection, currentSize: selectedCells.value.size })

    isSelecting.value = true
    startCell.value = { id: cellId, data: cellData }
    currentCell.value = { id: cellId, data: cellData }

    if (addToSelection) {
      initialSelection.value = new Set(selectedCells.value)
    }
    else {
      initialSelection.value.clear()
      selectedCells.value.clear()
      console.log('Selection cleared in startSelection')
    }

    selectedCells.value.add(cellId)
  }

  const updateSelection = (cellId, cellData) => {
    if (!isSelecting.value || !startCell.value) return

    console.log('updateSelection called:', { cellId, startCell: startCell.value.id })

    currentCell.value = { id: cellId, data: cellData }

    const startCoords = parseCellId(startCell.value.id)
    const currentCoords = parseCellId(cellId)

    if (!startCoords || !currentCoords) {
      console.log('Failed to parse cell IDs:', { startCoords, currentCoords })
      return
    }

    console.log('Parsed coords:', { startCoords, currentCoords })

    if (startCoords.dayId !== currentCoords.dayId) {
      console.log('Different days, skipping selection')
      return
    }

    const minSlot = Math.min(startCoords.timeSlotId, currentCoords.timeSlotId)
    const maxSlot = Math.max(startCoords.timeSlotId, currentCoords.timeSlotId)

    console.log('Selection range:', { minSlot, maxSlot })

    // Получаем все доступные ячейки для этого дня
    const dayPrefix = `day-${startCoords.dayId}-`
    const availableCellsForDay = Array.from(availableCells.value)
      .filter(cellId => cellId.startsWith(dayPrefix))
      .map(cellId => ({ cellId, coords: parseCellId(cellId) }))
      .filter(item => item.coords !== null)

    console.log('Available cells for day:', availableCellsForDay.length)

    // Находим уникальные группы, упорядоченные по их появлению в таблице
    const uniqueGroups = [...new Set(availableCellsForDay.map(item => item.coords.groupId))]

    console.log('Unique groups:', uniqueGroups)

    // Находим индексы start и current координат
    const startGroupIndex = uniqueGroups.indexOf(startCoords.groupId)
    const currentGroupIndex = uniqueGroups.indexOf(currentCoords.groupId)

    if (startGroupIndex === -1 || currentGroupIndex === -1) {
      console.log('Could not find indices for coordinates')
      return
    }

    // Определяем диапазоны индексов
    const minGroupIndex = Math.min(startGroupIndex, currentGroupIndex)
    const maxGroupIndex = Math.max(startGroupIndex, currentGroupIndex)

    console.log('Index ranges:', { minGroupIndex, maxGroupIndex })

    selectedCells.value = new Set(initialSelection.value)

    let addedCells = 0
    // Проходим по всем ячейкам в прямоугольной области
    for (let slot = minSlot; slot <= maxSlot; slot++) {
      for (let groupIndex = minGroupIndex; groupIndex <= maxGroupIndex; groupIndex++) {
        const groupId = uniqueGroups[groupIndex]
        const testCellId = `day-${startCoords.dayId}-slot-${slot}-group-${groupId}`

        if (isCellAvailable(testCellId)) {
          selectedCells.value.add(testCellId)
          addedCells++
        }
      }
    }

    console.log('updateSelection result:', { addedCells, totalSelected: selectedCells.value.size })
  }

  const endSelection = () => {
    isSelecting.value = false
    initialSelection.value.clear()
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

  const toggleCellSelection = (cellId) => {
    if (selectedCells.value.has(cellId)) {
      selectedCells.value.delete(cellId)
    }
    else {
      selectedCells.value.add(cellId)
    }
  }

  const addCellToSelection = (cellId) => {
    if (isCellAvailable(cellId)) {
      selectedCells.value.add(cellId)
    }
  }

  const setSelection = (cellIds) => {
    clearSelection()
    cellIds.forEach((cellId) => {
      if (isCellAvailable(cellId)) {
        selectedCells.value.add(cellId)
      }
    })
  }

  const removeCellFromSelection = (cellId) => {
    selectedCells.value.delete(cellId)
  }

  const getSelectedCount = () => {
    return selectedCells.value.size
  }

  const parseCellId = (cellId) => {
    const match = cellId.match(/day-(\d+)-slot-(\d+)-group-(.+)/)
    if (!match) return null

    return {
      dayId: Number.parseInt(match[1]),
      timeSlotId: Number.parseInt(match[2]),
      groupId: match[3]
    }
  }

  const createCellId = (dayId, timeSlotId, groupId) => {
    return `day-${dayId}-slot-${timeSlotId}-group-${groupId}`
  }

  const getSelectionBounds = () => {
    if (selectedCells.value.size === 0) return null

    const coords = Array.from(selectedCells.value)
      .map(parseCellId)
      .filter(Boolean)

    if (coords.length === 0) return null

    // Получаем все уникальные значения
    const dayIds = [...new Set(coords.map(c => c.dayId))]
    const timeSlotIds = coords.map(c => c.timeSlotId)
    const groupIds = [...new Set(coords.map(c => c.groupId))]

    return {
      dayId: dayIds[0], // Предполагаем что выбор в пределах одного дня
      minSlot: Math.min(...timeSlotIds),
      maxSlot: Math.max(...timeSlotIds),
      groupIds: groupIds,
      // Оставляем старые поля для обратной совместимости
      groupId: groupIds[0],
      minGroup: groupIds[0],
      maxGroup: groupIds[groupIds.length - 1]
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
    setSelection,
    removeCellFromSelection,
    getSelectedCount,
    createCellId,
    getSelectionBounds,
    registerAvailableCell,
    clearAvailableCells,
    getAvailableCellsCount,
    isCellAvailable
  }
}
