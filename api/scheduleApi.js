// все вызовы 1-в-1 со swagger
export const useScheduleApi = () => {
  const { $api } = useNuxtApp()

  /* --- CRUD --- */
  const getAllEntries = async() => (await $api.get('/api/schedule')).data
  const getEntry = async id => (await $api.get(`/api/schedule/${id}`)).data
  const createEntry = async dto => (await $api.post('/api/schedule', dto)).data
  const updateEntry = async(id, dto) =>
    (await $api.put(`/api/schedule/${id}`, dto)).data
  const deleteEntry = async id =>
    (await $api.delete(`/api/schedule/${id}`)).data

  /* --- фильтры / helper-ручки --- */
  const filter = async(p = {}) =>
    (await $api.get('/api/schedule/filter', { params: p })).data

  const suggestRoomsForGroup = async({ groupId, date, startTime, endTime }) =>
    (await $api.get('/api/schedule/suggest-rooms-for-group', { params: {
      groupId, date, startTime, endTime
    } })).data

  const suggestRoomsForSubgroup = async({ subgroupId, date, startTime, endTime }) =>
    (await $api.get('/api/schedule/suggest-rooms-for-subgroup', { params: {
      subgroupId, date, startTime, endTime
    } })).data

  const getAvailableProfessors = async({ subjectId, date, startTime, endTime }) =>
    (await $api.get('/api/schedule/available-professors', { params: {
      subjectId, date, startTime, endTime
    } })).data

  const getAvailableRooms = async p =>
    (await $api.get('/api/schedule/available-rooms', { params: p })).data

  return {
    getAllEntries, getEntry, createEntry, updateEntry, deleteEntry,
    filter,
    suggestRoomsForGroup, suggestRoomsForSubgroup,
    getAvailableProfessors, getAvailableRooms
  }
}
