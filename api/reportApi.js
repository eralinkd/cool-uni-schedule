export const useRoomSuggestionApi = () => {
  const { $api } = useNuxtApp()

  const getReportRoomUtilization = async(data) => {
    const response = await $api.get('/api/report/room-utilization', data)
    return response
  }

  const getReportProfessorLoad = async(data) => {
    const response = await $api.get('/api/report/professor-load', data)
    return response
  }

  return { getReportRoomUtilization, getReportProfessorLoad }
}
