export const useRoomSuggestionApi = () => {
  const { $api } = useNuxtApp()

  const getRoomSuggestionsForSubgroup = async(data) => {
    const response = await $api.get('/api/schedule/suggest-rooms-for-subgroup', data)
    return response
  }

  const getRoomSuggestionsForGroup = async(data) => {
    const response = await $api.get('/api/schedule/suggest-rooms-for-group', data)
    return response
  }

  return { getRoomSuggestionsForSubgroup, getRoomSuggestionsForGroup }
}
