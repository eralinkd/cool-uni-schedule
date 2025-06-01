
export const useSubjectApi = () => {
  const { $api } = useNuxtApp()

  const getSubject = async(id) => {
    const response = await $api.get(`/api/subjects/${id}`)
    return response
  }
  return { getSubject }
}
