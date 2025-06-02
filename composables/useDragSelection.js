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

    currentCell.value = { id: cellId, data: cellData }

    const startCoords = parseCellId(startCell.value.id)
    const currentCoords = parseCellId(cellId)

    if (!startCoords || !currentCoords) return

    if (startCoords.dayId !== currentCoords.dayId) return

    const minSlot = Math.min(startCoords.timeSlotId, currentCoords.timeSlotId)
    const maxSlot = Math.max(startCoords.timeSlotId, currentCoords.timeSlotId)
    const minGroup = Math.min(startCoords.groupId, currentCoords.groupId)
    const maxGroup = Math.max(startCoords.groupId, currentCoords.groupId)
    const minSubgroup = Math.min(startCoords.subgroupId, currentCoords.subgroupId)
    const maxSubgroup = Math.max(startCoords.subgroupId, currentCoords.subgroupId)

    selectedCells.value = new Set(initialSelection.value)

    for (let slot = minSlot; slot <= maxSlot; slot++) {
      for (let group = minGroup; group <= maxGroup; group++) {
        for (let subgroup = minSubgroup; subgroup <= maxSubgroup; subgroup++) {
          const cellId = `day-${startCoords.dayId}-slot-${slot}-group-${group}-subgroup-${subgroup}`
          if (isCellAvailable(cellId)) {
            selectedCells.value.add(cellId)
          }
        }
      }
    }
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

  const removeCellFromSelection = (cellId) => {
    selectedCells.value.delete(cellId)
  }

  const getSelectedCount = () => {
    return selectedCells.value.size
  }

  const parseCellId = (cellId) => {
    const match = cellId.match(/day-(\d+)-slot-(\d+)-group-(\d+)-subgroup-(\d+)/)
    if (!match) return null

    return {
      dayId: Number.parseInt(match[1]),
      timeSlotId: Number.parseInt(match[2]),
      groupId: Number.parseInt(match[3]),
      subgroupId: Number.parseInt(match[4])
    }
  }

  const createCellId = (dayId, timeSlotId, groupId, subgroupId) => {
    return `day-${dayId}-slot-${timeSlotId}-group-${groupId}-subgroup-${subgroupId}`
  }

  const getSelectionBounds = () => {
    if (selectedCells.value.size === 0) return null

    const coords = Array.from(selectedCells.value)
      .map(parseCellId)
      .filter(Boolean)

    if (coords.length === 0) return null

    return {
      dayId: coords[0].dayId,
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
    getSelectionBounds,
    registerAvailableCell,
    clearAvailableCells,
    isCellAvailable
  }
}
